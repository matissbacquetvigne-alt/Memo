(()=>{
  const subject=document.getElementById('subject');
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const chapterLines=[
    "Alors, quel chapitre on avance aujourd’hui ?",
    "On avance sur quoi aujourd’hui ?",
    "Choisis ton chapitre, je révise avec toi.",
    "Un chapitre à la fois. Lequel on attaque ?"
  ];
  const runningLines=[
    "Allez, toujours plus !",
    "Garde le rythme, tu avances !",
    "Concentre-toi, je reste avec toi.",
    "Encore un peu, ça travaille bien !"
  ];

  const owl=()=>`<svg class="memoOwlSvg" viewBox="0 0 120 120" role="img" aria-label="Hibou Memo">
    <path d="M27 39 25 14l22 17c8-4 18-4 26 0l22-17-2 25c8 9 13 21 13 34 0 27-20 43-46 43S14 100 14 73c0-13 5-25 13-34Z" fill="#6d5dfc"/>
    <path d="M22 68c-7 7-9 20-5 29 4 8 12 13 22 14-7-12-9-27-5-42-5-4-9-4-12-1Zm76 0c7 7 9 20 5 29-4 8-12 13-22 14 7-12 9-27 5-42 5-4 9-4 12-1Z" fill="#5546db"/>
    <path d="M36 45c7-8 17-10 24-3 7-7 17-5 24 3 8 9 4 27-8 33-7 4-13 1-16-3-3 4-9 7-16 3-12-6-16-24-8-33Z" fill="#f5f2ff"/>
    <circle cx="45" cy="57" r="12" fill="#fff"/><circle cx="75" cy="57" r="12" fill="#fff"/>
    <circle cx="46" cy="58" r="5.5" fill="#242137"/><circle cx="74" cy="58" r="5.5" fill="#242137"/>
    <circle cx="48" cy="55" r="1.8" fill="#fff"/><circle cx="76" cy="55" r="1.8" fill="#fff"/>
    <path d="m60 64-7 7 7 5 7-5-7-7Z" fill="#f2a93b"/>
    <path d="M45 88c8 6 22 6 30 0" fill="none" stroke="#9e96ff" stroke-width="4" stroke-linecap="round"/>
    <path d="M47 112v5m26-5v5m-32 0h12m14 0h12" stroke="#f2a93b" stroke-width="4" stroke-linecap="round"/>
  </svg>`;

  if(!document.getElementById('memoOwlStyle')){
    const style=document.createElement('style');style.id='memoOwlStyle';
    style.textContent=`
      .memoOwlChapter{position:relative;display:flex;align-items:center;gap:22px;width:min(760px,100%);min-height:122px;box-sizing:border-box;margin:24px 0 10px;padding:18px 25px 18px 20px;border:1px solid color-mix(in srgb,var(--accent) 24%,var(--line));border-radius:24px;background:linear-gradient(135deg,color-mix(in srgb,var(--accent-soft) 68%,var(--panel)),var(--panel));box-shadow:0 12px 32px rgba(36,34,70,.07);overflow:hidden}
      .memoOwlChapter:after{content:"";position:absolute;width:150px;height:150px;border-radius:50%;right:-65px;top:-80px;background:color-mix(in srgb,var(--accent) 7%,transparent);pointer-events:none}
      .memoOwlChapter .memoOwlMascot{width:92px;height:92px;flex:0 0 92px;display:grid;place-items:center;filter:drop-shadow(0 8px 10px rgba(53,44,132,.15))}.memoOwlSvg{display:block;width:100%;height:100%;overflow:visible}
      .memoOwlChapterText{min-width:0}.memoOwlChapterText small{display:block;margin-bottom:7px;color:var(--accent);font-size:9px;font-weight:900;letter-spacing:.13em}.memoOwlChapterText p{margin:0;color:var(--text);font-size:clamp(15px,2vw,18px);font-weight:800;line-height:1.35;letter-spacing:-.01em}.memoOwlChapterText span{display:block;margin-top:7px;color:var(--muted);font-size:10px;font-weight:600}
      .memoOwlTimer{display:flex;align-items:center;gap:11px;margin:13px 0 -4px;padding:10px 11px;border-radius:14px;background:var(--accent-soft);border:1px solid color-mix(in srgb,var(--accent) 20%,var(--line))}.memoOwlTimer .memoOwlMascot{width:43px;height:43px;flex:0 0 43px;filter:drop-shadow(0 4px 6px rgba(53,44,132,.12))}.memoOwlTimer p{margin:0;font-size:10px;font-weight:800;line-height:1.4;color:var(--text)}
      .workTimerPanel.running .memoOwlTimer{border-color:color-mix(in srgb,var(--accent) 38%,var(--line))}.workTimerPanel.finished .memoOwlTimer{background:rgba(54,184,121,.1);border-color:rgba(54,184,121,.25)}
      @media(max-width:650px){.memoOwlChapter{min-height:104px;margin-top:18px;padding:14px 16px;gap:14px;border-radius:20px}.memoOwlChapter .memoOwlMascot{width:72px;height:72px;flex-basis:72px}.memoOwlChapterText p{font-size:14px}.memoOwlChapterText span{font-size:9px}}
    `;document.head.appendChild(style)
  }

  if(subject&&!document.getElementById('memoOwlChapter')){
    const box=document.createElement('div');box.id='memoOwlChapter';box.className='memoOwlChapter';
    box.innerHTML=`<div class="memoOwlMascot">${owl()}</div><div class="memoOwlChapterText"><small>TON COMPAGNON DE RÉVISION</small><p id="memoOwlChapterText"></p><span>On avance ensemble, à ton rythme.</span></div>`;
    const title=subject.querySelector('.title');if(title)title.insertAdjacentElement('afterend',box);else subject.prepend(box);
    const sayChapter=()=>{const t=document.getElementById('memoOwlChapterText');if(t)t.textContent=pick(chapterLines)};
    sayChapter();new MutationObserver(()=>{if(subject.classList.contains('on'))sayChapter()}).observe(subject,{attributes:true,attributeFilter:['class']})
  }

  function setupTimer(){
    const timer=document.getElementById('workTimerPanel');if(!timer||document.getElementById('memoOwlTimer'))return !!timer;
    const box=document.createElement('div');box.id='memoOwlTimer';box.className='memoOwlTimer';
    box.innerHTML=`<div class="memoOwlMascot">${owl()}</div><p id="memoOwlTimerText">C’est le moment de s’organiser.</p>`;
    const state=document.getElementById('workTimerState');if(state)state.insertAdjacentElement('afterend',box);else timer.appendChild(box);
    const text=box.querySelector('p');let lastRunning='';
    const update=()=>{const label=(state?.textContent||'').toLowerCase();if(timer.classList.contains('finished'))text.textContent='Bravo, session terminée ! Tu peux être fier de toi.';else if(timer.classList.contains('running')){if(!lastRunning)lastRunning=pick(runningLines);text.textContent=lastRunning}else if(label.includes('pause')){lastRunning='';text.textContent='Une petite pause, puis on repart !'}else{lastRunning='';text.textContent='C’est le moment de s’organiser. Combien de temps on travaille ?'}};
    new MutationObserver(update).observe(timer,{attributes:true,attributeFilter:['class']});if(state)new MutationObserver(update).observe(state,{childList:true,characterData:true,subtree:true});setInterval(()=>{if(timer.classList.contains('running')){lastRunning=pick(runningLines);update()}},180000);update();return true
  }
  if(!setupTimer()){let tries=0;const wait=setInterval(()=>{tries++;if(setupTimer()||tries>20)clearInterval(wait)},100)}
})();