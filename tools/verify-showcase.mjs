// Static artifact audit only. Does not contact GitHub, OpenAI or any other service.
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve,dirname,relative,join} from 'node:path';
import assert from 'node:assert/strict';
export const allowedFiles=new Set(['.gitignore','README.md','docs/case-study.md','docs/evaluation.md','docs/footage-review.md',
 'docs/archived-ai-example.md','docs/example-provenance.json','docs/original-alex-terry-response.txt',
 'assets/fg-coach-review.png','assets/alex-terry-evidence.png','assets/alex-terry-coaching.png','tools/verify-showcase.mjs']);
export function assertSafeInventory(files){for(const file of files)assert.ok(allowedFiles.has(file),'Unreviewed file: '+file);}
export function assertSafeText(text){
 assert.doesNotMatch(text,/[A-Z]:[\\/](?:Users|clips|Windows)\b/i,'Private Windows path');
 assert.doesNotMatch(text,/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/,'Email address');
 assert.doesNotMatch(text,/https?:\/\/github\.com\/[^/]+\/FG-Coach(?:\/|[?#\s]|$)/i,'Private development dependency');
 assert.doesNotMatch(text,/(?:sk|sess|refresh)[_-][A-Za-z0-9]{16,}/,'Credential-like text');
 assert.doesNotMatch(text,/\b(?:accountRef|access_token|refresh_token)\s*["']?\s*:/i,'Account or token field');
}
export function assertPngNoText(bytes){
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 const chunks=[];let n=8;
 while(n<bytes.length){const length=bytes.readUInt32BE(n),kind=bytes.toString('ascii',n+4,n+8);assert.ok(n+length+12<=bytes.length);chunks.push(kind);n+=length+12;if(kind==='IEND')break;}
 assert.equal(n,bytes.length);assert.ok(chunks.includes('IDAT'));
 assert.ok(chunks.every(k=>!['tEXt','iTXt','zTXt','eXIf'].includes(k)),'Unreviewed PNG text/EXIF metadata');
 return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),chunks};
}
export async function audit(root){
 const files=[];async function walk(dir){for(const e of await readdir(join(root,dir),{withFileTypes:true})){assert.ok(!e.isSymbolicLink(),'Symlink not allowed');const p=[dir,e.name].filter(Boolean).join('/');if(e.isDirectory())await walk(p);else files.push(p);}}
 await walk('');assertSafeInventory(files);assert.equal(files.length,allowedFiles.size);
 const hashes={},images={};
 for(const file of files){const bytes=await readFile(join(root,file));hashes[file]=createHash('sha256').update(bytes).digest('hex');
  if(file.endsWith('.png'))images[file]=assertPngNoText(bytes);
  else{const text=bytes.toString('utf8');assertSafeText(text);
   if(file.endsWith('.md'))for(const m of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)){
    const link=m[1];if(/^https:\/\//.test(link))continue;
    const target=relative(root,resolve(root,dirname(file),link)).replaceAll('\\','/');assert.ok(files.includes(target),'Missing local link: '+file+' -> '+link);
   }
  }
 }
 assert.equal(hashes['assets/fg-coach-review.png'],'f1e2d360d23f602cab191b9099a04783a1955252a16eec9723bdb5cb2c697429');
 assert.equal(hashes['assets/alex-terry-evidence.png'],'71f33ae2982845a88149686181179c96321f83a5a3bbbf7563f0e13af132bd97');
 assert.equal(hashes['assets/alex-terry-coaching.png'],'ab0c093f5c1c50acd236d6ff8bf87616d5571ed81117d95b23b233ca79890532');
 assert.equal(hashes['docs/original-alex-terry-response.txt'],'5dcd42c0856a7169f3198832ec3067464123a91831627d0fb974f25353357e4e');
 assert.equal(images['assets/fg-coach-review.png'].width,1920);assert.equal(images['assets/fg-coach-review.png'].height,1080);
 const readme=await readFile(join(root,'README.md'),'utf8'),study=await readFile(join(root,'docs/case-study.md'),'utf8');
 assert.equal(hashes['docs/case-study.md'],'b35455be41ff32ddfee1a2f3588085173ef10e01b57ff3a6dbfff17127b879e6','Approved tightened case study must remain byte-identical');
 assert.doesNotMatch(readme+study,/\bFGC Coach\b|Hybrid r2\.1|\bSol\b|Phase 4C|RW-001|P0 FAIL/);
 assert.match(readme,/surveys 30 images/);assert.match(readme,/proposes up to two moments/);
 const feedback=s=>s.match(/\| Players \| Skill level \| Feedback \|[\s\S]*?(?=\r?\n\r?\n)/)?.[0].replaceAll('\r\n','\n');
 assert.ok(feedback(readme));assert.equal(feedback(readme),feedback(study));
 assert.match(readme,/\| 5 \| Bronze to low Diamond/);assert.match(readme,/\| 1 \| High Diamond to low Master/);
 assert.match(readme,/coaching output only and did not use the app/);
 assert.match(readme,/coaching failed human review/);assert.match(readme,/## Scope/);
 assert.doesNotMatch(readme,/<!--|footage.clearance/);
 const original=await readFile(join(root,'docs/original-alex-terry-response.txt'));
 const evidenceDoc=await readFile(join(root,'docs/archived-ai-example.md'));
 assert.ok(evidenceDoc.subarray(-original.length).equals(original),'Original advice changed in evidence document');
 return {passed:true,fileCount:files.length,privateLinks:0,missingLinks:0,unreviewedFiles:0,uiScreenshotUnchanged:true,originalAIResponseUnchanged:true,
  pngTextOrExifMetadata:false,images,hashes,publicationReady:false,note:'Static checks are not a legal clearance, an exhaustive security audit, or a substitute for final visual/privacy and publication approval.'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await audit(resolve(dirname(fileURLToPath(import.meta.url)),'..')),null,2));
