(()=>{
  const files=["calendar.js","time-picker.js","routine-planner.js","task-status-colors.js","past-days.js","debt-manager.js"];
  let loading=null,ready=false,replay=false;
  const loadScript=src=>new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.async=false;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)});
  async function loadCalendar(){
    if(ready)return true;if(loading)return loading;
    loading=(async()=>{try{for(const f of files)await loadScript(f);ready=true;return true}catch(e){console.warn("Memo: chargement calendrier différé impossible",e);return false}})();
    return loading;
  }
  const btn=document.getElementById("calendarBtn");
  if(btn)btn.addEventListener("click",async e=>{
    if(ready||replay)return;
    e.preventDefault();e.stopImmediatePropagation();
    const ok=await loadCalendar();
    if(ok){replay=true;btn.click();replay=false}
  },true);
  const warm=()=>loadCalendar();
  if("requestIdleCallback" in window)requestIdleCallback(warm,{timeout:2500});
  else setTimeout(warm,1400);
  window.memoLoadCalendarFeatures=loadCalendar;
})();