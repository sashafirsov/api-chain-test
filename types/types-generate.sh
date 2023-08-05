# to be run from proj root
npx -p typescript tsc src/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
cp src/*.d.ts types/
node types/generate-mixin.js
rm types/*.d.ts
