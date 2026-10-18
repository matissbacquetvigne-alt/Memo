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
.revisionSheetView{max-width:1180px;margin:0 auto;padding-bottom:48px}
.revisionSheetView .sheetTop{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:24px;margin:0 0 28px;padding:0 2px 20px;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent;box-shadow:none;overflow:visible}
.revisionSheetView .sheetTop:before,.revisionSheetView .sheetTop:after{display:none}
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
.revisionSheetView .sheetEmpty{min-height:300px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:11px;padding:38px 24px;border:1px dashed var(--line);border-radius:12px;background:transparent;box-shadow:none}
.revisionSheetView .sheetEmptyIcon{width:48px;height:59px;border:1.5px solid var(--accent);border-radius:8px;background:var(--accent-soft);box-shadow:none;transform:none}
.revisionSheetView .sheetEmptyIcon:after{border-left-width:11px;border-bottom-width:11px}
.revisionSheetView .sheetEmptyIcon i{left:10px;right:10px;height:2px}.revisionSheetView .sheetEmptyIcon i:nth-of-type(1){top:21px}.revisionSheetView .sheetEmptyIcon i:nth-of-type(2){top:31px}.revisionSheetView .sheetEmptyIcon i:nth-of-type(3){top:41px}
.revisionSheetView .sheetEmptyText h3{font-size:18px;margin:3px 0 5px;letter-spacing:-.015em}.revisionSheetView .sheetEmptyText p{max-width:470px;font-size:11px;line-height:1.55;margin:auto}
.revisionSheetView .sheetBigImport{grid-column:auto;min-height:40px;margin-top:5px;padding:0 15px;border-radius:10px;box-shadow:none}
.revisionSheetView .sheetEmpty small{grid-column:auto;margin:0;color:var(--muted);background:transparent;padding:0;font-size:9px;font-weight:700;letter-spacing:.05em}
@media(max-width:700px){.revisionSheetView .sheetTop{grid-template-columns:1fr;align-items:stretch;gap:16px;padding:0 0 18px;margin-bottom:20px}.revisionSheetView #sheetBack{margin-bottom:20px}.revisionSheetView .sheetTop h2{font-size:31px}.revisionSheetView .sheetActions{display:grid;grid-template-columns:1fr auto;justify-content:stretch}.revisionSheetView .sheetImport{width:100%;box-sizing:border-box}.revisionSheetView .sheetViewer{border-radius:10px}.revisionSheetView .sheetImageWrap{padding:6px}.revisionSheetView .sheetEmpty{min-height:285px;padding:32px 18px}.revisionSheetView .sheetBigImport{width:min(100%,300px)}}
`;document.head.appendChild(style);
})();