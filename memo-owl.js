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

  if(!document.getElementById('memoOwlStyle')){
    const style=document.createElement('style');style.id='memoOwlStyle';
    style.textContent=`
      .memoOwlChapter{display:flex;align-items:center;gap:12px;width:max-content;max-width:min(560px,100%);box-sizing:border-box;margin:20px 0 4px;padding:10px 14px 10px 10px;border:1px solid var(--line);border-radius:16px;background:color-mix(in srgb,var(--panel) 94%,transparent);box-shadow:0 7px 22px rgba(36,34,70,.055)}
      .memoOwlFace{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:12px;background:var(--accent-soft);font-size:22px;line-height:1}.memoOwlChapter p{margin:0;color:var(--text);font-size:12px;font-weight:750;line-height:1.35}.memoOwlChapter small{display:block;margin-top:2px;color:var(--muted);font-size:8px;font-weight:800;letter-spacing:.08em}
      .memoOwlTimer{display:flex;align-items:center;gap:9px;margin:13px 0 -4px;padding:9px 10px;border-radius:13px;background:var(--accent-soft);border:1px solid color-mix(in srgb,var(--accent) 20%,var(--line))}.memoOwlTimer .memoOwlFace{width:31px;height:31px;flex-basis:31px;border-radius:9px;background:var(--panel);font-size:18px}.memoOwlTimer p{margin:0;font-size:10px;font-weight:800;line-height:1.35;color:var(--text)}
      .workTimerPanel.running .memoOwlTimer{border-color:color-mix(in srgb,var(--accent) 38%,var(--line))}.workTimerPanel.finished .memoOwlTimer{background:rgba(54,184,121,.1);border-color:rgba(54,184,121,.25)}
      @media(max-width:650px){.memoOwlChapter{margin-top:15px}.memoOwlChapter p{font-size:11px}}
    `;document.head.appendChild(style)
  }

  if(subject&&!document.getElementById('memoOwlChapter')){
    const box=document.createElement('div');box.id='memoOwlChapter';box.className='memoOwlChapter';
    box.innerHTML=`<span class="memoOwlFace" aria-hidden="true">🦉</span><div><p id="memoOwlChapterText"></p><small>MEMO EST AVEC TOI</small></div>`;
    const title=subject.querySelector('.title');if(title)title.insertAdjacentElement('afterend',box);else subject.prepend(box);
    const sayChapter=()=>{const t=document.getElementById('memoOwlChapterText');if(t)t.textContent=pick(chapterLines)};
    sayChapter();new MutationObserver(()=>{if(subject.classList.contains('on'))sayChapter()}).observe(subject,{attributes:true,attributeFilter:['class']})
  }

  function setupTimer(){
    const timer=document.getElementById('workTimerPanel');if(!timer||document.getElementById('memoOwlTimer'))return !!timer;
    const box=document.createElement('div');box.id='memoOwlTimer';box.className='memoOwlTimer';
    box.innerHTML=`<span class="memoOwlFace" aria-hidden="true">🦉</span><p id="memoOwlTimerText">C’est le moment de s’organiser.</p>`;
    const state=document.getElementById('workTimerState');if(state)state.insertAdjacentElement('afterend',box);else timer.appendChild(box);
    const text=box.querySelector('p');let lastRunning='';
    const update=()=>{const label=(state?.textContent||'').toLowerCase();if(timer.classList.contains('finished'))text.textContent='Bravo, session terminée ! Tu peux être fier de toi.';else if(timer.classList.contains('running')){if(!lastRunning)lastRunning=pick(runningLines);text.textContent=lastRunning}else if(label.includes('pause')){lastRunning='';text.textContent='Une petite pause, puis on repart !'}else{lastRunning='';text.textContent='C’est le moment de s’organiser. Combien de temps on travaille ?'}};
    new MutationObserver(update).observe(timer,{attributes:true,attributeFilter:['class']});if(state)new MutationObserver(update).observe(state,{childList:true,characterData:true,subtree:true});setInterval(()=>{if(timer.classList.contains('running')){lastRunning=pick(runningLines);update()}},180000);update();return true
  }
  if(!setupTimer()){let tries=0;const wait=setInterval(()=>{tries++;if(setupTimer()||tries>20)clearInterval(wait)},100)}
})();