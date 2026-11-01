import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../app/src/main/assets');
const file=(n)=>fs.readFileSync(path.join(base,n),'utf8');
const index=file('index.html');
const javascript=[...index.matchAll(/<script\s+src="([^"]+)"/g)].map(x=>x[1]);
const styles=[...index.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map(x=>x[1]);
assert.ok(javascript.includes('identity.js')&&javascript.includes('soundgarden.js')&&javascript.at(-1)==='app.js');
assert.ok(styles.includes('magic-world.css')&&styles.includes('storybook.css'));
for(const ref of [...javascript,...styles]){
 assert.ok(!ref.includes('..')&&!ref.includes('/')&&!ref.includes(':'),'unexpected resource path '+ref);
 assert.ok(fs.existsSync(path.join(base,ref)),'missing local asset '+ref);
}
for(const cssName of styles){
 const css=file(cssName);
 for(const match of css.matchAll(/url\((["']?)([^"')]+)\1\)/g)){
  const ref=match[2];
  if(ref.startsWith('data:'))continue;
  assert.ok(!ref.startsWith('https:')&&!ref.startsWith('http:'),'remote CSS asset '+ref);
  assert.ok(!ref.includes('..')&&!ref.startsWith('/'),'out-of-package CSS resource '+ref);
  assert.ok(fs.existsSync(path.join(base,ref)),'CSS file missing '+ref);
 }
}
const scene=file('eva-valley.svg'),character=file('wolfie.svg');
const starterNames=['cat','dog','sun','apple','ball','mom'];
for(const w of starterNames){
 const illustration=file('first-'+w+'.svg');
 assert.ok(illustration.startsWith('<svg '),'real offline SVG illustration '+w);
 const safeMarkup=illustration.replace('http://www.w3.org/2000/svg','');
 for(const bad of ['<script','https://','http://','onload=','<foreignObject'])
  assert.ok(!safeMarkup.includes(bad),'unsafe external or executable content in beginner art '+w);
}
for(const [name,svg] of [['landscape',scene],['character',character]]){
 assert.match(svg,/<svg\s[^>]*viewBox=/,'scalable SVG '+name);
 assert.doesNotMatch(svg,/<script\b|<foreignObject\b|onload=|href=["']https?:|<image\b/i,'no remote or executable SVG content '+name);
 assert.match(svg,/<title/,'descriptive illustration title '+name);
}
const jsContent=javascript.map(file).join('\n');
assert.doesNotMatch(jsContent,/\bfetch\s*\(|new\s+XMLHttpRequest|new\s+WebSocket|navigator\.sendBeacon/,'no networking code in child application');
const gradle=fs.readFileSync(path.join(base,'../../../build.gradle'),'utf8');
assert.match(gradle,/applicationId 'com\.eva\.english\.kids'/,'Android 13 fresh-install application ID');
assert.match(gradle,/minSdk 24/,'Android 13 supported by minSdk 24');
assert.match(gradle,/targetSdk 35/,'newer Android supported');
assert.match(gradle,/versionCode 15/,'new preschool build version');
const manifest=fs.readFileSync(path.join(base,'../AndroidManifest.xml'),'utf8');
assert.match(manifest,/android:name="com\.wolfie\.kids\.MainActivity"/,'explicit launchable class under the original Java namespace');
assert.match(manifest,/android:allowBackup="false"/);
assert.match(manifest,/<queries>/,'Android 13 package visibility for installed speech engines');
assert.match(manifest,/android\.intent\.action\.TTS_SERVICE/,'offline TextToSpeech discoverability');
const java=fs.readFileSync(path.join(base,'../java/com/wolfie/kids/MainActivity.java'),'utf8');
assert.match(java,/Handler\(android\.os\.Looper\.getMainLooper\(\)\)/,'Android voice initialized after constructor returns');
assert.match(java,/configureEnglishSpeech/,'on-device TTS readiness is configured');
assert.match(java,/isLanguageAvailable\(Locale\.US\)/,'English voice support is checked');
assert.doesNotMatch(manifest,/android\.permission\./,'child app needs no permissions');
console.log('PASS: '+javascript.length+' scripts, '+styles.length+' styles, 2 original safe SVG illustrations; local-only assets and no Android permissions');
