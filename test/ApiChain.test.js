import { expect } from '@open-wc/testing';

import { ApiChain as $$ } from '../src/ApiChain.js';
const sampleObj = {propNum:1,propString:"abc", func(a,b){ return `from func(${a},${b})` }};

describe( 'ApiChain', () =>
{
    it( '$$(sampleObj) is Array',  () =>
    {
        expect( Array.isArray( $$(sampleObj) ) ).to.equal(true);
        expect( $$(sampleObj) ).to.be.an('array');
        expect( $$(sampleObj).length ).to.equal(1);
        expect( $$(sampleObj).find( o=>o.propNum === 1) ).to.equal(sampleObj);

    } );

    it( '$$(sampleObj) has all properties of sampleObj',  () =>
    {   Object.keys(sampleObj)
            .forEach( key=>
                expect( $$(sampleObj)[key] ).to.equal( sampleObj[key] ) );
    } );

    it( 'property assignment',  () =>
    {   const arr = [ {a:1,b:12},{a:2,b:22} ];
        const $X = $$(arr)
        $X.a = 1;    // all arr elements property `a` set to 1
        expect( arr[0].a ).to.equal( 1 );
        expect( arr[1].a ).to.equal( 1 );
        expect( arr[0].b ).to.equal( 12 );
        expect( arr[1].b ).to.equal( 22 );
    } );
    it( 'property getter',  () =>
    {   const arr = [ {a:1,b:12},{a:2,b:22} ];
        const $X = $$(arr)
        expect( $X.a ).to.equal( 1 );
    } );
    it( ' calling method and chaining',  () =>
    {   const arr = [ { f(v){ this.a=v+10} }, { f(v){ this.b=v+20}} ];
        const $A = $$(arr).f(1);
        expect( arr[0].a ).to.equal( 11 );
        expect( arr[1].b ).to.equal( 21 );
        $A.f(100);
        expect( arr[0].a ).to.equal( 110 );
        expect( arr[1].b ).to.equal( 120 );
    } );

} );
