import $ from './CssChain.js';

    export class
CssChainElement extends HTMLElement
{
    constructor()
    {
        super();
        this.title = 'Hey there';
        this.counter = 0;

        const t = document.createElement('div');
        t.innerHTML = this.template;
        // this.innerHTML = this.template;

        this.attachShadow({mode: 'open'}).appendChild(t);
        this.$('button').addEventListener('click', ()=>this.__increment() );
    }

    get template()
    {   return `
<slot></slot> &bull;
<b></b><br/>
<input /><button>🛒</button>
`
    }

    $( css, protoArr ){ return $( css, this.shadowRoot, protoArr ); }

    __increment()
    {   const slotContent = this.$('slot')[0].assignedNodes()[0].textContent;
        this.$('b').innerHTML += `<span>${ slotContent }</span>`;
        this.counter = this.$('input').value = this.$('span').length;
    }
}
