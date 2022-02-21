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

    $( ...arr ){ return $( this.shadowRoot ).$(...arr); }

    __increment()
    {   const slotContent = this.$().slots().txt();
        this.$('b').innerHTML += `<span>${ slotContent }</span>`;
        this.counter = this.$('input').value = this.$('span').length;
    }
}
