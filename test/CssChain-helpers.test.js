import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../src/slots-in-shadow.js';

import { CssChain as $$, map, csv, collectionText, getNodeText, setNodeText, setNodeHtml, html2NodeArr }
    from '../src/CssChain.js';

describe( 'CssChain internal helpers', () =>
{
    it( 'map(arr, cb)',  async ()=>
    {
        expect( map([1,2],(n,i)=>n*10+i) ).to.eql([10,21]);
        expect( map([1,2],(n,i,arr)=>n*10+i+' of '+arr.length) ).to.eql(['10 of 2','21 of 2']);

        const el = await fixture(html`<div><a id="a1"></a><a id="a2"></a></div>`);

        const $A = $$('a',el)
        expect( map($A,n=>n.id) ).to.eql(['a1','a2']);
        expect( map($A,(n,i)=>i) ).to.eql([0,1]);
    } );
    it( 'csv(arr, cb)',  async ()=>
    {
        expect( csv([1,2],(n,i)=>n*10+i) ).to.eql("10,21");
        expect( csv([1,2],(n,i,arr)=>n*10+i+' of '+arr.length) ).to.eql('10 of 2,21 of 2');

        const el = await fixture(html`<div><a id="a1"></a><a id="a2"></a></div>`);

        const $A = $$('a',el)
        expect( csv($A,n=>n.id) ).to.eql('a1,a2');
        expect( csv($A,(n,i)=>i) ).to.eql('0,1');
    } );
    it( 'collectionText(nodeList)',  async ()=>
    {
        const el = await fixture(html`<div><a id="a1">A</a><a id="a2">B</a><slot name="outer">C</slot></div>`);

        const $A = $$('a',el)
        expect( collectionText($A) ).to.eql('AB');
        const $B = $$('a,slot',el)
        expect( collectionText($B) ).to.eql('ABC');

    } );
    it( 'collectionText with slots',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="">default slot replacement</div>
                <div slot="outer">outer replacement</div>
            </slots-in-shadow>`);

        const $arr = el.$('slot:not([name]),slot[name="outer"]');
        expect( $arr.length).to.eq(2);
        expect( collectionText($arr)).to.include('default slot replacement');
        expect( collectionText($arr)).to.include('outer replacement');

        $arr.innerText='A';
        expect( collectionText($arr)).to.eq('AA');

        expect( collectionText(el.$().slot(''))).to.eq('A');
        expect( collectionText(el.$().slot('outer')) ).to.eq('A');
        // native access to slots content
        expect( collectionText([...el.querySelectorAll('[slot]')])).to.eq('AA');

        el.$().slot('').innerText = 'B';
        expect( collectionText(el.$().slot(',outer')) ).to.eq('BA');
    });
    it( 'getNodeText(node) with slots',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <a>prefix<b>B</b><!CDATA[[ suffix ]]>suffix</a>
                <div slot="">default slot replacement</div>
                <div slot="outer">outer replacement<script type="bogus">ignore it</script></div>
            </slots-in-shadow>`);
        expect( getNodeText( el.shadowRoot ) ).to.include('prefixBsuffix');
        expect( getNodeText( $$('a',el)[0] )).to.eq('prefixBsuffix');
        expect( getNodeText( el.$().slot('') )).to.eq('prefixBsuffixdefault slot replacement');
        expect( getNodeText( el.$().slot('outer') )).to.eq('outer replacement');
        expect( el.$('style').textContent).to.include('padding');
        expect( getNodeText( el.$('style')[0])).to.eq('');
        expect( el.$('script').textContent).to.include('ignore it');
        expect( getNodeText( el.$('script')[0])).to.eq('');
    });
    it( 'getNodeText(node) with text + CDATA',  async ()=>
    {
        const el = await fixture(
            html`<a>prefix <b>B</b>
                    <![CDATA[ &hidden ]]>
                    suffix
                    <style>a{ color:pink;}</style>
                    <script type="bogus">ignore it</script>
                </a>`);
        expect( getNodeText( el )).to.eq('prefix B suffix');
        expect( $$('style',el)[0].textContent).to.include('pink');
        expect( getNodeText( $$('style',el)[0] )).to.eq('');
        expect( $$('script',el)[0].textContent).to.include('ignore it');
        expect( getNodeText( $$('script')[0] )).to.eq('');
        // nodeType=3 - text
        expect( getNodeText( el.childNodes[0] ).trim() ).to.eq('prefix');
        // nodeType=4 - CDATA became comment nodeType=8
        // https://developer.mozilla.org/en-US/docs/Web/API/CDATASection
        expect( el.childNodes[3].nodeValue ).to.include('&hidden');
        expect( getNodeText( el.childNodes[3] ) ).to.eq('');

        expect( getNodeText( el.childNodes[4] ).trim() ).to.eq('suffix');
    });
    it( 'setNodeText(node, text)',  async ()=>
    {
        const el = await fixture(
            html`<a>prefix
                    <b>A</b>
                    suffix
                </a>`);
        expect( getNodeText( el )).to.eq('prefix A suffix');
        setNodeText( $$('b', el )[0], 'B' );
        expect( getNodeText( el )).to.eq('prefix B suffix');
        setNodeText( el, 'C' );
        expect( el.innerText).to.eq('C');
    });
    it( 'setNodeText(node, text) slot',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="outer">outer replacement</div>
            </slots-in-shadow>`);
        expect( getNodeText( el )).to.eq('outer replacement');
        setNodeText( el.$().slot('outer')[0], 'A' );
        expect( getNodeText( el )).to.eq('A');
    });
    it( 'setNodeHtml(node, text)',  async ()=>
    {
        const el = await fixture(
            html`<a>prefix
                    <b>A</b>
                    suffix
                    <i>B</i>
                </a>`);
        setNodeHtml($$('b',el)[0],'<i>C</i>');  // str
        expect($$('b',el)[0].innerHTML).to.eq('<i>C</i>');
        expect($$('i',el)[1].innerHTML).to.eq('B');

        setNodeHtml($$('b',el)[0],['<i>C</i>','<u>D</u>']); // str[]
        expect($$('b',el)[0].innerHTML).to.eq('<i>C</i><u>D</u>');

        setNodeHtml($$('b',el)[0],['']); // str[]
        expect($$('b',el)[0].innerHTML).to.eq('');

        el.innerHTML = `<s><b>A</b><i>B</i></s>`;
        setNodeHtml( $$('s', el )[0], el.querySelectorAll('b,i') ); // NodeList
        expect($$('s',el)[0].innerHTML).to.eq('<b>A</b><i>B</i>');

        el.innerHTML = `<s><b>A</b><i>B</i></s>`;
        setNodeHtml( $$('s', el )[0], [...el.querySelectorAll('b,i')] );// Node[]
        expect($$('s',el)[0].innerHTML).to.eq('<b>A</b><i>B</i>');

        setNodeHtml( $$('s', el )[0], 7 );// number
        expect($$('s',el)[0].innerText).to.eq('7');
        expect($$('s',el)[0].innerHTML).to.eq('<span>7</span>');
    });
    it( 'setNodeHtml(node, text) slot',  async ()=>
    {
        const el = await fixture(
            html`<slots-in-shadow>
                <div slot="outer">outer replacement</div>
            </slots-in-shadow>`);
        expect( getNodeText( el )).to.eq('outer replacement');
        setNodeHtml( el.$().slot('outer')[0], '<u>A</u>' );
        expect(el.$().slot('outer').innerHTML).to.eq('<u slot="outer">A</u>');
    });
    it( 'html2NodeArr(html) ',  async ()=>
    {
        const arr = html2NodeArr(`Hello <i>World</i><b>!</b>`)
        expect( arr.length).to.eq(3);
        expect( arr[0].textContent).to.eq('Hello ');
        expect( arr[1].outerHTML).to.eq('<i>World</i>');
        expect( arr[2].outerHTML).to.eq('<b>!</b>');
    });

} );
