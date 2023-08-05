# TypeScript and IDE suggestion for CssChain

CssChain.d.ts uses DOM definitions from

# types generation
On proj root level
## 1. Generate initial CssChain.d.ts 
[Creating .d.ts Files from .js files](https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html)

    npx -p typescript tsc src/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
## 2. combine whole HTMLElement dependency tree 
[generate-mixin.js](generate-mixin.js)
    
    node types/generate-mixin.js 
From [typescript/lib/lib.dom.d.ts](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts).

1. Traverse over `lib.dom.d.ts` AST and create the inheritance tree for all interfaces.
2. From inheritance tree collect all related to HTMLElement as collection of names
3. by iterating over AST, dump out bodies of the interfaces from collection into HTMLElementMixin interface.

#links
* [Using TypeScript compiler](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
