import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import { CssChain as $$ } from '../src/CssChain.js';

describe( 'CssChain own methods', () =>
{
    it( 'getAttribute(name), attr(name)',  async ()=>
    {
        const el = await fixture(html`<div><a id="a1"></a><a id="a2"></a></div>`);

        const $Z = $$('x',el)
        expect( $Z.getAttribute('?') ).to.equal(undefined);
        expect( $Z.attr('?') ).to.equal(undefined);

        const $X = $$('a',el)

        expect( $X.getAttribute('?') ).to.equal(null);
        expect( $X.attr('?') ).to.equal(null);
        expect( $X.getAttribute('id') ).to.equal('a1');
        expect( $X.attr('id') ).to.equal('a1');
    } );

    it( 'setAttribute(name,val), attr(name,val)',  async ()=>
    {
        const el = await fixture(html`<div><a id="a1"></a><a id="a2"></a></div>`);
        const $X = $$('a',el)

        expect( $X.setAttribute('id','AZ').length ).to.equal(2);
        expect( $X.getAttribute('id') ).to.equal('AZ');
        expect( $X.attr('id') ).to.equal('AZ');

        expect( $X.attr('id','QA').length ).to.equal(2);
        expect( $X.getAttribute('id') ).to.equal('QA');
        expect( $X.attr('id') ).to.equal('QA');
    } );

    it( 'prop(name), prop(name,val)',  async ()=>
    {
        const el = await fixture(html`<div><a id="a1"></a><a id="a2"></a></div>`);
        const $X = $$('a',el)

        expect( $X.prop('id') ).to.equal('a1');
        expect( $X.attr('id') ).to.equal('a1');

        expect( $X.prop('id', 'AZ').length ).to.equal(2);
        expect( $X.prop('id') ).to.equal('AZ');
        expect( $X[0].id ).to.equal('AZ');
        expect( $X[1].id ).to.equal('AZ');

        expect( $X.attr('id') ).to.equal('AZ');
    } );

    it( 'forEach',  async ()=>
    {
        const el = await fixture(html`<div><a id="a1"></a><a id="a2"></a></div>`);
        let s='';
        const $X = $$('a',el).forEach( el=>s+=el.id );
        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(2);
        expect( s ).to.equal('a1a2');
    } );

    it( 'map',  async ()=>
    {
        const el = await fixture(html`<div><a id="a1"><hr/></a><a id="a2"><br/></a></div>`);

        const $X = $$('a',el).map( el=>el.firstChild );

        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(2);
        expect( $X[0].tagName ).to.equal('HR');
        expect( $X[1].tagName ).to.equal('BR');

        const $Y = $$('a',el).map( el=>el.id );

        expect( Array.isArray( $Y ) ).to.equal(true);
        expect( $Y ).to.be.an('array');
        expect( $Y.length ).to.equal(2);
        expect( $Y[0] ).to.equal('a1');
        expect( $Y[1] ).to.equal('a2');
    } );
    it( 'push', async ()=>
    {
        const el = await fixture(html`<div><a id="a1"><hr/></a><a id="a2"><br/></a></div>`);

        const $X = $$('a',el).push( el.querySelector('br'), el.querySelector('hr'));

        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(4);
        expect( $X[0].tagName ).to.equal('A');
        expect( $X[1].tagName ).to.equal('A');
        expect( $X[2].tagName ).to.equal('BR');
        expect( $X[3].tagName ).to.equal('HR');
    } );
    it( 'querySelector', async ()=>
    {
        const el = await fixture(html`<div><a id="a1"><hr/></a><a id="a2"><br/></a></div>`);

        const $X = $$('a',el).querySelector( 'br');

        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(1);
        expect( $X[0].tagName ).to.equal('BR');
        expect( $X.tagName ).to.equal('BR');
    } );
    it( 'querySelectorAll', async ()=>
    {
        const el = await fixture(html`<div><a id="a1"><hr/></a><a id="a2"><br/></a></div>`);

        const $X = $$('a',el).querySelectorAll( 'br,hr');

        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(2);
        expect( $X[0].tagName ).to.equal('HR');
        expect( $X[1].tagName ).to.equal('BR');
    } );
    it( 'querySelectorAll==$', async ()=>
    {
        const el = await fixture(html`<div><a id="a1"><hr/></a><a id="a2"><br/></a></div>`);

        const $X = $$('a',el).$( 'br,hr');

        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(2);
        expect( $X[0].tagName ).to.equal('HR');
        expect( $X[1].tagName ).to.equal('BR');
    } );
    it( 'parent()', async ()=>
    {
        const el = await fixture(html`<div><a id="a1"><hr/></a><a id="a2"><br/></a></div>`);

        const $X = $$('hr,br',el).parent();

        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(2);
        expect( $X[0].id ).to.equal('a1');
        expect( $X[1].id ).to.equal('a2');
    } );
    it( 'parent().parent()', async ()=>
    {
        const el = await fixture(html`<div><a id="a1"><hr/></a><a id="a2"><br/></a></div>`);

        const $X = $$('hr,br',el).parent().parent();

        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(1);
        expect( $X[0].tagName ).to.equal('DIV');
    } );
    it( 'parent(css) - 1 level', async ()=>
    {
        const el = await fixture(html`<div><a id="a1"><hr/></a><a id="a2"><br/></a></div>`);

        const $X = $$('hr,br',el).parent('a');

        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(2);
        expect( $X[0].id ).to.equal('a1');
        expect( $X[1].id ).to.equal('a2');
    } );
    it( 'parent(css) - 2 levels', async ()=>
    {
        const el = await fixture(html`<div><a id="a1"><hr/></a><a id="a2"><br/></a></div>`);

        const $X = $$('hr,br',el).parent('div');

        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(1);
        expect( $X[0].tagName ).to.equal('DIV');
    } );
    it( 'get innerText, text()', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        expect( $$('a',el).innerText.trim() ).to.equal('a1a2');
        expect( $$('a',el).text().trim() ).to.equal('a1a2');
        expect( $$(el).innerText.replace(/\n/g,'') ).to.equal('da1a2D');
        expect( $$(el).text().replace(/\n/g,'') ).to.equal('da1a2D');
    } );
    it( 'set innerText', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        $$('a',el).innerText = 'b';
        expect( $$('a',el).innerText ).to.equal('bb');
        expect( $$(el).innerText.replace(/\n/g,'') ).to.equal('dbbD');
    } );
    it( 'text( cb(el,i,arr) )', async ()=>
    {
        const el = await fixture(html`<div>d<a title="#1">a1<hr/></a><a title="#2">a2<br/></a>D</div>`);
        $$('a',el).text( (el,i,arr)=>`${i}. ${el.title} ${el.href} in arr[${arr.length}]`);
        expect( $$('a',el).innerText            ).to.equal("0. #1 in arr[2]1. #2 in arr[2]");
        expect( $$(el).innerText.replace(/\n/g,'') ).to.equal("d0. #1 in arr[2]1. #2 in arr[2]D");
    } );
    it( 'get innerHTML, html()', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        expect( $$('a',el).innerHTML).to.include('a1');
        expect( $$('a',el).html()   ).to.include('a1');
        expect( $$('a',el).innerHTML).to.include('a2');
        expect( $$('a',el).html()   ).to.include('a2');
        expect( $$('a',el).innerHTML).to.include('<hr');
        expect( $$('a',el).html()   ).to.include('<hr');
        expect( $$('a',el).innerHTML).to.include('<br');
        expect( $$('a',el).html()   ).to.include('<br');
        expect( $$(el).innerHTML ).to.equal('d<a>a1<hr></a><a>a2<br></a>D');
        expect( $$(el).html()    ).to.equal('d<a>a1<hr></a><a>a2<br></a>D');
    } );
    it( 'set innerHTML', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        $$('a',el).innerHTML = 'B'
        expect( $$('a',el).innerText).to.include('BB');
        $$('a',el).innerHTML = '<b>A</b>';
        expect( $$('b',el).length ).to.equal(2);
        expect( $$('b',el).innerText.replace(/\n/g,'') ).to.equal('AA');
    } );
    it( 'html( htmlStr )', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        let $X = $$('a',el).html( 'B' );
        expect( $X.length ).to.equal(2);
        expect( $$('a',el).innerText).to.include('BB');
        $$('a',el).html( '<b>A</b>' );
        expect( $$('b',el).length ).to.equal(2);
        expect( $$('b',el).innerText.replace(/\n/g,'') ).to.equal('AA');
    } );
    it( 'html( cb(el,i,arr) )', async ()=>
    {
        const el = await fixture(html`<div>d<a title="#1">a1<hr/></a><a title="#2">a2<br/></a>D</div>`);
        let $X = $$('a',el).html( (el,i,arr)=>`${i}. <b>${el.title}</b> <i>${el.href}</i> in arr[${arr.length}]` );
        expect( $X.length ).to.equal(2);
        expect( $$('a',el).innerText            ).to.equal("0. #1 in arr[2]1. #2 in arr[2]");
        expect( $$(el).innerText.replace(/\n/g,'') ).to.equal("d0. #1 in arr[2]1. #2 in arr[2]D");
        expect( $$('b,i',el).length ).to.equal( 4 );
    } );
    it( 'html( arr )', async ()=>
    {
        const el = await fixture(html`<div>d<a title="#1">a1<hr/></a><a title="#2">a2<br/></a>D</div>`);
        let $X = $$('a',el).html( ['X','<b>Y</b>','<b>Z</b>'] );
        expect( $X.length ).to.equal(2);
        expect( $$('a',el).innerText            ).to.equal("XYZXYZ");
        expect( $$('b',el).length ).to.equal( 4 );
        expect( $$('b',el).innerText            ).to.equal("YZYZ");
    } );
    it( 'cloneNode()', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        let $X = $$('a',el).cloneNode(); // shallow - only 1st tags are cloned
        expect( $X.length ).to.eq(2);
        expect( $X.tagName ).to.eq('A');
        expect( $X.innerHTML ).to.not.include('hr');
        expect( $X.innerHTML ).to.not.include('a1');
        expect( $X.innerHTML ).to.not.include('a2');
    } );
    const testCloned = $X =>
    {
        expect( $X.length ).to.eq(2);
        expect( $X.tagName.toLowerCase() ).to.eq('a');
        expect( $X[0].innerHTML ).to.include('a1');
        expect( $X[1].innerHTML ).to.include('a2');
        expect( $X[0].innerHTML ).to.include('<hr');
        expect( $X[1].innerHTML ).to.include('<br');
        return $X;
    };
    it( 'cloneNode(true)', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        let $X = $$('a',el).cloneNode(true);
        testCloned( $X );
    } );
    it( 'clone()', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        testCloned( $$('a',el ).clone() );
    } );
    it( 'clone(doc)', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        const doc = new Document();
        const $X = $$('a',el );
        const $Y = testCloned( $X.clone(doc) );
        expect( $Y.ownerDocument ).to.eq(doc);
        expect( $X.ownerDocument ).to.eq(document);
        expect( $Y.ownerDocument ).to.eq(doc);
    } );
    it( 'append(str)', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        const $X = $$('a',el );
        const $Y = $X.append( '<b>B1</b>' );
        expect( $X ).to.eq($Y);
        expect( $X.innerHTML ).to.eq("a1<hr><b>B1</b>a2<br><b>B1</b>");
    } );
    it( 'append( str[] )', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        const $X = $$('a',el );
        const $Y = $X.append( ['<b>B1</b>','<i>I1</i>'] );
        expect( $X ).to.eq($Y);
        expect( $X.innerHTML ).to.eq("a1<hr><b>B1</b><i>I1</i>a2<br><b>B1</b><i>I1</i>");
    } );
    it( 'append( el[] )', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1</a><a>a2</a>D</div>`);
        const $X = $$('a',el );
        const $Y = $X.append( [document.createElement('hr'),document.createElement('br')] );
        expect( $X ).to.eq($Y);
        expect( $X.innerHTML ).to.eq("a1a2<hr><br>");
    } );
    it( 'clear()', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1</a><a>a2</a>D</div>`);
        const $X = $$('a',el );
        const $Y = $X.clear();
        expect( $X ).to.eq($Y);
        expect( $X.innerHTML ).to.eq("");

        const $Z= $$(el);
        $Z.clear();
        expect( $Z.innerHTML ).to.eq("");
        expect( $Z.outerHTML ).to.eq("<div></div>");
    } );

    it( 'text( val )', async ()=>
    {
        const el = await fixture(html`<div>d <a>a1</a> - <a>a2</a> D</div>`);
        const $X = $$('a',el ).text('Z');
        expect( $X.length ).to.eq(2);
        expect( $X.innerText ).to.eq("ZZ");
    } );

    it( 'text( cb(el,i,arr) )', async ()=>
    {
        const el = await fixture(html`<div>d <a title="A1">one</a> - <a title="A2">two</a> D</div>`);
        const $X = $$('a',el ).text( (el,i,arr)=>`${el.title}:${el.innerText}:${i}:${arr.length}`);
        expect( $X.length ).to.eq(2);
        expect( $X.innerText ).to.eq("A1:one:0:2A2:two:1:2");
    } );

    it( 'text( val,css )', async ()=>
    {
        const el = await fixture(html`<div>d <a>a1</a> - <a>a2</a> D</div>`);
        const $X = $$(el).text('Z','a');
        expect( $X.length ).to.eq(1);
        expect( $X[0].tagName ).to.eq('DIV');
        expect( $X.$('a').innerText ).to.eq("ZZ");
    } );
    it( 'text( undefined,css )', async ()=>
    {
        const el = await fixture(html`<div>d <a>a1</a> - <a>a2</a> D</div>`);
        const $X = $$(el).text(undefined,'a');
        expect( $X ).to.eq('a1a2');
        expect( $$(el).text(undefined) ).to.eq('d a1 - a2 D');
        expect( $$(el).text() ).to.eq('d a1 - a2 D');
    } );

    it( 'text( cb(el,i,arr), css )', async ()=>
    {
        const el = await fixture(html`<div>d <a title="A1">one</a> - <a title="A2">two</a> D</div>`);
        const $X = $$( el ).text( (el,i,arr)=>`${el.title}:${el.innerText}:${i}:${arr.length}`, 'a');
        expect( $X.length ).to.eq(1);
        expect( $X[0].tagName ).to.eq('DIV');
        expect( $X.innerText ).to.eq("d A1:one:0:2 - A2:two:1:2 D");
    } );

    it( 'html( val )', async ()=>
    {
        const el = await fixture(html`<div>d <a>a1</a> - <a>a2</a> D</div>`);
        const $X = $$('a',el ).html('Z');
        expect( $X.length ).to.eq(2);
        expect( $X.innerText ).to.eq("ZZ");
    } );

    it( 'html( cb(el,i,arr) )', async ()=>
    {
        const el = await fixture(html`<div>d <a title="A1">one</a> - <a title="A2">two</a> D</div>`);
        const $X = $$('a',el ).html( (el,i,arr)=>`${el.title}:${el.innerText}:${i}:${arr.length}`);
        expect( $X.length ).to.eq(2);
        expect( $X.innerText ).to.eq("A1:one:0:2A2:two:1:2");
    } );

    it( 'html( val,css )', async ()=>
    {
        const el = await fixture(html`<div>d <a>a1</a> - <a>a2</a> D</div>`);
        const $X = $$(el).html('Z','a');
        expect( $X.length ).to.eq(1);
        expect( $X[0].tagName ).to.eq('DIV');
        expect( $X.$('a').innerText ).to.eq("ZZ");
    } );
    it( 'html( undefined,css )', async ()=>
    {
        const el = await fixture(html`<div>d <a>a1</a> - <a>a2</a> D</div>`);
        const $X = $$(el).html(undefined,'a');
        expect( $X ).to.eq('a1a2');
        expect( $$(el).html(undefined) ).to.eq("d <a>a1</a> - <a>a2</a> D");
        expect( $$(el).html() ).to.eq("d <a>a1</a> - <a>a2</a> D");
    } );

    it( 'html( cb(el,i,arr), css )', async ()=>
    {
        const el = await fixture(html`<div>d <a title="A1">one</a> - <a title="A2">two</a> D</div>`);
        const $X = $$( el ).html( (el,i,arr)=>`${el.title}:${el.innerText}:${i}:${arr.length}`, 'a');
        expect( $X.length ).to.eq(1);
        expect( $X[0].tagName ).to.eq('DIV');
        expect( $X.innerText ).to.eq("d A1:one:0:2 - A2:two:1:2 D");
    } );
    it( 'outerHTML', async ()=>
    {
        const el = await fixture(html`<div>d <a title="A1">one</a> - <a title="A2">two</a> D</div>`);
        const txt = $$('a',el ).outerHTML;
        expect( txt ).to.eq('<a title="A1">one</a><a title="A2">two</a>');
    } );
    it( 'outerHTML=html', async ()=>
    {
        const el = await fixture(html`<div>d <a title="A1">one</a> - <a title="A2">two</a> D</div>`);
        $$('a',el ).outerHTML = `<b>Z</b>`;
        expect( $$('a',el ).length ).to.eq(0);
        expect( $$('b',el ).outerHTML ).to.eq('<b>Z</b><b>Z</b>');
    } );
    it( 'outerHTML=cb(e,i,arr)', async ()=>
    {
        const el = await fixture(html`<div>d <a title="A1">one</a> - <a title="A2">two</a> D</div>`);
        expect( $$('a',el ).length ).to.eq(2);

        $$('a',el ).outerHTML = (e,i,arr)=>`${i}.<b>${e.title}</b>:${arr.length}`;
        expect( $$('a',el ).length ).to.eq(0);
        expect( $$('b',el ).length ).to.eq(2);
        expect( $$('b',el ).outerHTML ).to.eq('<b>A1</b><b>A2</b>');
        expect( $$(el ).innerHTML ).to.eq('d <span>0.</span><b>A1</b><span>:2</span> - <span>1.</span><b>A2</b><span>:2</span> D');
    } );
    it( 'firstElementChild, firstChild', async ()=>
    {
        const el = await fixture(html`<div>d <a title="A1">one</a> - <a title="A2">two</a> D</div>`);

        expect( $$(el).firstElementChild.innerText ).to.eq('one');
        expect( $$('a',el).firstElementChild.innerText ).to.eq('');

        expect( $$(el).firstChild.innerText ).to.eq('d ');
        expect( $$('a',el).firstChild.innerText ).to.eq('onetwo');
    } );
    it( 'children, childElements', async ()=>
    {
        const el = await fixture(html`<div>d <a title="A1">one</a> - <a title="A2">two</a> D</div>`);

        expect( $$(el).children.length ).to.eq(2);
        expect( $$(el).children.innerText ).to.eq('onetwo');
        expect( $$('a',el).children.length ).to.eq(0);
        expect( $$('a',el).children.innerText ).to.eq('');

        expect( $$(el).childNodes.length ).to.eq(5);
        expect( $$(el).childNodes.innerText ).to.eq("d one - two D");
        expect( $$('a',el).childNodes.length ).to.eq(2);
        expect( $$('a',el).childNodes.innerText ).to.eq('onetwo');
    } );

} );
