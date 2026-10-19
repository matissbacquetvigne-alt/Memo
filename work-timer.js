(()=>{
  const actions=document.querySelector('.headerActions');
  if(!actions||document.getElementById('workTimerBtn'))return;

  const STORE='memo-work-timer-v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return{}}};
  let state=Object.assign({duration:45*60,remaining:45*60,running:false,endAt:0,finished:false},read());
  const persist=()=>{try{localStorage.setItem(STORE,JSON.stringify(state))}catch{}};
  const clamp=n=>Math.max(5*60,Math.min(8*60*60,n));
  const remainingNow=()=>state.running?Math.max(0,Math.ceil((state.endAt-Date.now())/1000)):Math.max(0,Number(state.remaining)||0);
  const fmt=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return h?`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`};
  const durationText=s=>{const m=Math.round(s/60);return m<60?`${m} min`:`${Math.floor(m/60)} h${m%60?` ${m%60} min`:''}`};

  if(state.running&&remainingNow()<=0){state.running=false;state.remaining=0;state.finished=true;state.endAt=0;persist()}

  const btn=document.createElement('button');btn.type='button';btn.id='workTimerBtn';btn.className='iconButton soft workTimerBtn';btn.title='Chronomètre de travail';btn.setAttribute('aria-label','Chronomètre de travail');btn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2.5 1.5M9 2h6M12 2v3"></path></svg><span id="workTimerBadge" class="workTimerBadge"></span>`;
  const checklist=document.getElementById('checklistBtn'),calendar=document.getElementById('calendarBtn');
  if(checklist)checklist.insertAdjacentElement('afterend',btn);else if(calendar)calendar.insertAdjacentElement('afterend',btn);else actions.prepend(btn);

  const panel=document.createElement('aside');panel.id='workTimerPanel';panel.className='workTimerPanel';panel.setAttribute('aria-hidden','true');panel.innerHTML=`
    <div class="workTimerHead"><div><span class="eyebrow">SESSION DE TRAVAIL</span><b>Chronomètre</b></div><button type="button" id="workTimerHide" class="workTimerHide" aria-label="Masquer">×</button></div>
    <div class="workTimerClock" id="workTimerClock">45:00</div>
    <div class="workTimerState" id="workTimerState">Prêt à travailler</div>
    <div class="workTimerAdjust"><button type="button" id="workTimerMinus" aria-label="Retirer 5 minutes">−</button><span id="workTimerDuration">45 min</span><button type="button" id="workTimerPlus" aria-label="Ajouter 5 minutes">＋</button></div>
    <div class="workTimerPresets"><button type="button" data-work-min="25">25 min</button><button type="button" data-work-min="45">45 min</button><button type="button" data-work-min="60">1 h</button><button type="button" data-work-min="90">1 h 30</button></div>
    <div class="workTimerActions"><button type="button" id="workTimerReset" class="soft">Réinitialiser</button><button type="button" id="workTimerStart" class="primary">▶ Démarrer</button></div>
    <small class="workTimerHint">Tu peux masquer cet encadré : le temps continue de s'écouler.</small>`;
  document.body.appendChild(panel);

  const style=document.createElement('style');style.textContent=`
    .workTimerBtn{position:relative}.workTimerBtn svg{width:20px;height:20px;stroke:currentColor}.workTimerBadge{position:absolute;right:-5px;top:-5px;display:none;min-width:18px;height:18px;padding:0 4px;box-sizing:border-box;place-items:center;border-radius:999px;background:var(--accent);color:#fff;border:2px solid var(--panel);font-size:8px;font-weight:900}.workTimerBtn.running .workTimerBadge,.workTimerBtn.finished .workTimerBadge{display:grid}.workTimerBtn.finished{box-shadow:0 0 0 3px rgba(54,184,121,.16)}.workTimerBtn.finished .workTimerBadge{background:#36b879}
    .workTimerPanel{position:fixed;z-index:80;right:max(18px,env(safe-area-inset-right));top:82px;width:min(330px,calc(100vw - 28px));box-sizing:border-box;padding:18px;border:1px solid var(--line);border-radius:20px;background:color-mix(in srgb,var(--panel) 96%,transparent);box-shadow:0 18px 55px rgba(28,25,55,.18);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);opacity:0;transform:translateY(-8px) scale(.98);pointer-events:none;transition:opacity .16s ease,transform .16s ease}.workTimerPanel.on{opacity:1;transform:none;pointer-events:auto}.workTimerHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.workTimerHead .eyebrow{display:block;font-size:9px;margin-bottom:3px}.workTimerHead b{font-size:17px}.workTimerHide{width:31px;height:31px;padding:0;border:0;border-radius:10px;background:var(--bg);color:var(--muted);font-size:18px}.workTimerClock{text-align:center;font-variant-numeric:tabular-nums;font-size:clamp(42px,8vw,58px);font-weight:800;letter-spacing:-.04em;margin:24px 0 2px}.workTimerState{text-align:center;min-height:18px;color:var(--muted);font-size:11px;font-weight:700}.workTimerPanel.finished .workTimerClock,.workTimerPanel.finished .workTimerState{color:#249568}.workTimerAdjust{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;height:44px;margin-top:19px;border:1px solid var(--line);border-radius:13px;overflow:hidden;background:var(--bg)}.workTimerAdjust button{height:100%;border:0;border-radius:0;background:transparent;color:var(--accent);font-size:18px}.workTimerAdjust button:hover{background:var(--accent-soft)}.workTimerAdjust span{text-align:center;font-size:12px;font-weight:800}.workTimerPresets{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}.workTimerPresets button{padding:8px 4px;border:1px solid var(--line);border-radius:10px;background:transparent;color:var(--muted);font-size:9px;font-weight:800}.workTimerPresets button:hover{color:var(--accent);border-color:var(--accent)}.workTimerActions{display:grid;grid-template-columns:1fr 1.15fr;gap:8px;margin-top:17px}.workTimerActions button{height:43px;padding:0 10px}.workTimerHint{display:block;text-align:center;color:var(--muted);font-size:9px;line-height:1.4;margin-top:11px}.workTimerPanel.running .workTimerAdjust,.workTimerPanel.running .workTimerPresets{opacity:.45;pointer-events:none}
    @media(max-width:650px){.workTimerPanel{top:72px;right:14px}.workTimerClock{font-size:48px}}
  `;document.head.appendChild(style);

  const clock=document.getElementById('workTimerClock'),label=document.getElementById('workTimerState'),duration=document.getElementById('workTimerDuration'),start=document.getElementById('workTimerStart'),badge=document.getElementById('workTimerBadge');
  function draw(){
    let r=remainingNow();
    if(state.running&&r<=0){state.running=false;state.remaining=0;state.endAt=0;state.finished=true;persist();r=0}
    clock.textContent=fmt(r);duration.textContent=durationText(state.duration);panel.classList.toggle('running',state.running);panel.classList.toggle('finished',state.finished);btn.classList.toggle('running',state.running);btn.classList.toggle('finished',state.finished);
    if(state.finished){label.textContent='Session terminée ✓';start.textContent='↻ Recommencer';badge.textContent='✓'}
    else if(state.running){label.textContent='Session en cours';start.textContent='Ⅱ Pause';badge.textContent=Math.max(1,Math.ceil(r/60))}
    else if(r<state.duration){label.textContent='En pause';start.textContent='▶ Reprendre';badge.textContent=''}
    else{label.textContent='Prêt à travailler';start.textContent='▶ Démarrer';badge.textContent=''}
  }
  function setDuration(sec){if(state.running)return;state.duration=clamp(sec);state.remaining=state.duration;state.finished=false;state.endAt=0;persist();draw()}
  function toggle(){
    if(state.finished){state.remaining=state.duration;state.finished=false}
    if(state.running){state.remaining=remainingNow();state.running=false;state.endAt=0}
    else{if(state.remaining<=0)state.remaining=state.duration;state.running=true;state.endAt=Date.now()+state.remaining*1000}
    persist();draw()
  }
  function reset(){state.running=false;state.finished=false;state.endAt=0;state.remaining=state.duration;persist();draw()}
  function togglePanel(force){const on=typeof force==='boolean'?force:!panel.classList.contains('on');panel.classList.toggle('on',on);panel.setAttribute('aria-hidden',String(!on))}

  btn.onclick=()=>togglePanel();document.getElementById('workTimerHide').onclick=()=>togglePanel(false);start.onclick=toggle;document.getElementById('workTimerReset').onclick=reset;
  document.getElementById('workTimerMinus').onclick=()=>setDuration(state.duration-5*60);document.getElementById('workTimerPlus').onclick=()=>setDuration(state.duration+5*60);
  panel.querySelector('.workTimerPresets').onclick=e=>{const b=e.target.closest('[data-work-min]');if(b)setDuration(Number(b.dataset.workMin)*60)};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('on'))togglePanel(false)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)draw()});
  setInterval(draw,1000);draw();
})();