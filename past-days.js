(()=>{
  const grid=document.getElementById("calendarGrid"),list=document.getElementById("agendaList"),add=document.querySelector(".agendaAdd");
  if(!grid||!list||!add)return;

  const style=document.createElement("style");
  style.textContent=`
    .calendarDay.pastDay .taskDots,.calendarDay.pastDay .taskCount{display:none!important}
    .calendarDay.pastDay{opacity:.48}
    .calendarDay.pastDay.selected{opacity:.72}
    .agendaPast{padding:28px 14px;text-align:center;color:var(--muted);border:1px dashed var(--line);border-radius:15px;font-size:13px;line-height:1.55}
    .agendaPast b{display:block;color:var(--text);margin-bottom:4px;font-size:14px}
  `;
  document.head.appendChild(style);

  const pad=n=>String(n).padStart(2,"0");
  const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
  const isPast=date=>date&&date<todayKey();
  let applying=false;

  function apply(){
    if(applying)return;applying=true;
    const today=todayKey();
    grid.querySelectorAll(".calendarDay[data-date]").forEach(day=>{
      const past=day.dataset.date<today;
      day.classList.toggle("pastDay",past);
      if(past){day.querySelector(".taskDots")?.remove();day.querySelector(".taskCount")?.remove();day.classList.remove("dayPending","dayDone")}
    });
    const selected=typeof window.memoCalendarSelected==="function"?window.memoCalendarSelected():null;
    if(isPast(selected)){
      add.style.display="none";
      if(!list.querySelector(".agendaPast"))list.innerHTML=`<div class="agendaPast"><b>Journée passée</b>Les tâches de cette journée ne sont plus affichées.</div>`;
    }else add.style.display="grid";
    applying=false;
  }

  let queued=false;
  const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(queue).observe(grid,{childList:true,subtree:true});
  new MutationObserver(queue).observe(list,{childList:true,subtree:true});
  window.addEventListener("memo:calendar-render",queue);
  queue();
})();