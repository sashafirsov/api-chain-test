import { expect } from '@open-wc/testing';

import '../src/css-chain-element.js';

const promiseTimeout = ( time, ret ) => new Promise( resolve => setTimeout( () => resolve( ret ), time ) );

const fixture = ( html ) =>
{
    document.body.innerHTML = html;
    return promiseTimeout( 10, document.body.firstElementChild );
}

describe( 'CssChainElement', () =>
{
    it( 'has a default title "Hey there" and counter 5', async() =>
    {
        const el = await fixture( `<css-chain>*</css-chain>` );

        expect( el.title ).to.equal( 'Hey there' );
        expect( el.counter ).to.equal( 0 );
    } );

    it( 'increases the counter on button click', async() =>
    {
        const el = await fixture( `<css-chain>$</css-chain>` );
        await promiseTimeout( 1000 );
        el.shadowRoot.querySelector( 'button' ).click();

        expect( el.counter ).to.equal( 1 );
    } );

} );
