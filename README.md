# CssChain & ApiChain test and \<css-chain> demo

[css-chain](https://github.com/sashafirsov/css-chain.git) hosts `ApiChain` and `CssChain` JS. 
Collection API inherits the element API and Array.

[![NPM version][npm-image]][npm-url] [![coverage][coverage-image]][coverage-url]

## Live demo
https://unpkg.com/css-chain-test@1.1.8/dist/demo.html

# [CssChain](https://github.com/sashafirsov/css-chain/blob/main/CssChain.js)
## html elements methods
`CssChain` returns an Array inherited object which has all methods and properties of its elements.
When method is called, each element would invoke this method and then same CssChain object is returned.
```js

    function addTooltip( el ){ /* ...el.title */ }
    CssChain( '*[title]' ).forEach( el=>addTooltip( el ) )
                          .forEach( addTooltip )
                          .removeAttribute('title');
```
^^ calls `addTiooltip()` twice for each element with `title` attribute and then removes this attribute
```js
    CssChain( '*[title]', rootEL ).addEventListener( 'click', ev=> alert(ev.target.title) );
```
^^ adds event listener to all selected elements in `rootEl` DOM tree
```js
    CssChain( 'a' )
        .addEventListener( 'mouseover', ev=> alert(ev.target.classList.add('hovered') ) )
        .addEventListener( 'mouseleave', ev=> alert(ev.target.classList.remove('hovered') ) )
        .addEventListener( 'focus', ev=> alert(ev.target.classList.add('focused') ) )
        .addEventListener( 'mouseleave', ev=> alert(ev.target.classList.remove('focused') ) )
```
^^ adds multiple event handlers in chainable dot notation.

## special methods
* `forEach()` - same as [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
  returns CssChain
* `map()` - same as [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
  returns new CssChain with elements from callback
* `push(...arr)` - same as [Array.push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
  returns appended CssChain
* `querySelector(css)` - selects 1st element, returns CssChain
* `querySelectorAll(css)` - selects all children matching `css` , returns CssChain
* `$` - alias to `querySelectorAll()`
* `attr(name)` (alias for `getAttribute`) returns 1st element attribute value or `undefined` for empty collection
* `attr(name, value)` (alias for `setAttribute`) sets elements attribute, returns CssChain
* `prop(name)`  returns 1st element property value or `undefined` for empty collection
* `prop(name, value)`  sets elements attribute, returns CssChain
* `parent()` - set of immediate parents of current collection, duplications removed
* `parent(css)` - set of parents of current set which
  [matches](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches)
  the selector, duplications removed
* `on(eventName, cb)` - alias to [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
* `remove()` - delete all nodes, returns empty CssChain
* `remove(eventName, cb)` - alias to [removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

## html elements properties
When property is assigned to collection, this property would be set for all elements in collection.
The property get would return property from 1st element.
```js
    import { CssChain as $ } from '../src/CssChain.js';
    $( 'input' ).value = 'not defined'; // all INPUT elements would have new value set
    v = $( 'input' ).prop( value,'not defined' ); // same as ^^
    let  v = $( 'input' ).value; // variable would receive the 1st INPUT element value
    v = $( 'input' ).prop( value ); // same as ^^
```
# [ApiChain.js](https://github.com/sashafirsov/css-chain/blob/main/ApiChain.js)
## Array of raw objects
```js
    $([ {a:1},{a:2} ]).a=1;    // all arr elements property `a` set to 1
    v = $([ {a:1},{a:2} ]).a;  // 1st element property `a` is returned, i.e. 1
    $( [ { a:1,f(v){ this.a=v} }, { b:2,f(v){ this.b=v}} ])
        .f(3); // method called on each element, result [{a:3},{b:3}]
```
## Array of class objects
Could be initiated in same fashion as raw objects.
But for performance better to provide the reference object as a second parameter:
```js
    class A{ f(){} }
    const x = new A(), y = new A();
    $( [x,y], A ).f()
```

## Installation
for development of `css-chain` or `css-chain-test`:
```bash
git clone https://github.com/sashafirsov/css-chain.git
git clone https://github.com/sashafirsov/css-chain-test.git
cd css-chain
npm i
npm link
cd ../css-chain-test
npm i
npm link css-chain
```

## Usage

```html
<script type="module">
    import 'css-chain/css-chain-element.js';
</script>

<css-chain></css-chain>
```
# Samples of use

[PokéAPI Explorer][PokeApi-explorer-url]:
[![PokéAPI Explorer][PokeApi-explorer-image]][PokeApi-explorer-url]

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode in browser:

```bash
npm run test:watch
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

[npm-image]:      https://img.shields.io/npm/v/css-chain.svg
[npm-url]:        https://npmjs.org/package/css-chain-test
[coverage-image]: https://unpkg.com/css-chain-test@1.1.8/coverage/coverage.svg
[coverage-url]:   https://unpkg.com/css-chain-test@1.1.8/coverage/lcov-report/index.html
[PokeApi-explorer-image]: https://unpkg.com/css-chain-test@1.1.8/src/PokeApi-Explorer.png
[PokeApi-explorer-url]: https://unpkg.com/css-chain-test@1.1.8/dist/PokeApi-Explorer.html
