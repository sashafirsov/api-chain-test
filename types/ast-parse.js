import ts from "typescript";
import fs  from 'fs';

let checker, sourceFile;

const getNodeName = node => node.name?.text;
// checker.getSymbolAtLocation(node.name).getName();
// checker.getFullyQualifiedName( checker.getSymbolAtLocation(node.name) )
// node.name?.text;
// node.name?.escapedText;

function getParents( node /* ts.ClassDeclaration*/ )
{
    if( !node.heritageClauses )
        return [];
    let ret = [];
    node.heritageClauses
        .filter( clause => clause.token == ts.SyntaxKind.ExtendsKeyword
                           || clause.token == ts.SyntaxKind.ImplementsKeyword )
        .map( clause =>
            clause.types.map( t =>
            {   let symbol = checker.getSymbolAtLocation( t.expression );
                symbol && ret.push( checker.getFullyQualifiedName( symbol ) );
            }));
    return ret;
}

const mapInterfaceName2deps = {
    // HTMLElement: // given for sample
    //     {   extends: [ 'Element', 'DocumentAndElementEventHandlers', 'ElementCSSInlineStyle', 'ElementContentEditable', 'GlobalEventHandlers', 'HTMLOrSVGElement' ],
    //         inheritedBy: [ 'HTMLEmbedElement' ]
    //     }
};

const assureMemberAsMap = ( o, field ) => o[field] || ( o[field] = { extends: {}, inheritedBy: {} } );
const assureInit = (o, field, defaultValue = {}) => o[field] || ( o[field] = defaultValue );
/**
 * Prints out particular nodes from a source file
 *
 * @param file a path to a file
 */
function extract( file )
{
    // Create a Program to represent the project, then pull out the
    // source file to parse its AST.
    let program = ts.createProgram( [ file ], { allowJs: true } );
    checker = program.getTypeChecker();

    const sourceFile = program.getSourceFile( file );
    // To print the AST, we'll use TypeScript's printer
    const printer = ts.createPrinter( { newLine: ts.NewLineKind.LineFeed } );
    ts.forEachChild( sourceFile, node =>
    {
        // if( ts.isFunctionDeclaration( node ) )
        // {   name = getNodeName(node);
        //     console.log('function',name);
        // }else if( ts.isVariableStatement( node ) )
        // {
        //     name = node.declarationList.declarations[ 0 ].name.getText( sourceFile );
        //     console.log('variable',name);
        // }else
        if( ts.isInterfaceDeclaration( node ) )
        {
            const name = getNodeName(node);
            let deps = assureMemberAsMap( mapInterfaceName2deps, name );
            deps.interfaceNode = node;
            const classes = getParents( node );
            classes.map( c =>
            {
                deps.extends[ c ] = 1;
                assureMemberAsMap( mapInterfaceName2deps, c ).inheritedBy[name]=1;
            } );
        }
    } );
}

// Run the extract function with the script's arguments
// extract(process.argv[2], process.argv.slice(3));
extract( "node_modules/typescript/lib/lib.dom.d.ts" );

const member2comment = {};
const member2types = {};
const SKIP ={   start:'HTMLOListElement:start number'
            ,   childNodes:"NodeListOf<ChildNode>"
            ,   firstChild:"ChildNode|null"
            ,   firstElementChild:"Element|null"
            ,   children:"HTMLCollection"
            ,   "remove(index: number)":"Removes an element from the collection"
            ,   "remove()":"Removes an element from the collection"
            };
function scanMembers( dep )
{
    dep.interfaceNode.members.map( node =>
    {
        const fullSignature = node.getText(sourceFile);
        const isMethod = 'parameters' in node;
        const name = isMethod
                    ? fullSignature.substring(0,fullSignature.lastIndexOf('):')+1)
                    : getNodeName(node);
        if( !name || name in SKIP )
            return;

        // types
        const m2t = assureInit( member2types, name, {} );
        const tt = node?.type?.types || (node?.type? [node?.type]:[]);
        if(isMethod)
            assureInit( m2t, 'CssChainLocal', 1 );
        else
            tt.map( n=>
            {   const t = n.getText().trim();

                assureInit( m2t, t, 0 );
                m2t[ t ]++;
            });

        // comments
        const symbol = checker.getSymbolAtLocation(node.name);
        const comment = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
        const m2c = assureInit( member2comment, name, {} );
        assureInit( m2c, comment, 0 );
        m2c[ comment ]++;
    });
}
const traverseParents = clazz =>
{   for( let name in mapInterfaceName2deps[clazz].extends )
    {   scanMembers( mapInterfaceName2deps[name] );
        traverseParents(name);
    }
};
function traverseChildren ( clazz, parentName )
{   for( let name in mapInterfaceName2deps[clazz].inheritedBy )
    if( name !== parentName )
    {   scanMembers( mapInterfaceName2deps[name] );
        traverseChildren ( name, clazz )
    }
}

// extract methods with JSDoc
scanMembers(mapInterfaceName2deps.HTMLElement );
traverseParents( 'HTMLElement' );
traverseChildren ( 'HTMLElement', 'Element' );

const methods =  Object.keys(member2types).map( m=>
{
    const comments = Object.keys( member2comment[ m ] ).filter(c=>c);
    const commentsStr = comments.length ? '/* '+ comments.map( c => ` ${ c } ` ).join( '\n\n' ) + '*/\n' : '';
    return  commentsStr +'\n\t'+ m +':'
    + Object.keys(member2types[m] ).join('|') + ';\n'
}).join('\n');

/*
    0. generated CssChain.d.ts edited manually and cloned into CssChain-manual.d.ts
    1. create CssChain.d.ts
    2. copy CssChain-manual.d.ts into CssChain.d.ts
    3. append HTMLElementMixin.d.ts
 */

var stream = fs.createWriteStream("src/HTMLElementMixin.d.ts");
stream.once('open', function(fd) {
    stream.write(
`import type { CssChainLocal} from './CssChain';

export interface HTMLElementMixin {
`);
    stream.write(methods);
    stream.write(`
}
`);
    stream.end();
});

// how to extract JSDocs https://stackoverflow.com/questions/47429792/is-it-possible-to-get-comments-as-nodes-in-the-ast-using-the-typescript-compiler
// how to write type with JSDocs https://stackoverflow.com/questions/67575784/typescript-ast-factory-how-to-use-comments
