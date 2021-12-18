import FetchElement from 'https://unpkg.com/slotted-element@1.0.3/fetch-element.js';
import { CssChain as $$ } from "./CssChain.js";
const $ = $$()
, arr2str = (arr,cb, separator='') => arr.map(cb).join(separator)
,   isImg = url => url && url.endsWith && ['png','gif','svg'].find( x=>url.endsWith(x) );

window.customElements.define('pokemon-link-element',
    class PokemonInfoElement extends HTMLElement
    {
        connectedCallback()
        {   const $this = $$(this)
            ,   $ = x => $this.$(x)
            ,     name = $this.attr('name')
            ,      url = $this.attr('url');

            if( isImg(url) )
                return $.html(`<img title="${name}" src="${url}">`);

            $this.html(`<a href="${url}">${name}</a><dl></dl>`);

            $('a').on('click', async e=>
            {   e.preventDefault();
                if(this.loaded)
                    return $('dl').clear(), this.loaded=0;
                this.loaded =1;
                const d = await ( await fetch(url) ).json();
                $('dl').html( render(d) );
            });

            function render( d, n='' )
            {
                if( d === undefined || d === null || 'string' === typeof d || 'number' === typeof d )
                {   if( isImg(d) )
                        return `<img title="${n}\n${d}" src="${d}">`;
                    return n ? `<span><code>${ n }</code> : <val>${ d }</val></span>` : `<val>${ d }</val>`;
                }
                if( Array.isArray( d ))
                    return `<fieldset><legend>${n}</legend>${  arr2str( d, render,'<hr/>' ) }</fieldset>`;

                let ret = [], keys = Object.keys(d);
                const link = ( d.name && d.url ) && isImg(d.url)
                       ? `<img title="${name}" src="${url}"/>`
                       : `<pokemon-link-element name="${d.name}" url="${d.url}"></pokemon-link-element> `;

                if( keys.length ===2 && d.name && d.url )
                    ret.push( link )
                else
                {   if( n )
                    {   ret.push( '<fieldset>' );
                        ret.push( `<legend>${ n }</legend>` )
                    }
                    for( let k in d )
                        switch( k )
                        {   case 'name':
                                if( d.url )
                                    break;
                            case 'url':
                                d.url && d.name && ret.push( link ); break;
                            default:
                                if( Array.isArray( d[ k ] ) )
                                    ret.push( `<fieldset><legend>${ k }</legend>${
                                        arr2str( d[ k ], v=>render(v),'<hr/>' )
                                    }</fieldset>` );
                                else
                                    ret.push( render( d[ k ], k ) );
                        }
                    n && ret.push( '</fieldset>' );
                }
                return ret.join('')
            }
        }

    });
window.customElements.define('pokemon-info-element',
    class PokemonInfoElement extends FetchElement
    {
        render(pokemon)
        {
            const { other, versions, ...sprites } = pokemon.sprites;
            const renderCollection = (title, obj) =>  `<fieldset><legend>${title}</legend>
                ${  arr2str( Object.entries(obj), ([k,v]) => !v ? ''
                           : ('string' === typeof v
                              ? `<img src="${v}" title="${k}"/>`
                              : renderCollection(k,v) ) )
                }</fieldset>`;
            const renderAbilities = () =>  `<fieldset><legend>abilities</legend>
                ${  arr2str( pokemon.abilities, a => `<a href="${a.ability.url}">${a.ability.name}</a><sup>${a.slot}</sup>` )
                }</fieldset>`;
            const nameUrlArr = (name,arr)=>`<details><summary>${name}</summary>${
                        arr2str(arr, a => `<pokemon-link-element url="${a.url}" name="${a.name}"></pokemon-link-element>` )
                    }</details>`;


            return `<h1>${ pokemon.name }</h1>
                    <img src="${ `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokemon.id}.svg` }" alt="" />
                    <div class="hiflex">
                        ${nameUrlArr('abilities',pokemon.abilities.map(a=>a.ability))}
                        ${nameUrlArr('forms',pokemon.forms)}
                        ${nameUrlArr('game indices',pokemon.game_indices.map(i=>i.version))}
                        ${nameUrlArr('moves',pokemon.moves.map(i=>i.move))}
                        ${nameUrlArr('stats',pokemon.stats.map(i=>i.stat))}
                        ${nameUrlArr('types',pokemon.types.map(i=>i.type))}
                        ${nameUrlArr('species',[pokemon.species])}
                    </div>
                    ${ renderCollection('Sprites'   ,sprites    ) }
                    ${ renderCollection('other'     ,other      ) }
                    ${ renderCollection('versions'  ,versions   ) }
                    `;
        }
    });

let offset = 0
,   limit = 10;
const getPokeList = async () =>
    (  await
        // fetch( '../test/pokeapi-page0.json')
        fetch( `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    ).json()
,   $t = $.slot('slot-select')
,   $listContainer = $t.parent().$('dl')
,   onSelected = async (p) => $$('pokemon-info-element').attr( 'src', p.url )
,   renderList = async()=>
    {
        const page = await getPokeList();
        console.log(page);

        $listContainer.clear();
        page.results.forEach( (p,i)=>
        {
            const $c = $t.clone()
            ,   arr = p.url.split('/')
            ,   id = ( arr.pop(), arr.pop() );
            $c.hidden = false;
            $c.$('input').checked = !i;
            $c.slot( 'index' ).innerText = offset + i;
            $c.slot( 'name' ).innerText = p.name;
            $c.on('click', ()=>onSelected(p) )
            $c.$('input').checked = !i;
            i || onSelected(p);
            $c.$('img').src=`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${id}.svg`;
            $listContainer.append($c);
        });
        return page;
    };
$t.remove();
const firstPage = await renderList()
$.slot('counter').text( firstPage.count );
prevBtn.onclick = ()=> renderList( offset-=limit );
nextBtn.onclick = ()=> renderList( offset+=limit );
