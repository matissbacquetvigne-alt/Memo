(()=>{
  const grid=document.getElementById("calendarGrid"),list=document.getElementById("agendaList"),calendarBtn=document.getElementById("calendarBtn"),headerActions=document.querySelector(".headerActions");
  if(!grid||!list)return;

  const style=document.createElement("style");
  style.textContent=`
    .agendaItem:not(.done){border-left:3px solid #ef5b67;background:linear-gradient(90deg,rgba(239,91,103,.07),transparent 42%)}
    .agendaItem.done{border-left:3px solid #35b976;background:linear-gradient(90deg,rgba(53,185,118,.08),transparent 42%)}
    .agendaItem:not(.done) .agendaCheck{border-color:#ef5b67}.agendaItem.done .agendaCheck{background:#35b976;border-color:#35b976}.agendaItem.done .agendaText b{color:#69c995;text-decoration:line-through;text-decoration-thickness:1px}
    .calendarDay .taskDots i.taskPending{background:#ef5b67!important;box-shadow:0 0 0 2px rgba(239,91,103,.12)}.calendarDay .taskDots i.taskDone{background:#35b976!important;box-shadow:0 0 0 2px rgba(53,185,118,.12)}.calendarDay.selected .taskDots i.taskPending,.calendarDay.selected .taskDots i.taskDone{box-shadow:0 0 0 1px rgba(255,255,255,.35)}.calendarDay.dayPending .taskCount{color:#ef5b67;font-weight:800}.calendarDay.dayDone .taskCount{color:#35b976;font-weight:800}.calendarDay.selected .taskCount{color:#fff}
    .todayTaskNotice{height:42px;max-width:260px;display:none;align-items:center;gap:9px;padding:0 12px 0 9px;border:1px solid rgba(239,91,103,.28);border-radius:14px;background:rgba(239,91,103,.08);color:var(--text);cursor:pointer;text-align:left;min-width:0;transition:.16s ease}.todayTaskNotice.on{display:flex}.todayTaskNotice:hover{background:rgba(239,91,103,.13);border-color:rgba(239,91,103,.48)}.todayTaskBell{position:relative;width:25px;height:25px;display:grid;place-items:center;flex:0 0 auto;font-size:15px}.todayTaskBell:after{content:"";position:absolute;right:1px;top:1px;width:7px;height:7px;border-radius:50%;background:#ef5b67;box-shadow:0 0 0 2px var(--panel)}.todayTaskWords{min-width:0;display:grid;gap:1px}.todayTaskWords small{font-size:8px;font-weight:900;letter-spacing:.08em;color:#d84d59;text-transform:uppercase}.todayTaskWords b{display:block;max-width:175px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}.todayTaskMore{flex:0 0 auto;min-width:22px;height:22px;display:grid;place-items:center;border-radius:999px;background:#ef5b67;color:#fff;font-size:9px;font-weight:900}
    .calendarTaskBadge{position:absolute;right:-4px;top:-4px;min-width:17px;height:17px;padding:0 4px;display:none;place-items:center;border-radius:999px;background:#ef5b67;color:#fff;border:2px solid var(--panel);font-size:8px;font-weight:900;box-sizing:border-box}.calendarTaskBadge.on{display:grid}#calendarBtn{position:relative}
    @media(max-width:720px){.todayTaskNotice{max-width:170px;padding-right:9px}.todayTaskWords b{max-width:88px}.todayTaskWords small{display:none}}
    @media(max-width:470px){.todayTaskNotice{max-width:125px;height:40px}.todayTaskWords b{max-width:58px;font-size:11px}.todayTaskMore{display:none}.todayTaskBell{width:21px}}
  `;
  document.head.appendChild(style);

  const pad=n=>String(n).padStart(2,"0"),dateKey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  function tasksFor(date){
    const fixed=Array.isArray(db?.planner)?db.planner.filter(t=>t.date===date):[];
    let recurring=[];
    try{if(typeof window.memoRoutineTasksFor==="function")recurring=window.memoRoutineTasksFor(date)||[]}catch{}
    return fixed.concat(recurring).sort((a,b)=>(a.time||"99:99").localeCompare(b.time||"99:99")||(a.title||"").localeCompare(b.title||"","fr"));
  }

  let notice=null,badge=null;
  if(headerActions&&calendarBtn){
    notice=document.createElement("button");notice.type="button";notice.id="todayTaskNotice";notice.className="todayTaskNotice";notice.setAttribute("aria-label","Voir les tâches à faire aujourd'hui");notice.innerHTML=`<span class="todayTaskBell">●</span><span class="todayTaskWords"><small>À faire aujourd'hui</small><b id="todayTaskTitle"></b></span><span id="todayTaskMore" class="todayTaskMore"></span>`;headerActions.insertBefore(notice,calendarBtn);
    badge=document.createElement("span");badge.className="calendarTaskBadge";calendarBtn.appendChild(badge);
  }

  function refreshTodayNotice(){
    if(!notice)return;
    const pending=tasksFor(dateKey(new Date())).filter(t=>!t.done);
    notice.classList.toggle("on",pending.length>0);
    if(badge){badge.classList.toggle("on",pending.length>0);badge.textContent=pending.length>9?"9+":String(pending.length)}
    if(!pending.length)return;
    const first=pending[0],title=document.getElementById("todayTaskTitle"),more=document.getElementById("todayTaskMore");
    if(title)title.textContent=(first.time?first.time+" · ":"")+(first.title||"Tâche");
    if(more){more.hidden=pending.length<2;more.textContent="+"+(pending.length-1)}
    notice.title=pending.map(t=>(t.time?t.time+" · ":"")+(t.title||"Tâche")).join("\n");
  }

  function paint(){
    grid.querySelectorAll(".calendarDay[data-date]").forEach(day=>{
      const tasks=tasksFor(day.dataset.date),dots=[...day.querySelectorAll(".taskDots i")];
      dots.forEach((dot,i)=>{dot.classList.remove("taskPending","taskDone");if(tasks[i])dot.classList.add(tasks[i].done?"taskDone":"taskPending")});
      day.classList.remove("dayPending","dayDone");if(tasks.length)day.classList.add(tasks.every(t=>t.done)?"dayDone":"dayPending");
    });
    refreshTodayNotice();
  }

  function openToday(){
    if(typeof view==="function")view("calendar");
    const today=dateKey(new Date()),day=grid.querySelector(`[data-date="${today}"]`);
    const todayBtn=document.getElementById("calendarToday");
    if(todayBtn)todayBtn.click();else if(day)day.click();else calendarBtn?.click();
  }
  if(notice)notice.onclick=openToday;

  let queued=false;
  function queuePaint(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;paint()})}
  new MutationObserver(queuePaint).observe(grid,{childList:true,subtree:true});new MutationObserver(queuePaint).observe(list,{childList:true,subtree:true});
  window.addEventListener("memo:calendar-render",queuePaint);window.addEventListener("focus",refreshTodayNotice);document.addEventListener("visibilitychange",()=>{if(!document.hidden)refreshTodayNotice()});
  setTimeout(refreshTodayNotice,0);setInterval(refreshTodayNotice,60000);queuePaint();
})();