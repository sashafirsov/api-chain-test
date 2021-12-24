var w=Object.getOwnPropertySymbols;var E=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable;var x=(s,e)=>{var l={};for(var n in s)E.call(s,n)&&e.indexOf(n)<0&&(l[n]=s[n]);if(s!=null&&w)for(var n of w(s))e.indexOf(n)<0&&A.call(s,n)&&(l[n]=s[n]);return l};import P from"https://unpkg.com/slotted-element@1.0.3/fetch-element.js";import{CssChain as u}from"https://unpkg.com/css-chain@1/CssChain.js";const f=(s,e,l="")=>s.map(e).join(l),k=s=>s&&s.endsWith&&["png","gif","svg"].find(e=>s.endsWith(e));window.customElements.define("pokemon-link-element",class extends HTMLElement{connectedCallback(){const e=u(this),l=t=>e.$(t),n=e.attr("name"),c=e.attr("url");if(k(c)){debugger;return e.html(`<img title="${n}" src="${c}">`)}e.html(`<a href="${c}">${n}</a><dl></dl>`),l("a").on("click",async t=>{if(t.preventDefault(),this.loaded)return l("dl").clear(),this.loaded=0;this.loaded=1;const r=await(await fetch(c)).json();l("dl").html(m(r))});function m(t,r=""){if(t==null||typeof t=="string"||typeof t=="number")return k(t)?`<img title="${r}
${t}" src="${t}">`:r?`<span><code>${r}</code> : <val>${t}</val></span>`:`<val>${t}</val>`;if(Array.isArray(t))return`<fieldset><legend>${r}</legend>${f(t,m,"<hr/>")}</fieldset>`;let o=[],i=Object.keys(t);const $=t.name&&t.url&&k(t.url)?`<img title="${n}" src="${c}"/>`:`<pokemon-link-element name="${t.name}" url="${t.url}"></pokemon-link-element> `;if(i.length===2&&t.name&&t.url)o.push($);else{r&&(o.push("<fieldset>"),o.push(`<legend>${r}</legend>`));for(let a in t)switch(a){case"name":if(t.url)break;case"url":t.url&&t.name&&o.push($);break;default:Array.isArray(t[a])?o.push(`<fieldset><legend>${a}</legend>${f(t[a],d=>m(d),"<hr/>")}</fieldset>`):o.push(m(t[a],a))}r&&o.push("</fieldset>")}return o.join("")}}}),window.customElements.define("pokemon-info-element",class extends P{render(e){const o=e.sprites,{other:l,versions:n}=o,c=x(o,["other","versions"]),m=(i,$)=>`<fieldset><legend>${i}</legend>
                ${f(Object.entries($),([a,d])=>d?typeof d=="string"?`<img src="${d}" title="${a}"/>`:m(a,d):"")}</fieldset>`,t=()=>`<fieldset><legend>abilities</legend>
                ${f(e.abilities,i=>`<a href="${i.ability.url}">${i.ability.name}</a><sup>${i.slot}</sup>`)}</fieldset>`,r=(i,$)=>`<details><summary>${i}</summary>${f($,a=>`<pokemon-link-element url="${a.url}" name="${a.name}"></pokemon-link-element>`)}</details>`;return`<h1>${e.name}</h1>
                    <img src="${`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${e.id}.svg`}" alt="" />
                    <div class="hiflex">
                        ${r("abilities",e.abilities.map(i=>i.ability))}
                        ${r("forms",e.forms)}
                        ${r("game indices",e.game_indices.map(i=>i.version))}
                        ${r("moves",e.moves.map(i=>i.move))}
                        ${r("stats",e.stats.map(i=>i.stat))}
                        ${r("types",e.types.map(i=>i.type))}
                        ${r("species",[e.species])}
                    </div>
                    ${m("Sprites",c)}
                    ${m("other",l)}
                    ${m("versions",n)}
                    `}});let p=0,h=10;const B=async()=>(await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${h}&offset=${p}`)).json(),j=u(),y=async s=>u("pokemon-info-element").attr("src",s.url),I=s=>(e=>(e.pop(),e.pop()))(s.url.split("/")),C=s=>`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${I(s)}.svg`,g=j.slot("slot-select"),b=g.parent().$("dl"),v=async()=>{const s=await B();return b.clear(),b.append(g.clone(s.results,(e,l,n)=>u(e).prop("hidden",!1).prop("checked",!n,"input").prop("src",C(l),"img").on("click",()=>y(l)).slot("index",p+n).slot("name",l.name))),s.results.forEach((e,l)=>{const n=g.clone();n.hidden=!1,n.$("input").checked=!l,n.slot("index").innerText=p+l,n.slot("name").innerText=e.name,n.on("click",()=>y(e)),n.$("img").src=C(e),b.append(n)}),y(s.results[0]),prevBtn.disabled=p<=0,nextBtn.disabled=p+h>=s.count,s};g.remove();const L=await v();j.slot("counter").text(L.count),prevBtn.onclick=()=>v(p-=h),nextBtn.onclick=()=>v(p+=h);
//# sourceMappingURL=PokeApi-Explorer.js.map
