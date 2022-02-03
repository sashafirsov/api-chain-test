import ts from "typescript";

let checker;

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
    //     {
    //         extends: [ 'Element', 'DocumentAndElementEventHandlers', 'ElementCSSInlineStyle', 'ElementContentEditable', 'GlobalEventHandlers', 'HTMLOrSVGElement' ],
    //         inheritedBy: [ 'HTMLEmbedElement' ]
    //     }
};

const assureMemberAsMap = ( o, field ) => o[field] || ( o[field] = { extends: {}, inheritedBy: {} } );

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
    // To give constructive error messages, keep track of found and un-found identifiers
    const foundNodes = [];
    // Loop through the root AST nodes of the file
    // @ts-ignore
    ts.forEachChild( sourceFile, node =>
    {
        let name = "";
        // This is an incomplete set of AST nodes which could have a top level identifier
        // it's left to you to expand this list, which you can do by using
        // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
        // as below
        if( ts.isFunctionDeclaration( node ) )
        {
            // @ts-ignore
            name = node.name.text;
            // Hide the method body when printing
            // @ts-ignore
            node.body = undefined;
        }else if( ts.isVariableStatement( node ) )
        {
            name = node.declarationList.declarations[ 0 ].name.getText( sourceFile );
        }else if( ts.isInterfaceDeclaration( node ) )
        {
            name = node.name.text;
            foundNodes.push( [ name, node ] );
            let deps = assureMemberAsMap( mapInterfaceName2deps, name );
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
const interfaces = Object.keys(mapInterfaceName2deps);
console.log( mapInterfaceName2deps );
