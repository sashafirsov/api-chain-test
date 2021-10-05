import { expect } from '@open-wc/testing';

import { ApiChain as $$ } from '../src/ApiChain.js';
const sampleObj = {propNum:1,propString:"abc", func(a,b){ return `from func(${a},${b})` }};

describe( 'ApiChain', () =>
{
    it( '$$(sampleObj) is Array', async () =>
    {
        expect( Array.isArray( $$(sampleObj) ) ).to.equal(true);
        expect( $$(sampleObj) ).to.be.an('array');
        expect( $$(sampleObj).length ).to.equal(1);
        expect( $$(sampleObj).find( o=>o.propNum === 1) ).to.equal(sampleObj);

    } );


    it( '$$(sampleObj) has all properties of sampleObj', async () =>
    {
        const s$ = $$(sampleObj);
        Object.keys(sampleObj)
            .forEach( key=>
                      {
                          debugger;
                expect( $$(sampleObj)[key] ).to.equal( sampleObj[key] );
                      });
    } );

} );
