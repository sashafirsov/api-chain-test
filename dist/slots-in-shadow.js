"use strict";import{CssChain as e}from"./CssChain.js";const s=`
    <i>out of slot</i>
    <style>
        div{padding: 0 1rem}
        slot{ color: red}
        p>slot{ color: darkviolet;}
        slot slot{ color: green;}
        slot slot slot{ color: blue;}
    </style>
    <slot style="background-color:red ">
        default slot
        <div><slot name="inner-1">inner 1</slot></div>
        <div>
            <slot name="inner-2">inner 2
                <div><slot name="inner-2-1">inner 1 in 2</slot></div>
                <div><slot name="inner-2-2">inner 2 in 2</slot></div>
            </slot>
        </div>
    </slot>
    <p>
        prefix
        <slot name="outer">
            outer slot
            <script type="bogus">ignore it<\/script>
        </slot>
        suffix
    </p>
`;class n extends HTMLElement{constructor(){super();let t=document.createElement("template");t.innerHTML=s,this.attachShadow({mode:"open"}).appendChild(t.content),this.$=o=>o?e(o,this.shadowRoot):e(this.shadowRoot)}}window.customElements.define("slots-in-shadow",n);
//# sourceMappingURL=slots-in-shadow.js.map
