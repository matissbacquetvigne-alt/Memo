(()=>{
  const list=document.getElementById("agendaList"),grid=document.getElementById("calendarGrid");
  if(!list||!grid)return;

  const style=document.createElement("style");
  style.textContent=`
    .debtSection{margin:0 0 12px;padding:11px 12px;border:1px solid rgba(239,91,103,.28);border-radius:14px;background:rgba(239,91,103,.055)}
    .debtSectionHead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}.debtSectionHead span{font-size:10px;font-weight:800;letter-spacing:.09em;color:#ef5b67}.debtSectionHead small{font-size:10px;color:var(--muted)}
    .debtItems{display:grid;gap:8px}.agendaItem.debtItem{border-left:3px solid #ef5b67;background:linear-gradient(90deg,rgba(239,91,103,.09),transparent 48%)}.agendaItem.debtItem .agendaCheck{border-color:#ef5b67}.debtBadge{display:inline-flex;align-items:center;padding:3px 7px;border-radius:999px;background:rgba(239,91,103,.12);color:#ef5b67!important;font-size:10px;font-weight:800}.debtOrigin{color:var(--muted)!important;font-size:10px}.debtCarry{width:31px;height:31px;display:grid;place-items:center;color:#ef5b67;font-size:15px}.calendarDay .taskDots i.debtDot{background:#ef5b67!important;box-shadow:0 0 0 2px rgba(239,91,103,.15)}
  `;
  document.head.appendChild(style);

  const pad=n=>String(n).padStart(2,"0"),todayKey=()=>{const d=new Date();return`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
  const durationLabel=min=>{min=Number(min)||0;if(!min)return"";if(min<60)return min+" min";const h=Math.floor(min/60),m=min%60;return m?`${h} h ${m} min`:`${h} h`};
  const dateLabel=s=>{const [y,m,d]=String(s).split("-").map(Number);return new Intl.DateTimeFormat("fr-FR",{weekday:"short",day:"numeric",month:"short"}).format(new Date(y,m-1,d)).replace(".","")};
  const eligible=t=>t&&t.date&&t.date<todayKey()&&!t.done&&!t.debtPaid&&(Number(t.duration)>0||!!t.time);
  const debts=()=>Array.isArray(db?.planner)?db.planner.filter(eligible).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||"99:99").localeCompare(b.time||"99:99")):[];
  window.memoOutstandingDebts=debts;

  function renderDebt(){
    document.getElementById("memoDebtSection")?.remove();
    grid.querySelectorAll(".debtDot").forEach(x=>x.remove());
    const selected=typeof window.memoCalendarSelected==="function"?window.memoCalendarSelected():null;
    if(selected!==todayKey())return;
    const items=debts();if(!items.length)return;
    const section=document.createElement("div");section.id="memoDebtSection";section.className="debtSection";
    section.innerHTML=`<div class="debtSectionHead"><span>DETTE À RATTRAPER</span><small>${items.length} tâche${items.length>1?"s":""}</small></div><div class="debtItems">${items.map(t=>{const dur=durationLabel(t.duration);return`<div class="agendaItem debtItem" data-debt-id="${t.id}"><button type="button" class="agendaCheck" data-debt-check="${t.id}" aria-label="Dette remboursée"></button><div class="agendaText"><div class="agendaMeta"><small class="debtBadge">↗ Dette</small><small class="debtOrigin">prévue ${dateLabel(t.date)}</small>${t.time?`<small>${t.time}</small>`:""}${dur?`<small class="durationBadge">◷ ${dur}</small>`:""}</div><b>${esc(t.title||"")}</b></div><span class="debtCarry" title="À rattraper">↗</span></div>`}).join("")}</div>`;
    list.insertAdjacentElement("afterbegin",section);
    const day=grid.querySelector(`.calendarDay[data-date="${todayKey()}"]`),dots=day?.querySelector(".taskDots"),count=day?.querySelector(".taskCount");
    if(day){let holder=dots;if(!holder){holder=document.createElement("span");holder.className="taskDots";day.appendChild(holder)}items.slice(0,Math.max(0,3-holder.children.length)).forEach(()=>{const dot=document.createElement("i");dot.className="debtDot";holder.appendChild(dot)});if(count)count.textContent=String((Number(count.textContent)||0)+items.length);else{const c=document.createElement("span");c.className="taskCount";c.textContent=String(items.length);day.appendChild(c)}day.classList.add("dayPending")}
  }

  list.addEventListener("click",e=>{const b=e.target.closest("[data-debt-check]");if(!b)return;e.preventDefault();e.stopImmediatePropagation();const t=Array.isArray(db?.planner)?db.planner.find(x=>String(x.id)===b.dataset.debtCheck):null;if(!t)return;t.debtPaid=true;t.debtPaidAt=Date.now();save();if(typeof window.memoCalendarRefresh==="function")window.memoCalendarRefresh();else renderDebt()},true);
  window.addEventListener("memo:calendar-render",()=>requestAnimationFrame(renderDebt));
  requestAnimationFrame(renderDebt);
})();