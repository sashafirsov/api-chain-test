export function ApiChain( css, elementProto = HTMLElement )
{
    const arr = ( typeof css === 'string' )
        ? [ ...( this || document ).querySelectorAll( css ) ]
        : Array.isArray( css )
            ? css
            : [ css ];

    return arr;

}
