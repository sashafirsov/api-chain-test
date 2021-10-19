# CssChain & ApiChain test and \<api-chain> demo
This project is a test for [css-chain](https://github.com/sashafirsov/css-chain.git).

ApiChain and CssChain JS. Collection API inherits the element one.

# Use cases


## Array of raw objects
    $$([ {a:1},{a:2} ]).a=1;    // all arr elements property `a` set to 1
    v = $$([ {a:1},{a:2} ]).a;  // 1st element property `a` is returned, i.e. 1
    $$( [ { a:1,f(v){ this.a=v} }}, { b:2,f(v){ this.b=v}} ])
            .f(3); // method called on each element, result [{a:3},{b:3}]
## Array of class objects

    C = new class
This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

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
npm link acss-chain
```

## Usage

```html
<script type="module">
    import 'api-chain/css-chain-element.js';
</script>

<api-chain></api-chain>
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode in browser:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
