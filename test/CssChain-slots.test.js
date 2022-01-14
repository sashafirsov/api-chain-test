import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../src/slots-in-shadow.js';
import { CssChain as $$ } from '../src/CssChain.js';
import { createTestTree, removeWhiteSpaceOnlyTextNodes } from '../src/slots-light-vs-shadow.js';

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

    it( 'assignedNodes()',  async ()=>
    {
        const el = await fixture(html`<slots-in-shadow>textnode<p>fallback</p></slots-in-shadow>`);
        const $arr = el.$().slot('').assignedNodes();
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
        expect( $arr.innerText.replace(/\s+/g,'') ).to.eq('AA');

        expect( el.$().slot('').innerText.trim() ).to.eq('A');
        expect( el.$().slot('outer').innerText ).to.eq('A');
        // native access to slots content
        expect( [...el.querySelectorAll('[slot]')].map(s=>s.innerText).join('')).to.eq('AA');

        el.$().slot('').innerText = 'B';
        expect( el.$().slot(',outer').innerText.replace(/\s+/g,'') ).to.eq('BA');

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
        expect( $arr.tagName ).to.eq(undefined);// document fragment
        expect( $arr.length ).to.eq(1);
        expect( $arr.slot('outer,').innerText.trim() ).to.eq('BB');
        expect(  $arr.slot('outer,').innerHTML ).to.eq( '<i slot="">B</i><i slot="outer">B</i>' );
    });
    it( 'slots(csv,text)',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">DEFAULT</div>
                <div slot="outer">OUTER</div>
            </slots-in-shadow>`);

        const $el = el.$()
        ,    $arr = $el.slot('outer,','B');
        expect( $arr ).to.eq($el);
        expect( $arr.length ).to.eq(1);
        expect( $arr.slot('outer,').innerText.trim() ).to.eq('BB');
    });
    it( 'slots( csv, cb(el,i,arr) )',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">DEFAULT</div>
                <div slot="outer">OUTER</div>
            </slots-in-shadow>`);
        expect( el.$().slot(',outer').innerText.replace(/\s+/g,'') ).to.eq('DEFAULTOUTER');

        const $arr = el.$().slot(',outer',(el,i,arr)=> '<b>'+i+'-'+slotText( el )+'-'+arr.length+'</b>');
        expect( $arr.length).to.eq(1);
        expect( $arr.slot('outer,').innerText.trim() ).to.eq('0-DEFAULT-21-OUTER-2');
    });
    it( 'slots().clear()',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">DEFAULT</div>
                <div slot="outer">OUTER</div>
            </slots-in-shadow>`);
        expect( el.$().slot(',outer').innerText.replace(/\s+/g,'') ).to.eq('DEFAULTOUTER');
        el.$().slot().clear();
        // clearing slots would reset to template values
        expect( el.$().slot('outer').innerText).to.contain('outer slot');
        expect( el.$().slot('').innerText).to.contain('default slot');
        expect( el.$().slot(',outer').length).to.eq(2);
    });
    it('13.1 createTestTree$: Complex case: Basi line.', async ()=>
    {   // complete set is covered by slots-light-vs-shadow.html, here is just complex case cloned
        const $ = $$
        , assert_equals = (a,b)=>expect(a).to.equal(b)
        , assert_array_equals = (a,b)=>expect(a).to.eql(b);
        const el = await fixture(
            html`<div>
                <div id="test_complex">
                <div id="host1">
                    <template data-mode="open">
                        <div id="host2">
                            <template data-mode="open">
                                <slot id="s5" name="slot5">#s5</slot>
                                <slot id="s6" name="slot6">#s6</slot>
                                <slot id="s7">#s7</slot>
                                <slot id="s8" name="slot8">#s8</slot>
                            </template>
                            <slot id="s1" name="slot1" slot="slot5">#s1</slot>
                            <slot id="s2" name="slot2" slot="slot6">#s2</slot>
                            <slot id="s3">#s3</slot>
                            <slot id="s4" name="slot4" slot="slot-none">#s4</slot>
                            <div id="c5" slot="slot5">#c5</div>
                            <div id="c6" slot="slot6">#c6</div>
                            <div id="c7">#c7</div>
                            <div id="c8" slot="slot-none">c8</div>
                        </div>
                    </template>
                    <div id="c1" slot="slot1">#c1</div>
                    <div id="c2" slot="slot2">#c2</div>
                    <div id="c3">#c3</div>
                    <div id="c4" slot="slot-none">#c4</div>
                </div>
            </div>
            </div>`);

        const test_complex = el.firstElementChild;
        let n = createTestTree(el.firstElementChild);
        removeWhiteSpaceOnlyTextNodes(n.test_complex);

        const shadow = $(test_complex).parent().$('.shadow');
        const light  = $(test_complex).parent().$('.light' );
        const assert_assignedSlot = (k,s) => {
            assert_equals( n[k].assignedSlot, s && n[s] ); // same in prev test
            expect(shadow.$('#'+k).assignedSlot || shadow.$('#host1').$('#'+k).assignedSlot || null)
                .to.equal( s
                           && (  shadow.$('#host1').slot().find( e=>e.id===s)
                                 || shadow.$('#host1').$('#host2').slot().find( e=>e.id===s)
                                 || null
                           )
            );
            expect(light.$('#'+k).parentElement || null).to.equal(s &&  light.$('#host1').slot().find( e=>e.id===s));
            // node.assignedSlot in light DOM equals the parent slot
        };
        const assert_assignedNodes = (k,arr)=>
        {   assert_array_equals( n[k].assignedNodes(), arr.map( e=>n[e] ) );
            expect( [].concat( shadow.$('#'+k).assignedNodes()
                    , shadow.$('#host1').$('#'+k).assignedNodes()
                    , shadow.$('#host1').$('#host2').$('#'+k).assignedNodes()
                ).map( e=>e.id )
            ).to.eql( arr );

            expect( light.$('#'+k).children.map( e=>e.id ) ).to.eql( arr );
            // node.assignedNodes in light DOM equals the child nodes
        };
        const assert_assignedNodesF = (k,arr)=>
        {   const F = { flatten: true };
            assert_array_equals( n[k].assignedNodes(F).filter( e=> e.nodeType !== 3 ), arr.map( e=>n[e] ) );
            expect( [].concat( shadow.$('#'+k).assignedNodes(F)
                    , shadow.$('#host1').$('#'+k).assignedNodes(F).filter( e=> e.nodeType !== 3 )
                    , shadow.$('#host1').$('#host2').$('#'+k).assignedNodes(F).filter( e=> e.nodeType !== 3 )
                ).map( e=>e.id )
            ).to.eql( arr );

            expect( light.$('#'+k).children.map( e=>e.tagName==='SLOT'?e.firstChild:e ).map( e=>e.id ) ).to.eql( arr );
            // node.assignedNodes in light DOM equals the child nodes
        };

        // same sequence as in prev test but testing using CssChain of shadow and light dom
        assert_assignedSlot('c1', 's1');
        assert_assignedSlot('c2', 's2');
        assert_assignedSlot('c3', 's3');
        assert_assignedSlot('c4', null);

        assert_assignedSlot('s1', 's5');
        assert_assignedSlot('s2', 's6');
        assert_assignedSlot('s3', 's7');
        assert_assignedSlot('s4', null);

        assert_assignedSlot('c5', 's5');
        assert_assignedSlot('c6', 's6');
        assert_assignedSlot('c7', 's7');
        assert_assignedSlot('c8', null);

        assert_assignedNodes('s1', ['c1']);
        assert_assignedNodes('s2', ['c2']);
        assert_assignedNodes('s3', ['c3']);
        assert_assignedNodes('s4', []);
        assert_assignedNodes('s5', ['s1', 'c5']);
        assert_assignedNodes('s6', ['s2', 'c6']);
        assert_assignedNodes('s7', ['s3', 'c7']);
        assert_assignedNodes('s8', []);

        assert_assignedNodesF('s1', ['c1']);
        assert_assignedNodesF('s2', ['c2']);
        assert_assignedNodesF('s3', ['c3']);
        // assert_array_equals(n.s4.assignedNodes({ flatten: true }), []); // text node #s4
        assert_assignedNodesF('s4', []);
        assert_assignedNodesF('s5', ['c1', 'c5']);
        assert_assignedNodesF('s6', ['c2', 'c6']);
        assert_assignedNodesF('s7', ['c3', 'c7']);
        // assert_array_equals(n.s8.assignedNodes({ flatten: true }), []); // text node #s8
        assert_assignedNodesF('s8', []);

        expect( shadow.$('#host1').text() ).to.equal( '#c1\n#c2\n#c3' );
        expect( shadow.$('#host1').$('#host2').text() ).to.equal( '#c5\n#c6\n#c7' );
        expect(  light.$('#host1').text() ).to.equal( '#c1\n#c5\n#c2\n#c6\n#c3\n#c7\n#s8' );
    });

} );
