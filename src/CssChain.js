import {setProp} from './ApiChain.js';

// todo use Prototype2ApiChain to point to this ApiChainLocal
class ApiChainLocal extends Array{}
const appliedTypes = new Set();
const OBJ_prototype = Object.getPrototypeOf( {} );

function applyPrototype( clazz, ApiChain )
{
    if( appliedTypes.has(clazz) )
        return;

    for ( let proto = clazz; proto !== OBJ_prototype && proto != null ; proto = Object.getPrototypeOf(proto) )
    {   if( !proto.prototype )
            return;
        appliedTypes.add(proto);
        for( let k of Object.getOwnPropertyNames(proto.prototype) )
            if( !( k in ApiChain.prototype ) )
                setProp( proto, k, ApiChain );
    }
}
    export function
CssChain( css, el=document, typesArr=[HTMLInputElement, HTMLFormElement, HTMLLinkElement] )
{
    const arr = el.querySelectorAll( css );
    if( !Array.isArray(typesArr) )
        typesArr = [typesArr];
    typesArr.forEach( t=> applyPrototype(t,ApiChainLocal) )
    const ret = new ApiChainLocal();
    ret.push(...arr);
    return ret;
}
export default CssChain;
