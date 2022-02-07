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
const interfaces = Object.keys(mapInterfaceName2deps);
// console.log( mapInterfaceName2deps );
const member2commentCount = {};


function scanMembers( dep )
{
    dep.interfaceNode.members.map( node =>
    {
        const name = getNodeName(node);
        if( !name )
            return;
        const txt = node.getText(sourceFile).replace('readonly ','');
        const symbol = checker.getSymbolAtLocation(node.name);
        const comment = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
        if( !member2commentCount[ txt ] ) // assureMemberAsMap(member2commentCount,txt)[comment] )
            member2commentCount[ txt ]={};
        if( !member2commentCount[ txt ][ comment ] )
            member2commentCount[ txt ][ comment ] = 0;
        member2commentCount[ txt ][ comment ]++;

        // get comments
        // const commentRanges = ts.getLeadingCommentRanges(
        //     sourceFile.getFullText(),
        //     node.getFullStart());
        // if (commentRange?.length)
        //     const commentStrings:string[] =
        //               commentRanges.map(r=>sourceFile.getFullText().slice(r.pos,r.end))

        // console.log( name, 'comment',member2commentCount[txt][comment]  )
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

const methods =  Object.keys(member2commentCount).map( m=>
{
    const comments = Object.keys( member2commentCount[ m ] ).filter(c=>c);
    const commentsStr = comments.length ? '/* '+ comments.map( c => ` ${ c } ` ).join( '\n\n' ) + '*/\n' : '';
    return  commentsStr + m + '\n'
}).join('\n');

var stream = fs.createWriteStream("methods.d.ts");
stream.once('open', function(fd) {
    stream.write("interface HTMLInputElement {\n");
    stream.write(methods);
    stream.write("\n}\n");
    stream.end();
});

// how to extract JSDocs https://stackoverflow.com/questions/47429792/is-it-possible-to-get-comments-as-nodes-in-the-ast-using-the-typescript-compiler
// how to write type with JSDocs https://stackoverflow.com/questions/67575784/typescript-ast-factory-how-to-use-comments
