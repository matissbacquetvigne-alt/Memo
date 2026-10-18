(()=>{
  const files=["calendar.js","time-picker.js","routine-planner.js","task-status-colors.js","past-days.js","debt-manager.js"];
  let loading=null,ready=false,replay=false;
  const standalone=window.navigator.standalone===true||matchMedia("(display-mode: standalone)").matches;
  const appleTablet=/iPad/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  const loadScript=src=>new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.async=false;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)});
  async function loadCalendar(){
    if(ready)return true;if(loading)return loading;
    loading=(async()=>{try{for(const f of files)await loadScript(f);ready=true;return true}catch(e){loading=null;console.warn("Memo: chargement calendrier différé impossible",e);return false}})();
    return loading;
  }
  const btn=document.getElementById("calendarBtn");
  if(btn)btn.addEventListener("click",async e=>{
    if(ready||replay)return;
    e.preventDefault();e.stopImmediatePropagation();
    const ok=await loadCalendar();
    if(ok){replay=true;btn.click();replay=false}
  },true);
  /* Sur iPad installé, aucun préchargement : le démarrage reste minimal. */
  if(!(standalone&&appleTablet)){
    const warm=()=>loadCalendar();
    if("requestIdleCallback" in window)requestIdleCallback(warm,{timeout:3500});
    else setTimeout(warm,2200);
  }
  window.memoLoadCalendarFeatures=loadCalendar;
})();