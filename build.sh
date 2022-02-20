node types/generate-mixin.js
bash ./test.sh

PACKAGE_VERSION=$(node -pe "require('css-chain/package.json').version")
echo $PACKAGE_VERSION

rm -rf dist
mkdir dist
cp src/*.html dist
cp src/*.d.ts dist
sed "s/..\/src\/css-chain-element.js/css-chain-element.js/" src/demo.html >dist/demo.html

# https://kangax.github.io/compat-table/es2016plus/
esbuild src/*.js --minify --sourcemap --target=chrome97,firefox95,safari15,edge96 --outdir=dist
