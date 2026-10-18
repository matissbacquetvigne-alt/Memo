(()=>{
const SUPA='https://ncfbwxdlcnepwawrwfjj.supabase.co',KEY='sb_publishable_ciRHKg-wOpS01-F0io1JHQ_6131OJth',BUCKET='memo-revision-sheets',SESSION_KEY='memo-cloud-session',DB_NAME='memo-revision-sheets',STORE='sheets';
function session(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}}
function headers(type){const s=session();if(!s?.access_token)return null;const h={apikey:KEY,Authorization:'Bearer '+s.access_token};if(type)h['Content-Type']=type;return h}
function path(deckId){const uid=session()?.user?.id;return uid?uid+'/'+encodeURIComponent(String(deckId)):null}
function db(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'deckId'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function get(deckId){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction(STORE,'readonly').objectStore(STORE).get(String(deckId));r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)})}
async function put(x){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction(STORE,'readwrite').objectStore(STORE).put(x);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
async function download(deckId){const h=headers(),p=path(deckId);if(!h||!p)return null;const r=await fetch(`${SUPA}/storage/v1/object/${BUCKET}/${p}`,{headers:h});if(r.status===404)return null;if(!r.ok)throw new Error('download '+r.status);const blob=await r.blob();return{deckId:String(deckId),name:'Fiche de révision',type:blob.type||'application/pdf',blob,updatedAt:Date.now(),cloud:true}}
async function upload(deckId,local){const h=headers(local.type||local.blob?.type||'application/octet-stream'),p=path(deckId);if(!h||!p||!local?.blob)return false;const r=await fetch(`${SUPA}/storage/v1/object/${BUCKET}/${p}`,{method:'POST',headers:{...h,'x-upsert':'true','cache-control':'3600'},body:local.blob});if(!r.ok)throw new Error('upload '+r.status);local.cloud=true;await put(local);return true}
async function syncDeck(deckId){if(!deckId||!headers())return;let local=await get(deckId);if(local?.cloud)return;const remote=await download(deckId);if(remote){if(local?.name)remote.name=local.name;await put(remote);return}if(local?.blob)await upload(deckId,local)}
const originalOpen=window.memoOpenRevisionSheet,originalInfo=window.memoRevisionSheetInfo;
if(originalOpen)window.memoOpenRevisionSheet=async()=>{const d=typeof D==='function'?D():null;if(d)try{await syncDeck(d.id)}catch(e){console.warn('Memo sheet cloud sync',e)}return originalOpen()};
if(originalInfo)window.memoRevisionSheetInfo=async deckId=>{try{await syncDeck(deckId)}catch(e){console.warn('Memo sheet cloud sync',e)}return originalInfo(deckId)};
window.addEventListener('online',()=>{const d=typeof D==='function'?D():null;if(d)syncDeck(d.id).catch(()=>{})});
})();