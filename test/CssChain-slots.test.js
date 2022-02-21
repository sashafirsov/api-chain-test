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

        const $slots = el.$().slots();
        expect( $slots.map( n=>n.name) ).to.eql(['', 'inner-1', 'inner-2', 'inner-2-1', 'inner-2-2', 'outer']);

        const checkDefaultSlots = $el=>
        {   hasEachLine( $el.slots('').innerText,
                `default slot
                inner 1
                inner 2
                inner 1 in 2
                inner 2 in 2`);
            expect( $el.slots('inner-1').innerText ).to.eq('inner 1');
            hasEachLine($el.slots('inner-2').innerText ,
                `inner 2
                inner 1 in 2
                inner 2 in 2`);
            expect( $el.slots('inner-2-1').innerText ).to.eq('inner 1 in 2');
            expect( $el.slots('inner-2-2').innerText ).to.eq('inner 2 in 2');
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
        const $slots = el.$().slots();
        expect( $slots.map( n=>n.name) ).to.eql(['', 'inner-1', 'inner-2', 'inner-2-1', 'inner-2-2', 'outer']);

        const checkDefaultSlots = $el=>
        {
            expect( $el.slots('').innerText ).to.eq('fallback');
            expect( $el.slots('inner-1').innerText ).to.eq('inner 1');
            hasEachLine($el.slots('inner-2').innerText ,
                `inner 2
                inner 1 in 2
                inner 2 in 2`);
            expect( $el.slots('inner-2-1').innerText ).to.eq('inner 1 in 2');
            expect( $el.slots('inner-2-2').innerText ).to.eq('inner 2 in 2');
        };
        checkDefaultSlots( el.$() );
        checkDefaultSlots( $$(el) );
    } );

    it( 'assignedElements()',  async ()=>
    {
        const el = await fixture(html`<slots-in-shadow><p>fallback</p></slots-in-shadow>`);
        const $arr = el.$().slots('').assignedElements();
        expect( $arr.length).to.eq(1);
        expect( $arr.tagName).to.eq('P');
        expect( $arr.innerText).to.eq('fallback');
    });

    it( 'assignedNodes()',  async ()=>
    {
        const el = await fixture(html`<slots-in-shadow>textnode<p>fallback</p></slots-in-shadow>`);
        const $arr = el.$().slots('').assignedNodes();
        expect( $arr.length).to.eq(2);
        expect( $arr.innerText).to.eq('textnodefallback');
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
        expect( el.$().slots('').innerText ).to.include('without name');

        const $arr = el.$().slots('').assignedElements();
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
        expect( el.$().slots('outer').innerText ).to.eq('outer replacement');

        const $arr = el.$().slots('outer').assignedElements();
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
        expect( $arr.innerText.replace(/\s+/g,'') ).to.eq('AA');

        expect( el.$().slots('').innerText.trim() ).to.eq('A');
        expect( el.$().slots('outer').innerText ).to.eq('A');
        // native access to slots content
        expect( [...el.querySelectorAll('[slot]')].map(s=>s.innerText).join('')).to.eq('AA');

        el.$().slots('').innerText = 'B';
        expect( el.$().slots(',outer').innerText.replace(/\s+/g,'') ).to.eq('BA');

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

        expect( el.$().slots('').innerHTML).to.eq('<i slot="">A</i>');
        expect( el.$().slots('outer').innerHTML).to.eq('<i slot="outer">A</i>');
        // native access to slots content
        expect( [...el.querySelectorAll('[slot]')].map(s=>s.outerHTML).join('') ).to.eq('<i slot="">A</i><i slot="outer">A</i>');

        el.$().slots('').innerHTML = '<i>B</i>';
        expect( el.$().slots(',outer').innerHTML).to.eq('<i slot="">B</i><i slot="outer">A</i>');

        el.$().slots('outer,').html( (el,i)=>`<i>C${i}</i>`);
        expect( el.$().slots(',outer').innerHTML).to.eq('<i slot="">C0</i><i slot="outer">C1</i>');
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

        const $arr = el.$().slots('inner-1,inner-2');
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

        const $arr = el.$().slots('outer,','<i>B</i>');
        expect( $arr.tagName ).to.eq(undefined);// document fragment
        expect( $arr.length ).to.eq(1);
        expect( $arr.slots('outer,').innerText.trim() ).to.eq('BB');
        expect(  $arr.slots('outer,').innerHTML ).to.eq( '<i slot="">B</i><i slot="outer">B</i>' );
    });
    it( 'slots(csv,text)',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">DEFAULT</div>
                <div slot="outer">OUTER</div>
            </slots-in-shadow>`);

        const $el = el.$()
        ,    $arr = $el.slots('outer,','B');
        expect( $arr ).to.eq($el);
        expect( $arr.length ).to.eq(1);
        expect( $arr.slots('outer,').innerText.trim() ).to.eq('BB');
    });
    it( 'slots( csv, cb(el,i,arr) )',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">DEFAULT</div>
                <div slot="outer">OUTER</div>
            </slots-in-shadow>`);
        expect( el.$().slots(',outer').innerText.replace(/\s+/g,'') ).to.eq('DEFAULTOUTER');

        const $arr = el.$().slots(',outer',(el,i,arr)=> '<b>'+i+'-'+slotText( el )+'-'+arr.length+'</b>');
        expect( $arr.length).to.eq(1);
        expect( $arr.slots('outer,').innerText.trim() ).to.eq('0-DEFAULT-21-OUTER-2');
    });
    it( 'slots().erase()',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">DEFAULT</div>
                <div slot="outer">OUTER</div>
            </slots-in-shadow>`);
        expect( el.$().slots(',outer').innerText.replace(/\s+/g,'') ).to.eq('DEFAULTOUTER');
        el.$().slots().erase();
        // clearing slots would reset to template values
        expect( el.$().slots('outer').innerText).to.contain('outer slot');
        expect( el.$().slots('').innerText).to.contain('default slot');
        expect( el.$().slots(',outer').length).to.eq(2);
    });


} );
