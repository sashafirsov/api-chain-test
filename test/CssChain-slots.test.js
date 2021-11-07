import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import { CssChain as $$ } from '../src/CssChain.js';
import { CssChainElement } from "../src/CssChainElement";

describe( 'CssChain slot methods', () =>
{
    it( 'slot()',  async ()=>
    {
        const el = await fixture(html`<slots-in-shadow></slots-in-shadow>`);
debugger;
        const $slots = el.$().slot();
        console.log($slots);
    } );


} );
