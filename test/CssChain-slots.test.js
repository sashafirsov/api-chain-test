import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../src/slots-in-shadow.js';
import { CssChain as $$ } from '../src/CssChain.js';

    function
hasEachLine( text, str ){ str.split('\n').forEach( s=>expect( text ).to.include(s.trim()) ) }

describe( 'CssChain slot methods', () =>
{
    it( 'default slots ',  async ()=>
    {
        const el = await fixture(html`<slots-in-shadow></slots-in-shadow>`);
        hasEachLine( el.$().innerText,
            `out of slot
            default slot
                inner 1
                inner 2
                    inner 1 in 2
                    inner 2 in 2
            prefix
            outer slot
            suffix`);

        const $slots = el.$().slot();
        expect( $slots.map( n=>n.name) ).to.eql(['', 'inner-1', 'inner-2', 'inner-2-1', 'inner-2-2', 'outer']);

        const checkDefaultSlots = $el=>
        {   hasEachLine( $el.slot('').innerText,
                `default slot
                inner 1
                inner 2
                inner 1 in 2
                inner 2 in 2`);
            expect( $el.slot('inner-1').innerText ).to.eq('inner 1');
            hasEachLine($el.slot('inner-2').innerText ,
                `inner 2
                inner 1 in 2
                inner 2 in 2`);
            expect( $el.slot('inner-2-1').innerText ).to.eq('inner 1 in 2');
            expect( $el.slot('inner-2-2').innerText ).to.eq('inner 2 in 2');
        };
        checkDefaultSlots( el.$() );
        checkDefaultSlots( $$(el) );
    });
    it( 'fallback HTML is same as slot without name',  async ()=>
    {
        const el = await fixture(html`<slots-in-shadow><p>fallback</p></slots-in-shadow>`);
        hasEachLine( el.$().innerText,
            `out of slot
            fallback
            outer slot`);
        const $slots = el.$().slot();
        expect( $slots.map( n=>n.name) ).to.eql(['', 'inner-1', 'inner-2', 'inner-2-1', 'inner-2-2', 'outer']);

        const checkDefaultSlots = $el=>
        {
            expect( $el.slot('').innerText ).to.eq('fallback');
            expect( $el.slot('inner-1').innerText ).to.eq('inner 1');
            hasEachLine($el.slot('inner-2').innerText ,
                `inner 2
                inner 1 in 2
                inner 2 in 2`);
            expect( $el.slot('inner-2-1').innerText ).to.eq('inner 1 in 2');
            expect( $el.slot('inner-2-2').innerText ).to.eq('inner 2 in 2');
        };
        checkDefaultSlots( el.$() );
        checkDefaultSlots( $$(el) );
    } );

    it( 'assignedElements()',  async ()=>
    {
        const el = await fixture(html`<slots-in-shadow><p>fallback</p></slots-in-shadow>`);
        const $arr = el.$().slot('').assignedElements();
        expect( $arr.length).to.eq(1);
        expect( $arr.tagName).to.eq('P');
        expect( $arr.innerText).to.eq('fallback');
    });

    it( 'slot without name, innerText',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                    <p>inner without slot</p>
                    <div slot>
                        without name
                    </div>
                </slots-in-shadow>`);
        hasEachLine( el.$().innerText,
            `out of slot
            inner without slot
            without name
            outer slot`);
        expect( el.$().slot('').innerText ).to.include('without name');

        const $arr = el.$().slot('').assignedElements();
        expect( $arr.length).to.eq(2);
        expect( $arr[0].tagName).to.eq('P');
        expect( $arr[1].tagName).to.eq('DIV');
        expect( $arr.innerText).to.include('inner without slot');
        expect( $arr.innerText).to.include('without name');
    });

    it( 'outer slot',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="outer">
                    outer replacement
                </div>
            </slots-in-shadow>`);
        expect( el.$().slot('outer').innerText ).to.eq('outer replacement');

        const $arr = el.$().slot('outer').assignedElements();
        expect( $arr.length).to.eq(1);
        expect( $arr[0].tagName).to.eq('DIV');
        expect( $arr.innerText).to.not.include('outer slot');
        expect( $arr.innerText).to.eq('outer replacement');
    });

} );
