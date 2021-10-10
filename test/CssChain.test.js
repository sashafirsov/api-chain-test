import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';

import { CssChain as $$ } from '../src/CssChain.js';

describe( 'CssChain', () =>
{
    it( 'blank NodeSet',  async ()=>
    {
        const el = await fixture(html`<div></div>`);
        const $X = $$('a',el)
        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(0);
        expect( $X.find( o=>1) ).to.equal(undefined);
    } );
    it( 'NodeSet[1]',  async ()=>
    {
        const el = await fixture(html`<div><a>A</a><br/></div>`);
        const $X = $$('a',el)
        expect( Array.isArray( $X ) ).to.equal(true);
        expect( $X ).to.be.an('array');
        expect( $X.length ).to.equal(1);
        expect( $X[0].innerText ).to.equal('A');
        expect( $X[0].innerHTML ).to.equal('A');
    } );

} );
