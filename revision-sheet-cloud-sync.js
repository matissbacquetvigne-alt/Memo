(()=>{
const SUPA='https://ncfbwxdlcnepwawrwfjj.supabase.co',KEY='sb_publishable_ciRHKg-wOpS01-F0io1JHQ_6131OJth',BUCKET='memo-revision-sheets',SESSION_KEY='memo-cloud-session',DB_NAME='memo-revision-sheets',STORE='sheets';
function session(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}}
function headers(type){const s=session();if(!s?.access_token)return null;const h={apikey:KEY,Authorization:'Bearer '+s.access_token};if(type)h['Content-Type']=type;return h}
function path(deckId){const uid=session()?.user?.id;return uid?uid+'/'+encodeURIComponent(String(deckId)):null}
function db(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'deckId'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function get(deckId){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction(STORE,'readonly').objectStore(STORE).get(String(deckId));r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)})}
async function put(x){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction(STORE,'readwrite').objectStore(STORE).put(x);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
async function download(deckId){const h=headers(),p=path(deckId);if(!h||!p)return null;const r=await fetch(`${SUPA}/storage/v1/object/${BUCKET}/${p}`,{headers:h});if(r.status===404)return null;if(r.status===400){let j=null;try{j=await r.clone().json()}catch{}if(j?.code==='NoSuchKey'||j?.error==='not_found'||j?.statusCode==='404')return null}if(!r.ok)throw new Error('download '+r.status);const blob=await r.blob();return{deckId:String(deckId),name:'Fiche de révision',type:blob.type||'application/pdf',blob,updatedAt:Date.now(),cloud:true}}
async function upload(deckId,local){const h=headers(local.type||local.blob?.type||'application/octet-stream'),p=path(deckId);if(!h||!p||!local?.blob)return false;const r=await fetch(`${SUPA}/storage/v1/object/${BUCKET}/${p}`,{method:'POST',headers:{...h,'x-upsert':'true','cache-control':'3600','x-memo-name':encodeURIComponent(local.name||'Fiche de révision')},body:local.blob});if(!r.ok){let t='';try{t=await r.text()}catch{}throw new Error('upload '+r.status+' '+t)}local.cloud=true;await put(local);return true}
async function syncDeck(deckId){if(!deckId||!headers())return;const local=await get(deckId);if(local?.cloud)return;const remote=await download(deckId);if(remote){if(local?.name)remote.name=local.name;await put(remote);return}if(local?.blob)await upload(deckId,local)}
const originalOpen=window.memoOpenRevisionSheet,originalInfo=window.memoRevisionSheetInfo;
if(originalOpen)window.memoOpenRevisionSheet=async()=>{const d=typeof D==='function'?D():null;if(d)try{await syncDeck(d.id)}catch(e){console.warn('Memo sheet cloud sync',e)}return originalOpen()};
if(originalInfo)window.memoRevisionSheetInfo=async deckId=>{try{await syncDeck(deckId)}catch(e){console.warn('Memo sheet cloud sync',e)}return originalInfo(deckId)};
window.addEventListener('online',()=>{const d=typeof D==='function'?D():null;if(d)syncDeck(d.id).catch(()=>{})});
})();

(()=>{
const style=document.createElement('style');style.id='memo-sheet-polish';style.textContent=`
.revisionSheetView{position:relative;max-width:1180px;margin:0 auto;padding-bottom:48px}
.revisionSheetView .sheetTop{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:24px;margin:0 0 28px;padding:0 2px 20px;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent;box-shadow:none;overflow:visible}
.revisionSheetView .sheetTop:before{display:none}
.revisionSheetView .sheetTop:after{display:none}
.revisionSheetView.sheet-has-file .sheetTop:after{content:'✓\A IMPORTÉ';white-space:pre;display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;right:255px;bottom:20px;width:50px;height:50px;box-sizing:border-box;border:1px solid var(--accent);border-radius:9px;background:var(--accent-soft);color:var(--accent);font-size:8px;font-weight:800;line-height:1.35;letter-spacing:.04em;text-align:center}
.revisionSheetView #sheetBack{margin:0 0 25px;padding-left:0;border:0;background:transparent;box-shadow:none;color:var(--muted);font-weight:700}
.revisionSheetView #sheetBack:hover{color:var(--accent);transform:translateX(-2px)}
.revisionSheetView .sheetTop .eyebrow{display:block;width:auto;padding:0;border-radius:0;background:transparent;color:var(--accent);font-size:9px;font-weight:800;letter-spacing:.15em}
.revisionSheetView .sheetTop .eyebrow:before{display:none}
.revisionSheetView .sheetTop h2{font-size:clamp(30px,4vw,42px);line-height:1.05;letter-spacing:-.035em;margin:7px 0 7px}
.revisionSheetView #sheetMeta{display:block;min-height:0;max-width:650px;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none;color:var(--muted);font-size:11px;font-weight:600}
.revisionSheetView .sheetActions{display:flex;gap:8px;align-items:center;justify-content:flex-end;padding-bottom:1px}
.revisionSheetView .sheetImport,.revisionSheetView #sheetDelete{min-height:39px;padding:0 14px;border-radius:10px;font-size:11px;font-weight:750;box-shadow:none;transition:background .15s ease,border-color .15s ease,transform .15s ease}
.revisionSheetView .sheetImport{border:1px solid var(--accent);background:var(--accent);color:white}
.revisionSheetView .sheetImport:hover{transform:translateY(-1px);box-shadow:none}
.revisionSheetView #sheetDelete{color:#c44a59;background:transparent;border-color:rgba(196,74,89,.24)}
.revisionSheetView #sheetDelete:hover{background:rgba(196,74,89,.06)}
.revisionSheetView .sheetViewer{position:relative;width:min(100%,860px);min-height:70vh;margin:0 auto;border:1px solid var(--line);border-radius:12px;background:var(--panel);overflow:hidden;box-shadow:0 8px 26px rgba(36,34,70,.07);isolation:isolate}
.revisionSheetView .sheetViewer:hover{transform:none;box-shadow:0 10px 30px rgba(36,34,70,.09)}
.revisionSheetView .sheetViewer:after{content:'Agrandir';position:absolute;right:12px;bottom:12px;z-index:4;padding:6px 9px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:rgba(25,24,38,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:white;font-size:9px;font-weight:700;pointer-events:none}
.revisionSheetView .sheetImageWrap{padding:10px;max-height:78vh}
.revisionSheetView .sheetImageWrap img{border-radius:6px;box-shadow:none}
.revisionSheetView .sheetEmpty{position:absolute;z-index:3;top:118px;right:270px;width:46px;height:46px;min-height:0;box-sizing:border-box;margin:0;padding:0;border:0;background:transparent;box-shadow:none;display:block}
.revisionSheetView .sheetEmpty[hidden]{display:none!important}
.revisionSheetView:has(.sheetEmpty:not([hidden])) .sheetActions .sheetImport{display:none}
.revisionSheetView .sheetEmptyIcon,.revisionSheetView .sheetEmptyText,.revisionSheetView .sheetEmpty small{display:none}
.revisionSheetView .sheetBigImport{position:relative;width:46px;height:46px;min-height:46px;margin:0;padding:0;border:1px solid var(--accent);border-radius:10px;background:var(--accent);color:transparent;font-size:0;box-shadow:none;display:flex;align-items:center;justify-content:center;overflow:hidden}
.revisionSheetView .sheetBigImport:before{content:'+';color:#fff;font-size:24px;font-weight:500;line-height:1}
.revisionSheetView .sheetBigImport:hover{transform:translateY(-1px)}
@media(max-width:900px){.revisionSheetView .sheetEmpty{right:220px}.revisionSheetView.sheet-has-file .sheetTop:after{right:205px}}
@media(max-width:700px){.revisionSheetView .sheetTop{grid-template-columns:1fr;align-items:stretch;gap:16px;padding:0 0 18px;margin-bottom:20px}.revisionSheetView #sheetBack{margin-bottom:20px}.revisionSheetView .sheetTop h2{font-size:31px}.revisionSheetView .sheetActions{display:grid;grid-template-columns:1fr auto;justify-content:stretch}.revisionSheetView .sheetImport{width:100%;box-sizing:border-box}.revisionSheetView .sheetViewer{border-radius:10px}.revisionSheetView .sheetImageWrap{padding:6px}.revisionSheetView .sheetEmpty{position:static;width:44px;height:44px;margin:-4px 0 14px auto}.revisionSheetView .sheetBigImport{width:44px;height:44px;min-height:44px}.revisionSheetView:has(.sheetEmpty:not([hidden])) .sheetActions .sheetImport{display:none}.revisionSheetView.sheet-has-file .sheetTop:after{position:static;grid-row:2;grid-column:1;width:46px;height:46px;margin-left:auto;margin-bottom:-62px}}
`;document.head.appendChild(style);
const view=document.querySelector('.revisionSheetView'),viewer=document.getElementById('sheetViewer');
if(view&&viewer){const sync=()=>view.classList.toggle('sheet-has-file',!viewer.hidden);sync();new MutationObserver(sync).observe(viewer,{attributes:true,attributeFilter:['hidden']})}
})();