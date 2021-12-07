import { CssChain as $$ } from "./CssChain.js";
const getPokeList = async page =>
    await(  await
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${page}`)
    ).json()
, firstPage = await getPokeList(0);
console.log(firstPage);
const $ = $$();
$.slot('counter').text( firstPage.count );

