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
const style=document.createElement('style');
style.id='memo-sheet-polish';
style.textContent=`
.revisionSheetView{max-width:1180px;margin:0 auto;padding-bottom:48px}
.revisionSheetView .sheetTop{position:relative;overflow:hidden;align-items:center;margin:0 0 22px;padding:25px 27px;border:1px solid var(--line);border-radius:27px;background:linear-gradient(135deg,var(--panel) 0%,var(--accent-soft) 160%);box-shadow:0 12px 34px rgba(36,34,70,.07)}
.revisionSheetView .sheetTop:before{content:'';position:absolute;width:210px;height:210px;border-radius:50%;right:-82px;top:-118px;background:var(--accent);opacity:.075;pointer-events:none}
.revisionSheetView .sheetTop:after{content:'';position:absolute;width:110px;height:110px;border-radius:50%;right:95px;bottom:-82px;background:var(--accent);opacity:.045;pointer-events:none}
.revisionSheetView .sheetTop>div,.revisionSheetView .sheetActions{position:relative;z-index:1}
.revisionSheetView #sheetBack{margin-bottom:18px;border-color:transparent;background:rgba(255,255,255,.42);box-shadow:0 4px 14px rgba(36,34,70,.05)}
.revisionSheetView .sheetTop .eyebrow{display:inline-flex;align-items:center;gap:7px;width:max-content;padding:6px 10px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:9px;font-weight:800;letter-spacing:.12em}
.revisionSheetView .sheetTop .eyebrow:before{content:'✦';font-size:9px}
.revisionSheetView .sheetTop h2{font-size:clamp(30px,4.5vw,44px);line-height:1.04;letter-spacing:-.035em;margin:9px 0 10px}
.revisionSheetView #sheetMeta{display:inline-flex;align-items:center;max-width:min(620px,100%);min-height:30px;padding:6px 10px;border:1px solid var(--line);border-radius:10px;background:var(--panel);font-size:11px;font-weight:650;box-shadow:0 3px 12px rgba(36,34,70,.04)}
.revisionSheetView .sheetActions{gap:10px;align-items:center}
.revisionSheetView .sheetImport{min-height:43px;padding:0 16px;border:1px solid var(--accent);background:var(--accent);color:white;border-radius:13px;box-shadow:0 8px 20px rgba(109,93,252,.2);font-weight:750;transition:transform .16s ease,box-shadow .16s ease}
.revisionSheetView .sheetImport:hover{transform:translateY(-1px);box-shadow:0 11px 24px rgba(109,93,252,.25)}
.revisionSheetView #sheetDelete{min-height:43px;border-radius:13px;color:#d34b5d;background:rgba(211,75,93,.07);border-color:rgba(211,75,93,.16)}
.revisionSheetView .sheetViewer{position:relative;width:min(100%,1000px);min-height:70vh;border-radius:25px;border:1px solid var(--line);background:linear-gradient(145deg,var(--panel),var(--accent-soft));box-shadow:0 18px 48px rgba(36,34,70,.10);isolation:isolate}
.revisionSheetView .sheetViewer:after{content:'⌕  Cliquer pour agrandir';position:absolute;right:14px;bottom:14px;z-index:4;padding:8px 11px;border:1px solid rgba(255,255,255,.32);border-radius:999px;background:rgba(25,24,38,.62);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:white;font-size:10px;font-weight:750;letter-spacing:.01em;pointer-events:none;box-shadow:0 5px 18px rgba(0,0,0,.14)}
.revisionSheetView .sheetImageWrap{padding:24px;max-height:78vh}
.revisionSheetView .sheetImageWrap img{border-radius:15px;box-shadow:0 12px 34px rgba(24,23,42,.12)}
.revisionSheetView .sheetEmpty{min-height:350px;grid-template-columns:1fr;justify-items:center;text-align:center;gap:12px;padding:44px 28px;border:1.5px dashed rgba(109,93,252,.28);border-radius:26px;background:linear-gradient(145deg,var(--panel),var(--accent-soft));box-shadow:0 12px 34px rgba(36,34,70,.05)}
.revisionSheetView .sheetEmptyIcon{width:64px;height:78px;border-width:2px;border-radius:13px;box-shadow:0 12px 28px rgba(109,93,252,.12);transform:rotate(-2deg)}
.revisionSheetView .sheetEmptyIcon:after{border-left-width:16px;border-bottom-width:16px}
.revisionSheetView .sheetEmptyIcon i{left:13px;right:13px;height:3px}
.revisionSheetView .sheetEmptyIcon i:nth-of-type(1){top:27px}.revisionSheetView .sheetEmptyIcon i:nth-of-type(2){top:40px}.revisionSheetView .sheetEmptyIcon i:nth-of-type(3){top:53px}
.revisionSheetView .sheetEmptyText h3{font-size:21px;margin:4px 0 7px;letter-spacing:-.02em}
.revisionSheetView .sheetEmptyText p{max-width:490px;font-size:12px;line-height:1.6;margin:auto}
.revisionSheetView .sheetBigImport{grid-column:auto;min-height:45px;margin-top:6px;padding:0 18px;border-radius:13px;box-shadow:0 8px 22px rgba(109,93,252,.19)}
.revisionSheetView .sheetEmpty small{grid-column:auto;margin:0;padding:6px 10px;border-radius:999px;background:var(--panel);font-size:9px;letter-spacing:.06em}
@media(max-width:700px){.revisionSheetView .sheetTop{padding:20px;border-radius:22px;gap:17px}.revisionSheetView .sheetTop h2{font-size:32px}.revisionSheetView .sheetActions{display:grid;grid-template-columns:1fr auto}.revisionSheetView .sheetImport{width:100%;box-sizing:border-box}.revisionSheetView .sheetViewer{border-radius:20px}.revisionSheetView .sheetViewer:after{right:10px;bottom:10px}.revisionSheetView .sheetImageWrap{padding:12px}.revisionSheetView .sheetEmpty{min-height:330px;padding:36px 20px}.revisionSheetView .sheetBigImport{width:min(100%,320px)}}
`;
document.head.appendChild(style);
})();