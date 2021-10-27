import n from"../src/CssChain.js";export class CssChainElement extends HTMLElement{constructor(){super();this.title="Hey there",this.counter=0;const t=document.createElement("div");t.innerHTML=this.template,this.attachShadow({mode:"open"}).appendChild(t),this.$("button").addEventListener("click",()=>this.__increment())}get template(){return`
<slot></slot> &bull;
<b></b><br/>
<input /><button>\u{1F6D2}</button>
`}$(t,e){return n(t,this.shadowRoot,e)}__increment(){const t=this.$("slot")[0].assignedNodes()[0].textContent;this.$("b").innerHTML+=`<span>${t}</span>`,this.counter=this.$("input").value=this.$("span").length}}
//# sourceMappingURL=CssChainElement.js.map
