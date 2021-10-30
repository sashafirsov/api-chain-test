import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import { CssChain as $$ } from '../src/CssChain.js';

class DemoElement extends HTMLElement
{   constructor() {
        super();
        this.b="initial";
    }
    setB(_b){ this.b=_b; }
}
customElements.define('demo-element',DemoElement );

describe( 'CssChain', () =>
{
    const isBlankNodeSet = $X =>
    {
        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(0);
        expect( $X.find( ()=>1) ).to.equal(undefined);
        expect( $X.innerHTML ).to.equal(undefined); // dom element prop
        expect( $X.value ).to.equal(undefined); // INPUT prop
    };
    it( 'blank NodeSet',  async ()=>
    {
        const el = await fixture(html`<div></div>`);
        const $X = $$('a',el);
        isBlankNodeSet($X);
    } );
    it( 'NodeSet[1]',  async ()=>
    {
        const el = await fixture(html`<div><a>A</a><br/></div>`);
        const $X = $$('a',el);
        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(1);
        expect( $X[0].innerText ).to.equal('A');
        expect( $X[0].innerHTML ).to.equal('A');
    } );
    it( 'NodeSet[2]',  async ()=>
    {
        const el = await fixture(html`<div><a href="Y">A</a><br/></div>`);
        const $X = $$('a,br',el);
        expect( $X.length ).to.equal(2);
        expect( $X[0].href ).to.include('Y');
        expect( $X   .href ).to.include('Y');
        expect( $X[0].innerHTML ).to.equal('A');
        expect( $X   .innerHTML ).to.equal('A');
    } );
    it( '[0] setter',  async ()=>
    {
        const el = await fixture(html`<div></div>`);
        const $X = $$('a,b',el);
        $X.innerText = 'B';
        expect( $X.innerHTML ).to.equal(undefined);
    } );
    it( '[2] setter',  async ()=>
    {
        const el = await fixture(html`<div><a href="Y">A</a><b></b></div>`);
        const $X = $$('a,b',el);
        $X.innerText = 'B';
        expect( $X[0].innerHTML ).to.equal('B');
        expect( $X   .innerHTML ).to.equal('B');
        expect( $X[1].innerHTML ).to.equal('B');
        expect( $X   .innerHTML ).to.equal('B');
    } );
    it( 'chaining',  async ()=>
    {
        const el = await fixture(html`<div><input type="number" value="1"/><input type="number" value="2"/></div>`);
        const $X = $$('input',el);
        $X.stepUp(2).stepDown();
        expect( $X[0].value ).to.equal('2');
        expect( $X   .value ).to.equal('2');
        expect( $X[1].value ).to.equal('3');
    } );
    it( 'checked in checkbox with click and click handlers',  async ()=>
    {
        const el = await fixture(html`<div><input type="checkbox" value="1"/><input type="checkbox" value="2"/></div>`);
        const $X = $$('input',el);

            expect( $X[0].checked ).to.equal(false);
            expect( $X   .checked ).to.equal(false);
            expect( $X[1].checked ).to.equal(false);

        $X.click();

            expect( $X[0].checked ).to.equal(true);
            expect( $X   .checked ).to.equal(true);
            expect( $X[1].checked ).to.equal(true);

        $X.checked = false;

            expect( $X[0].checked ).to.equal(false);
            expect( $X   .checked ).to.equal(false);
            expect( $X[1].checked ).to.equal(false);

        $X  .addEventListener('click' ,function(){ this.calledFromClick  = true; })
            .addEventListener('change',function(){ this.calledFromChange = 'checked='+this.checked; })
            .click();

            expect( $X[0].calledFromClick ).to.equal(true);
            expect( $X[1].calledFromClick ).to.equal(true);

            expect( $X[0].calledFromChange ).to.equal('checked=true');
            expect( $X[1].calledFromChange ).to.equal('checked=true');
    } );
    it( '$.on(evName, cb )',  async ()=>
    {
        const el = await fixture(html`<div><input type="checkbox" value="1"/><input type="checkbox" value="2"/></div>`);
        const $X = $$('input',el);

            expect( $X[0].checked ).to.equal(false);
            expect( $X   .checked ).to.equal(false);
            expect( $X[1].checked ).to.equal(false);

        $X.click();

            expect( $X[0].checked ).to.equal(true);
            expect( $X   .checked ).to.equal(true);
            expect( $X[1].checked ).to.equal(true);

        $X.checked = false;

            expect( $X[0].checked ).to.equal(false);
            expect( $X   .checked ).to.equal(false);
            expect( $X[1].checked ).to.equal(false);

        $X  .on('click' ,function(){ this.calledFromClick  = true; })
            .on('change',function(){ this.calledFromChange = 'checked='+this.checked; })
            .click();

            expect( $X[0].calledFromClick ).to.equal(true);
            expect( $X[1].calledFromClick ).to.equal(true);

            expect( $X[0].calledFromChange ).to.equal('checked=true');
            expect( $X[1].calledFromChange ).to.equal('checked=true');
    } );
    it( 'custom element from import',  async ()=>
    {
        const el = await fixture(html`<div><demo-element/><demo-element/></div>`);
        const $X = $$('demo-element',el,'demo-element');

        expect( $X.b ).to.equal('initial');
        $X.setB(1);
        expect( $X.b    ).to.equal(1);
        expect( $X[0].b ).to.equal(1);
        expect( $X[1].b ).to.equal(1);
    } );
    it( 'custom element registered in run time',  async ()=>
    {
        customElements.define('demo-element-1',class extends DemoElement{} );

        const el = await fixture(html`<div><demo-element-1/><demo-element-1/></div>`);
        const $X = $$('demo-element-1',el,['demo-element-1']);

        expect( $X.b ).to.equal('initial');
        $X.setB(2);
        expect( $X.b    ).to.equal(2);
        expect( $X[0].b ).to.equal(2);
        expect( $X[1].b ).to.equal(2);
    } );
    it( 'init from set in run time',  async ()=>
    {
        customElements.define('demo-element-2',class extends DemoElement{ constructor(){super();this.m2=2;}} );

        const el = await fixture(html`<div><demo-element-2/><demo-element-2/></div>`);
        const $X = $$('demo-element-2',el);

        expect( $X.m2    ).to.equal(2);
        expect( $X[0].m2 ).to.equal(2);
        expect( $X[1].m2 ).to.equal(2);
    } );
    it( 'init from element tag in run time',  async ()=>
    {
        customElements.define('demo-element-3',class extends DemoElement{ constructor(){super();this.m3=3;}} );

        const el = await fixture(html`<div><demo-element-3/><demo-element-3/></div>`);
        const $X = $$('demo-element-3',el,'demo-element-3');

        expect( $X.m3    ).to.equal(3);
        expect( $X[0].m3 ).to.equal(3);
        expect( $X[1].m3 ).to.equal(3);
    } );

    it( '$.remove()',  async ()=>
    {
        const el = await fixture(html`<div><input type="checkbox" value="1"/><input type="checkbox" value="2"/></div>`);
        const $X = $$('input',el).remove();
        isBlankNodeSet($X);
    } );
    it( '$.remove(evName, cb )',  async ()=>
    {
        const el = await fixture(html`<div><input type="checkbox" value="1"/><input type="checkbox" value="2"/></div>`);
        const $X = $$('input',el);

        function markClick(){ this.name  = 'clicked'; }

        $X  .on('click' ,markClick )
            .click();

        expect( $X[0].name ).to.equal('clicked');
        expect( $X[1].name ).to.equal('clicked');

        $X.title = false;
        $X.name = false;


        $X  .on('click',function(){ this.title = 'changed' } );
        $X  .remove('click' ,markClick );

        $X.click();

        expect( $X[0].name ).to.equal('false');
        expect( $X[1].name ).to.equal('false');

        expect( $X[0].title ).to.equal('changed');
        expect( $X[1].title ).to.equal('changed');


    } );
    it( '$.on(evName, cb )',  async ()=>
    {
        const el = await fixture(html`<div><input type="checkbox" value="1"/><input type="checkbox" value="2"/></div>`);
        const $X = $$('input',el);

        expect( $X[0].checked ).to.equal(false);
        expect( $X   .checked ).to.equal(false);
        expect( $X[1].checked ).to.equal(false);

        $X.click();

        expect( $X[0].checked ).to.equal(true);
        expect( $X   .checked ).to.equal(true);
        expect( $X[1].checked ).to.equal(true);

        $X.checked = false;

        expect( $X[0].checked ).to.equal(false);
        expect( $X   .checked ).to.equal(false);
        expect( $X[1].checked ).to.equal(false);

        $X  .on('click' ,function(){ this.calledFromClick  = true; })
            .on('change',function(){ this.calledFromChange = 'checked='+this.checked; })
            .click();

        expect( $X[0].calledFromClick ).to.equal(true);
        expect( $X[1].calledFromClick ).to.equal(true);

        expect( $X[0].calledFromChange ).to.equal('checked=true');
        expect( $X[1].calledFromChange ).to.equal('checked=true');
    } );

} );
