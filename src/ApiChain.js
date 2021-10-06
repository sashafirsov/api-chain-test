
export function ApiChain( elOrArr, elementProto = undefined )
{
    const isArr = Array.isArray( elOrArr );
    const arr =  isArr ? elOrArr : [ elOrArr ];
    class ApiChainLocal extends Array{ prop(k){ return this[0][k]; }};
    if( ! elementProto )
        elementProto = Object.getPrototypeOf( isArr ? elOrArr[0] : elOrArr );
    if( elementProto === Object.getPrototypeOf( {} ))
    {
        const refObj = arr[0];
        for( let k in refObj )
        {
            if( typeof refObj[k] === 'function' )
            {
                ApiChainLocal.prototype[k] = function( ...args ){ this.forEach( el=>el[k](...args) ); return this; }
            }else
            {
                Object.defineProperty(ApiChainLocal.prototype, k,
                {   get: function() { return this[0][k] }
                ,   set: function(v) { this.forEach(el=>el[k]=v); return v }
                });
            }
        }
    }else
        for( let k in elementProto )
            ApiChainLocal.prototype[k] = elementProto[k];


    const ret = new ApiChainLocal();
    ret.push(...arr);
    return ret;
}
