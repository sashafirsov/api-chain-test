
export function ApiChain( elOrArr, elementProto = undefined )
{
    const isArr = Array.isArray( elOrArr );
    const arr =  isArr ? elOrArr : [ elOrArr ];
    class ApiChainLocal extends Array{ aMethod(){ return 7; }};
    if( ! elementProto )
        elementProto = Object.getPrototypeOf( isArr ? elOrArr[0] : elOrArr );
    if( elementProto === Object.getPrototypeOf( {} ))
    {
        const refObj = arr[0];
        for( let k in refObj )
            ApiChainLocal.prototype[k] = refObj[k];
    }else
        for( let k in elementProto )
            ApiChainLocal.prototype[k] = elementProto[k];


    const ret = new ApiChainLocal();
    ret.push(...arr);
    return ret;
}
