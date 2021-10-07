import { expect } from '@open-wc/testing';

import { ApiChain as $$ } from '../src/ApiChain.js';
const sampleObj = {propNum:1,propString:"abc", func(a,b){ return `from func(${a},${b})` }};
class A
{   constructor(v){ this.aProp=v;}
    aProp;
    aFuncVal;
    aFunc(x,y){ return this.aFuncVal = this.aProp+x+y;}
}
class B extends A
{   constructor(v){ super('B_'+v); this.bProp=v;}
    bProp;
    bFuncVal;
    bFunc(x,y){ return this.bFuncVal = this.bProp+x+y;}
}
const   createA_arr = ()=>[new A('aProp1'),new A('aProp2')]
,       createB_arr = ()=>[new B('bProp1'),new B('bProp2')];

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
            .forEach( key=> key!=='func' &&
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

    it( 'arr of A class object',  () =>
    {   const arr = createA_arr();
        const $A = $$(arr);
        expect( $A.aProp ).to.equal( 'aProp1' );
        expect( $A[0].aProp ).to.equal( 'aProp1' );
        expect( $A[1].aProp ).to.equal( 'aProp2' );
    } );
    it( 'arr of B class object',  () =>
    {   const arr = createB_arr();
        const $X = $$(arr);

        expect( $X.bProp    ).to.equal( 'bProp1' );
        expect( $X[0].bProp ).to.equal( 'bProp1' );
        expect( $X[1].bProp ).to.equal( 'bProp2' );

        // inherited initial state
        expect( $X.aProp    ).to.equal( 'B_bProp1' );
        expect( $X[0].aProp ).to.equal( 'B_bProp1' );
        expect( $X[1].aProp ).to.equal( 'B_bProp2' );
    } );
    it( 'A[2].aFunc(1,2)',  () =>
    {   const arr = createA_arr();
        const $A = $$(arr);

        expect( $A.aFunc('X','Y')).to.be.an( 'array' );
        expect( $A.aFunc('X','Y').length).to.equal( 2 );
        expect( $A.aFuncVal    ).to.equal( 'aProp1XY' );
        expect( $A[0].aFuncVal ).to.equal( 'aProp1XY' );
        expect( $A[1].aFuncVal ).to.equal( 'aProp2XY' );
    } );
    it( 'B[2].bFunc(1,2)',  () =>
    {   const arr = createB_arr();
        const $X = $$(arr);

        expect( $X.bFunc('X','Y')).to.be.an( 'array' );
        expect( $X.bFunc('X','Y').length).to.equal( 2 );
        expect( $X.bFuncVal    ).to.equal( 'bProp1XY' );
        expect( $X[0].bFuncVal ).to.equal( 'bProp1XY' );
        expect( $X[1].bFuncVal ).to.equal( 'bProp2XY' );
    } );
    it( 'B[2].aFunc(1,2)',  () =>
    {   const arr = createB_arr();
        const $X = $$(arr);

        expect( $X.aFunc('X','Y')).to.be.an( 'array' );
        expect( $X.aFunc('X','Y').length).to.equal( 2 );
        expect( $X.aFuncVal    ).to.equal( 'B_bProp1XY' );
        expect( $X[0].aFuncVal ).to.equal( 'B_bProp1XY' );
        expect( $X[1].aFuncVal ).to.equal( 'B_bProp2XY' );
    } );

} );
