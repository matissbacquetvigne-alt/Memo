(()=>{
  const grid=document.getElementById("calendarGrid"),list=document.getElementById("agendaList");
  if(!grid||!list)return;

  const style=document.createElement("style");
  style.textContent=`
    .agendaItem:not(.done){border-left:3px solid #ef5b67;background:linear-gradient(90deg,rgba(239,91,103,.07),transparent 42%)}
    .agendaItem.done{border-left:3px solid #35b976;background:linear-gradient(90deg,rgba(53,185,118,.08),transparent 42%)}
    .agendaItem:not(.done) .agendaCheck{border-color:#ef5b67}
    .agendaItem.done .agendaCheck{background:#35b976;border-color:#35b976}
    .agendaItem.done .agendaText b{color:#69c995;text-decoration:line-through;text-decoration-thickness:1px}
    .calendarDay .taskDots i.taskPending{background:#ef5b67!important;box-shadow:0 0 0 2px rgba(239,91,103,.12)}
    .calendarDay .taskDots i.taskDone{background:#35b976!important;box-shadow:0 0 0 2px rgba(53,185,118,.12)}
    .calendarDay.selected .taskDots i.taskPending,.calendarDay.selected .taskDots i.taskDone{box-shadow:0 0 0 1px rgba(255,255,255,.35)}
    .calendarDay.dayPending .taskCount{color:#ef5b67;font-weight:800}
    .calendarDay.dayDone .taskCount{color:#35b976;font-weight:800}
    .calendarDay.selected .taskCount{color:#fff}
  `;
  document.head.appendChild(style);

  function tasksFor(date){
    const fixed=Array.isArray(db?.planner)?db.planner.filter(t=>t.date===date):[];
    let recurring=[];
    try{if(typeof window.memoRoutineTasksFor==="function")recurring=window.memoRoutineTasksFor(date)||[]}catch{}
    return fixed.concat(recurring).sort((a,b)=>(a.time||"99:99").localeCompare(b.time||"99:99")||(a.title||"").localeCompare(b.title||"","fr"));
  }

  function paint(){
    grid.querySelectorAll(".calendarDay[data-date]").forEach(day=>{
      const tasks=tasksFor(day.dataset.date),dots=[...day.querySelectorAll(".taskDots i")];
      dots.forEach((dot,i)=>{
        dot.classList.remove("taskPending","taskDone");
        if(tasks[i])dot.classList.add(tasks[i].done?"taskDone":"taskPending");
      });
      day.classList.remove("dayPending","dayDone");
      if(tasks.length)day.classList.add(tasks.every(t=>t.done)?"dayDone":"dayPending");
    });
  }

  let queued=false;
  function queuePaint(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;paint()})}
  new MutationObserver(queuePaint).observe(grid,{childList:true,subtree:true});
  new MutationObserver(queuePaint).observe(list,{childList:true,subtree:true});
  window.addEventListener("memo:calendar-render",queuePaint);
  queuePaint();
})();