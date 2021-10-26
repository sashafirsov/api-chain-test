bash ./test.sh

PACKAGE_VERSION=$(node -pe "require('css-chain/package.json').version")
echo $PACKAGE_VERSION

rm -rf dist
mkdir dist
cp src/css-chain-element.js dist
cp src/CssChainElement.js dist
sed "s/..\/src\/CssChain.js/..\/..\/css-chain@$PACKAGE_VERSION\/CssChain.js/" src/CssChainElement.js >dist/CssChainElement.js
sed "s/..\/src\/css-chain-element.js/css-chain-element.js/" demo/index.html >dist/demo.html
