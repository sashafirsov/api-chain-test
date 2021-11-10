import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../src/slots-in-shadow.js';
import { CssChain as $$ } from '../src/CssChain.js';

describe( 'CssChain slot methods', () =>
{
    it( 'default slots ',  async ()=>
    {
        const el = await fixture(html`<slots-in-shadow></slots-in-shadow>`);
        const text = el.$().innerHTML;
        expect( text ).to.include('out of slot');
        expect( text ).to.include('inner 1');
        expect( text ).to.include('inner 2');
        expect( text ).to.include('inner 1 in 2');
        expect( text ).to.include('inner 2 in 2');
        expect( text ).to.include('outer slot');

        const $slots = el.$().slot();
        expect( $slots.map( n=>n.name) ).to.eql(['', 'inner-1', 'inner-2', 'inner-2-1', 'inner-2-2', 'outer']);

        const checkDefaultSlots = $el=>
        {
            expect( $el.slot('').innerText ).to.include('default slot');
            expect( $el.slot('inner-1').innerText ).to.include('inner 1');
            expect( $el.slot('inner-2').innerText ).to.include('inner 2');
            expect( $el.slot('inner-2').innerText ).to.include('inner 1 in 2');
            expect( $el.slot('inner-2').innerText ).to.include('inner 2 in 2');
        };
        checkDefaultSlots( el.$() );
        checkDefaultSlots( $$(el) );
    } );


} );
