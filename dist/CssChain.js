import{setProp as i}from"./ApiChain.js";class l extends Array{attr(...t){return t.length>1?this.setAttribute(...t):this.getAttribute(...t)}prop(...t){return t.length>1?this.forEach(e=>e[t[0]]=t[1]):this[0][t[0]]}forEach(...t){return Array.prototype.forEach.apply(this,t),this}map(...t){return Array.prototype.map.apply(this,t)}push(...t){return Array.prototype.push.apply(this,t),this}querySelector(t){return new l().push(this.querySelectorAll(t)[0])}querySelectorAll(t){return this.reduce((e,r)=>e.push(...r.querySelectorAll(t)),new l)}$(...t){return this.querySelectorAll(...t)}parent(t){const e=new Set,r=o=>e.has(o)?0:(e.add(o),o),p=o=>{for(;o=o.parentElement;)if(o.matches(t))return r(o)};return this.map(t?p:o=>r(o.parentElement)).filter(o=>o)}on(...t){return this.addEventListener(...t)}remove(...t){if(!t.length)return this.forEach(p=>p.remove()),new l;const e=t[0];return typeof t[1]==="function"?this.removeEventListener(...t):this.map(p=>p.matches(e)).filter(p=>p)}}const s=new Set,h=Object.getPrototypeOf({});export function applyPrototype(n,t){const e=typeof n=="string"?document.createElement(n):n;if(!s.has(e.tagName)){s.add(e.tagName);for(let r in e)r in t.prototype||i(e,r,t);for(let r;(r=Object.getPrototypeOf(e))!==h&&r!=null&&!s.has(r);){s.add(r);for(let p of Object.getOwnPropertyNames(r))p in t.prototype||i(e,p,t)}}}Object.getOwnPropertyNames(window).filter(n=>n.startsWith("HTML")&&n.endsWith("Element")&&n.length>11).map(n=>n.substring(4,n.length-7).toLowerCase()).forEach(n=>applyPrototype(document.createElement(n),l));export function CssChain(n,t=document,e=[]){const r=t.querySelectorAll(n);Array.isArray(e)?e.length||(e=[...r].slice(0,256)):e=[e],e.forEach(o=>applyPrototype(o,l));const p=new l;return p.push(...r),p}export default CssChain;
//# sourceMappingURL=CssChain.js.map
