(()=>{
  const calendarBtn=document.getElementById("calendarBtn"),calendarView=document.getElementById("calendar"),grid=document.getElementById("calendarGrid"),monthTitle=document.getElementById("calendarMonth"),dayTitle=document.getElementById("agendaDate"),agendaList=document.getElementById("agendaList"),taskInput=document.getElementById("agendaTask"),timeInput=document.getElementById("agendaTime");
  if(!calendarBtn||!calendarView)return;

  const style=document.createElement("style");
  style.textContent=`
    .headerActions{display:flex;align-items:center;gap:9px}.headerActions .iconButton{display:grid;place-items:center}.headerActions svg{width:20px;height:20px;stroke:currentColor}
    #calendar{padding-bottom:40px}.calendarTop{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin:10px 0 22px}.calendarTop h2{margin:4px 0 0}.calendarToday{white-space:nowrap}
    .plannerLayout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(320px,.75fr);gap:18px;align-items:start}
    .calendarPanel,.agendaPanel{background:var(--panel);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow)}
    .calendarPanel{padding:20px}.calendarNav{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}.calendarNav h3{font-size:20px;text-transform:capitalize}.calendarNavBtns{display:flex;gap:7px}.calendarNavBtns button{width:40px;height:40px;padding:0;font-size:20px}
    .calendarWeek,.calendarGrid{display:grid;grid-template-columns:repeat(7,1fr);gap:7px}.calendarWeek{margin-bottom:7px}.calendarWeek span{text-align:center;color:var(--muted);font-size:11px;font-weight:700;text-transform:uppercase;padding:5px}
    .calendarDay{position:relative;min-height:72px;padding:9px;border:1px solid transparent;border-radius:14px;background:var(--bg);color:var(--text);font-weight:600;text-align:left;transition:.15s ease}.calendarDay:hover{border-color:#bdb6ff;background:var(--accent-soft)}.calendarDay.outside{opacity:.35}.calendarDay.today{box-shadow:inset 0 0 0 2px var(--accent)}.calendarDay.selected{background:var(--accent);color:#fff;border-color:var(--accent)}.calendarDay .dayNumber{font-size:13px}.calendarDay .taskDots{position:absolute;left:9px;bottom:9px;display:flex;gap:4px}.calendarDay .taskDots i{width:6px;height:6px;border-radius:50%;background:var(--accent)}.calendarDay.selected .taskDots i{background:#fff}.calendarDay .taskCount{position:absolute;right:8px;bottom:7px;font-size:10px;color:var(--muted)}.calendarDay.selected .taskCount{color:#fff}
    .agendaPanel{padding:20px;position:sticky;top:18px}.agendaHead{margin-bottom:15px}.agendaHead .eyebrow{display:block;margin-bottom:4px}.agendaHead h3{font-size:22px}.agendaAdd{display:grid;grid-template-columns:1fr 105px auto;gap:8px;margin-bottom:18px}.agendaAdd input{min-width:0}.agendaAdd button{padding:12px 14px}
    .agendaList{display:grid;gap:9px}.agendaEmpty{padding:30px 12px;text-align:center;color:var(--muted);border:1px dashed var(--line);border-radius:15px;font-size:13px}.agendaItem{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;padding:12px 13px;border:1px solid var(--line);border-radius:14px;background:var(--bg)}.agendaCheck{width:22px;height:22px;border:2px solid #b7bac7;border-radius:7px;padding:0;background:transparent;display:grid;place-items:center;color:#fff;font-size:13px}.agendaItem.done .agendaCheck{background:#35b976;border-color:#35b976}.agendaText{min-width:0}.agendaText b{display:block;font-size:14px;overflow-wrap:anywhere}.agendaText small{color:var(--accent);font-weight:700}.agendaItem.done .agendaText b{text-decoration:line-through;color:var(--muted)}.agendaDelete{width:31px;height:31px;padding:0;border-radius:9px;color:var(--muted);background:transparent}.agendaDelete:hover{background:#ffe9e9;color:#b73f3f}
    @media(max-width:820px){.plannerLayout{grid-template-columns:1fr}.agendaPanel{position:static}.calendarDay{min-height:62px}.calendarTop{align-items:center}}
    @media(max-width:650px){#calendar{transform:none!important}.calendarTop{align-items:flex-start;flex-direction:column;margin-top:8px}.calendarPanel,.agendaPanel{padding:14px}.calendarWeek,.calendarGrid{gap:4px}.calendarDay{min-height:51px;padding:7px;border-radius:11px}.calendarDay .taskDots{left:7px;bottom:7px}.calendarDay .taskCount{display:none}.agendaAdd{grid-template-columns:1fr 92px}.agendaAdd button{grid-column:1/-1}.calendarWeek span{font-size:9px;padding:3px}}
  `;
  document.head.appendChild(style);

  if(!Array.isArray(db.planner))db.planner=[];
  const pad=n=>String(n).padStart(2,"0"),key=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parseKey=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
  let selected=key(new Date()),cursor=new Date();cursor.setDate(1);

  function prettyDay(s){return new Intl.DateTimeFormat("fr-FR",{weekday:"long",day:"numeric",month:"long"}).format(parseKey(s)).replace(/^./,c=>c.toUpperCase())}
  function monthName(d){return new Intl.DateTimeFormat("fr-FR",{month:"long",year:"numeric"}).format(d).replace(/^./,c=>c.toUpperCase())}
  function tasksFor(date){return db.planner.filter(t=>t.date===date).sort((a,b)=>(a.time||"99:99").localeCompare(b.time||"99:99")||a.title.localeCompare(b.title,"fr"))}

  function render(){
    if(!Array.isArray(db.planner))db.planner=[];
    monthTitle.textContent=monthName(cursor);dayTitle.textContent=prettyDay(selected);
    const y=cursor.getFullYear(),m=cursor.getMonth(),first=new Date(y,m,1),offset=(first.getDay()+6)%7,start=new Date(y,m,1-offset),today=key(new Date());
    let html="";
    for(let i=0;i<42;i++){
      const d=new Date(start);d.setDate(start.getDate()+i);const k=key(d),tasks=tasksFor(k),outside=d.getMonth()!==m;
      html+=`<button type="button" class="calendarDay${outside?" outside":""}${k===today?" today":""}${k===selected?" selected":""}" data-date="${k}"><span class="dayNumber">${d.getDate()}</span>${tasks.length?`<span class="taskDots">${tasks.slice(0,3).map(()=>"<i></i>").join("")}</span><span class="taskCount">${tasks.length}</span>`:""}</button>`;
    }
    grid.innerHTML=html;
    const tasks=tasksFor(selected);
    agendaList.innerHTML=tasks.length?tasks.map(t=>`<div class="agendaItem${t.done?" done":""}" data-task="${t.id}"><button type="button" class="agendaCheck" data-check="${t.id}" aria-label="${t.done?"Rouvrir":"Terminer"}">${t.done?"✓":""}</button><div class="agendaText">${t.time?`<small>${t.time}</small>`:""}<b>${esc(t.title)}</b></div><button type="button" class="agendaDelete" data-delete-task="${t.id}" aria-label="Supprimer">×</button></div>`).join(""):`<div class="agendaEmpty">Rien de prévu pour cette journée.<br>Ajoute une tâche pour organiser ta journée.</div>`;
  }

  function openCalendar(){view("calendar");const d=parseKey(selected);cursor=new Date(d.getFullYear(),d.getMonth(),1);render()}
  calendarBtn.onclick=openCalendar;
  document.getElementById("calendarBack").onclick=home;
  document.getElementById("calendarToday").onclick=()=>{const d=new Date();selected=key(d);cursor=new Date(d.getFullYear(),d.getMonth(),1);render()};
  document.getElementById("calendarPrev").onclick=()=>{cursor=new Date(cursor.getFullYear(),cursor.getMonth()-1,1);render()};
  document.getElementById("calendarNext").onclick=()=>{cursor=new Date(cursor.getFullYear(),cursor.getMonth()+1,1);render()};
  grid.onclick=e=>{const b=e.target.closest("[data-date]");if(!b)return;selected=b.dataset.date;const d=parseKey(selected);if(d.getMonth()!==cursor.getMonth()||d.getFullYear()!==cursor.getFullYear())cursor=new Date(d.getFullYear(),d.getMonth(),1);render()};

  function addTask(){const title=taskInput.value.trim();if(!title)return;db.planner.push({id:uid(),date:selected,time:timeInput.value,title,done:false});taskInput.value="";timeInput.value="";save();render();taskInput.focus()}
  document.getElementById("agendaAdd").onclick=addTask;
  taskInput.addEventListener("keydown",e=>{if(e.key==="Enter")addTask()});
  agendaList.onclick=e=>{
    const check=e.target.closest("[data-check]"),del=e.target.closest("[data-delete-task]");
    if(check){const t=db.planner.find(x=>String(x.id)===check.dataset.check);if(t){t.done=!t.done;save();render()}return}
    if(del){db.planner=db.planner.filter(x=>String(x.id)!==del.dataset.deleteTask);save();render()}
  };
})();