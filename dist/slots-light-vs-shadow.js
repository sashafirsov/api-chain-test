import{CssChain as l}from"./CssChain.js";export function createTestTree(o){let i={light:{}};function a(e){let t=e.parentNode;t.removeChild(e);let d;e.getAttribute("data-slot-assignment")==="manual"?d=t.attachShadow({mode:e.getAttribute("data-mode"),slotAssignment:"manual"}):d=t.attachShadow({mode:e.getAttribute("data-mode")});let r=e.id;return r&&(d.id=r,i[r]=d),d.appendChild(document.importNode(e.content,!0)),d}function n(e){e.id&&(i[e.id]=e);for(let t of Array.from(e.querySelectorAll("[id]")))i[t.id]=t;for(let t of Array.from(e.querySelectorAll("template")))n(a(t))}function h(e){e.id&&(i.light[e.id]=e),l("[id]",e).map(t=>i.light[t.id]=t),l("template",e).map(t=>{const d=t.parentNode;d.removeChild(t),l(d).template(t),h(d)})}const s=(e,t)=>{let d=o.cloneNode(!0);return d.id="",d.classList.add(t),t==="light"?i.light[o.id]=d:i[o.id]=d,e.parentNode.appendChild(d),d};return n(s(o,"shadow")),h(s(o,"light")),i}export function removeWhiteSpaceOnlyTextNodes(o){for(var i=0;i<o.childNodes.length;i++){var a=o.childNodes[i];a.nodeType===Node.TEXT_NODE&&a.nodeValue.trim().length==0?(o.removeChild(a),i--):(a.nodeType===Node.ELEMENT_NODE||a.nodeType===Node.DOCUMENT_FRAGMENT_NODE)&&removeWhiteSpaceOnlyTextNodes(a)}o.shadowRoot&&removeWhiteSpaceOnlyTextNodes(o.shadowRoot)}
//# sourceMappingURL=slots-light-vs-shadow.js.map
