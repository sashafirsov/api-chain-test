import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../src/slots-in-shadow.js';
import { CssChain as $$ } from '../src/CssChain.js';

    function
hasEachLine( text, str ){ str.split('\n').forEach( s=>expect( text ).to.include(s.trim()) ) }
    function
slotText( el ){ return el.assignedNodes().map(el=>(el.innerText||el.textContent).trim()).join('').trim() }

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
    it( 'innerText with slots',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">default slot replacement</div>
                <div slot="outer">outer replacement</div>
            </slots-in-shadow>`);

        const $arr = el.$('slot:not([name]),slot[name="outer"]');
        expect( $arr.length).to.eq(2);
        expect( $arr.innerText).to.include('default slot replacement');
        expect( $arr.innerText).to.include('outer replacement');

        $arr.innerText='A';
        expect( $arr.innerText).to.eq('AA');

        expect( el.$().slot('').innerText).to.eq('A');
        expect( el.$().slot('outer').innerText).to.eq('A');
        // native access to slots content
        expect( [...el.querySelectorAll('[slot]')].map(s=>s.innerText).join('')).to.eq('AA');

        el.$().slot('').innerText = 'B';
        expect( el.$().slot(',outer').innerText).to.eq('BA');

    });
    it( 'innerHTML with slots',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">default <s>slot</s> replacement</div>
                <div slot="outer">outer replacement</div>
            </slots-in-shadow>`);

        const $arr = el.$('slot:not([name]),slot[name="outer"]');
        expect( $arr.length).to.eq(2);
        expect( $arr.innerHTML).to.include('default <s>slot</s> replacement');
        expect( $arr.innerHTML).to.include('outer replacement');

        $arr.innerHTML='<i>A</i>';
        expect( $arr.innerHTML ).to.eq('<i slot="">A</i><i slot="outer">A</i>');

        expect( el.$().slot('').innerHTML).to.eq('<i slot="">A</i>');
        expect( el.$().slot('outer').innerHTML).to.eq('<i slot="outer">A</i>');
        // native access to slots content
        expect( [...el.querySelectorAll('[slot]')].map(s=>s.outerHTML).join('') ).to.eq('<i slot="">A</i><i slot="outer">A</i>');

        el.$().slot('').innerHTML = '<i>B</i>';
        expect( el.$().slot(',outer').innerHTML).to.eq('<i slot="">B</i><i slot="outer">A</i>');

        el.$().slot('outer,').html( (el,i)=>`<i>C${i}</i>`);
        expect( el.$().slot(',outer').innerHTML).to.eq('<i slot="">C0</i><i slot="outer">C1</i>');
    });
    it( 'slots(csv)',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">default <s>slot</s> replacement</div>
                <div slot="inner-1">S1</div>
                <div slot="inner-2">S2</div>
                <div slot="s3">S3</div>
            </slots-in-shadow>`);

        const $arr = el.$().slot('inner-1,inner-2');
        expect( $arr.length).to.eq(2);
        expect( $arr.innerText).to.eq('S1S2');
    });
    it( 'slots(csv,html)',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">DEFAULT</div>
                <div slot="outer">OUTER</div>
            </slots-in-shadow>`);

        const $arr = el.$().slot('outer,','<i>B</i>');
        expect( $arr.length).to.eq(2);
        expect( $arr.innerText).to.eq('BB');
    });
    it( 'slots(csv,text)',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">DEFAULT</div>
                <div slot="outer">OUTER</div>
            </slots-in-shadow>`);

        const $arr = el.$().slot('outer,','B');
        expect( $arr.length).to.eq(2);
        expect( $arr.innerText).to.eq('BB');
    });
    it( 'slots( csv, cb(el,i,arr) )',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">DEFAULT</div>
                <div slot="outer">OUTER</div>
            </slots-in-shadow>`);
        expect( el.$().slot(',outer').innerText).to.eq('DEFAULTOUTER');

        const $arr = el.$().slot(',outer',(el,i,arr)=> '<b>'+i+'-'+slotText( el )+'-'+arr.length+'</b>');
        expect( $arr.length).to.eq(2);
        expect( $arr.innerText).to.eq('0-DEFAULT-21-OUTER-2');
    });
} );
