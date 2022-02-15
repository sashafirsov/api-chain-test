import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../src/slots-in-shadow.js';
import { CssChain as $ } from '../src/CssChain.js';
import { createTestTree, removeWhiteSpaceOnlyTextNodes } from '../src/slots-light-vs-shadow.js';

    function
hasEachLine( text, str ){ str.split('\n').forEach( s=>expect( text ).to.include(s.trim()) ) }
    function
slotText( el ){ return el.assignedNodes().map(el=>(el.innerText||el.textContent).trim()).join('').trim() }

describe( 'CssChain template() variations', () =>
{
    it('template(): Light DOM Complex case', async ()=>
    {   // complete set is covered by slots-light-vs-shadow.html, here is just complex case cloned
        const assert_equals = (a,b)=>expect(a).to.equal(b)
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

        expect( shadow.$('#host1').txt() ).to.equal( '#c1\n#c2\n#c3' );
        expect( shadow.$('#host1').$('#host2').txt() ).to.equal( '#c5\n#c6\n#c7' );
        expect(  light.$('#host1').txt() ).to.equal( '#c1\n#c5\n#c2\n#c6\n#c3\n#c7\n#s8' );
    });
    it('test("template")', async ()=>
    {
        const el = await fixture(html`
            <div>
                <template>
                    <slot name="header"><header>head</header></slot>
                    <slot><main>default slot</main></slot>
                    <slot name="footer"><footer>foot</footer></slot>
                </template>
                <h1 slot="header">TOP</h1>
                <section slot="">MIDDLE</section>
                <b slot="footer">BOTTOM</b>
            </div>`);
        const $light = $(el).template('template');
        expect( $light.innerText).to.equal('TOP\nMIDDLE\nBOTTOM');
    });
    it('test(css)', async ()=>
    {
        const el = await fixture(html`
            <div>
                <code hidden>
                    <slot name="header"><header>head</header></slot>
                    <slot><main>default slot</main></slot>
                    <slot name="footer"><footer>foot</footer></slot>
                </code>
                <h1 slot="header">TOP</h1>
                <section slot="">MIDDLE</section>
                <b slot="footer">BOTTOM</b>
            </div>`);
        const $light = $(el).template('code');
        $light.$('code').hidden = false;
        expect( $light.innerText).to.equal('TOP\nMIDDLE\nBOTTOM');
    });
    it('test()', async ()=>
    {
        const el = await fixture(html`
            <div>
                <slot name="header"><header>head</header></slot>
                <slot><main>default slot</main></slot>
                <slot name="footer"><footer>foot</footer></slot>
                <h1 slot="header">TOP</h1>
                <section slot="">MIDDLE</section>
                <b slot="footer">BOTTOM</b>
            </div>`);
        const $light = $(el).template();
        expect( $light.innerText.replace( /\s+/g , '')).to.equal('TOPMIDDLEBOTTOM');
    });
} );
