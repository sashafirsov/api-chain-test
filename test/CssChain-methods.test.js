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
    it( 'get innerText', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        expect( $$('a',el).innerText.trim() ).to.equal('a1a2');
        expect( $$(el).innerText.replace(/\n/g,'') ).to.equal('da1a2D');
    } );
    it( 'set innerText', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        $$('a',el).innerText = 'b';
        expect( $$('a',el).innerText ).to.equal('bb');
        expect( $$(el).innerText.replace(/\n/g,'') ).to.equal('dbbD');
    } );
    it( 'get innerHTML', async ()=>
    {
        const el = await fixture(html`<div>d<a>a1<hr/></a><a>a2<br/></a>D</div>`);
        expect( $$('a',el).innerHTML).to.include('a1');
        expect( $$('a',el).innerHTML).to.include('a2');
        expect( $$('a',el).innerHTML).to.include('<hr');
        expect( $$('a',el).innerHTML).to.include('<br');
        expect( $$(el).innerHTML ).to.equal('d<a>a1<hr></a><a>a2<br></a>D');
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

} );
