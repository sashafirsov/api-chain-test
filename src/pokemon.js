import { CssChain as $$ } from "./CssChain.js";
let offset = 0
,   limit = 30;
const getPokeList = async () =>
    (  await
        fetch( '../test/pokeapi-page0.json') //`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    ).json()
,   renderList = async()=>
    {
        const page = await getPokeList();
        console.log(page);
        const $t = $.slot('slot-select');
        page.results.forEach( (p,i)=>
        {
            const $clone = $t.clone()
            ,   arr = p.url.split('/')
            ,   x = arr.pop()
            ,   id = arr.pop();
            $clone.hidden = false;
            $clone.slot( 'index' ).innerText = offset + i;
            $clone.slot( 'name' ).innerText = p.name;

            $clone.$('img').src=`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${id}.svg`;
            $t.parent().append($clone);
        });
        return page;
    }
,   firstPage = renderList();
const $ = $$();
$.slot('counter').text( firstPage.count );
prevBtn.onclick = ()=> renderList( offset+=limit );
nextBtn.onclick = ()=> renderList( offset-=limit );
