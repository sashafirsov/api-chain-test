import { CssChain as $$ } from "./CssChain.js";

const templateStr=`
    <i>out of slot</i>
    <style>div{padding: 0 1rem}</style>
    <slot>
        default slot
        <div><slot name="inner-1">inner 1</slot></div>
        <div>
            <slot name="inner-2">inner 2
                <div><slot name="inner-2-1">inner 1 in 2</slot></div>
                <div><slot name="inner-2-2">inner 2 in 2</slot></div>
            </slot>
        </div>
    </slot>
    <p><slot name="outer">
        outer slot
    </slot></p>
`;
class SlotsInShadowDemo extends HTMLElement
{
    constructor()
    {   super();
        let template = document.createElement('template');
        template.innerHTML = templateStr;
        const shadowRoot = this.attachShadow({mode: 'open'})
                                .appendChild(template.content);
        this.$ = css => css ?  $$(css,shadowRoot) : $$(shadowRoot);
    }
}
window.customElements.define( 'slots-in-shadow', SlotsInShadowDemo);
