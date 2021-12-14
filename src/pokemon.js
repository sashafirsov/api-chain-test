import FetchElement from 'https://unpkg.com/slotted-element@1.0.3/fetch-element.js';
import { CssChain as $$ } from "./CssChain.js";
const $=$$();

window.customElements.define('pokemon-info-element',
    class PokemonInfoElement extends FetchElement
    {


        render(pokemon)
        {
            const { other, versions, ...sprites } = pokemon.sprites;
            const renderCollection = (title, obj) =>  `<fieldset><legend>${title}</legend>
                ${
                    Object.entries(obj)
                        .map( ([k,v]) => !v ? ''
                           : ('string' === typeof v
                              ? `<img src="${v}" title="${k}"/>`
                              : renderCollection(k,v) ) )
                        .join('')
                }</fieldset>`;

            return `<h1>${ pokemon.name }</h1>
                    <img src="${ `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokemon.id}.svg` }" alt="" />
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
,   onSelected = async (p) =>
    {   const $main = $$('main');
        $$('pokemon-info-element').attr('src',p.url);
    }
,   renderList = async()=>
    {
        const page = await getPokeList();
        console.log(page);

        $listContainer.clear();
        page.results.forEach( (p,i)=>
        {
            const $c = $t.clone()
            ,   arr = p.url.split('/')
            ,   x = arr.pop()
            ,   id = arr.pop();
            $c.hidden = false;
            $c.slot( 'index' ).innerText = offset + i;
            $c.slot( 'name' ).innerText = p.name;
            $c.on('click', ()=>onSelected(p) )

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
