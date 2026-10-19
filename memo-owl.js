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

  // Exact same visual language as the owl already used on Memo's home page.
  const owl=()=>`<div class="memoClassicOwl" role="img" aria-label="Hibou Memo"><div class="memoClassicBody"></div><div class="memoClassicBelly"></div><div class="memoClassicFace"><i class="memoClassicEye l"></i><i class="memoClassicEye r"></i><i class="memoClassicBeak"></i></div><i class="memoClassicWing l"></i><i class="memoClassicWing r"></i><div class="memoClassicBook"><i></i></div></div>`;

  if(!document.getElementById('memoOwlStyle')){
    const style=document.createElement('style');style.id='memoOwlStyle';
    style.textContent=`
      .memoClassicOwl{position:relative;width:126px;height:138px}.memoClassicBody{position:absolute;left:16px;bottom:4px;width:94px;height:108px;border-radius:48%;background:linear-gradient(145deg,#b07850,#774932)}.memoClassicBelly{position:absolute;left:33px;bottom:10px;width:60px;height:69px;border-radius:50%;background:#f4ddbf}.memoClassicFace{position:absolute;left:7px;top:4px;width:112px;height:82px;border-radius:50% 50% 45% 45%;background:#bd8157}.memoClassicFace:before,.memoClassicFace:after{content:"";position:absolute;top:-10px;width:31px;height:32px;background:#9b603f;border-radius:8px 70% 8px 70%;transform:rotate(35deg)}.memoClassicFace:before{left:9px}.memoClassicFace:after{right:9px;transform:rotate(55deg)}.memoClassicEye{position:absolute;top:18px;width:45px;height:45px;border-radius:50%;background:#fff6e9;border:4px solid #e6c39c;z-index:3}.memoClassicEye.l{left:8px}.memoClassicEye.r{right:8px}.memoClassicEye:before{content:"";position:absolute;width:23px;height:23px;border-radius:50%;background:#4c2b1e;left:7px;top:7px;box-shadow:inset 0 0 0 5px #8b4d25}.memoClassicEye:after{content:"";position:absolute;width:7px;height:7px;border-radius:50%;background:white;left:13px;top:10px}.memoClassicBeak{position:absolute;z-index:5;left:49px;top:55px;border-left:7px solid transparent;border-right:7px solid transparent;border-top:14px solid #efa03e}.memoClassicWing{position:absolute;z-index:4;top:77px;width:35px;height:55px;background:#895538;border-radius:70% 30% 70% 35%}.memoClassicWing.l{left:5px;transform:rotate(12deg)}.memoClassicWing.r{right:5px;transform:scaleX(-1) rotate(12deg)}.memoClassicBook{position:absolute;z-index:7;left:22px;bottom:0;width:82px;height:42px}.memoClassicBook:before,.memoClassicBook:after{content:"";position:absolute;top:3px;width:42px;height:34px;background:#fff9e9;border:2px solid #6559a9;box-shadow:0 4px 0 #5c519b}.memoClassicBook:before{left:0;border-radius:8px 2px 4px 9px;transform:skewY(-6deg)}.memoClassicBook:after{right:0;border-radius:2px 8px 9px 4px;transform:skewY(6deg)}.memoClassicBook i{position:absolute;z-index:4;left:39px;top:4px;width:4px;height:34px;background:#d5c9ad}
      .memoOwlChapter{position:relative;display:flex;align-items:center;gap:34px;width:min(880px,100%);min-height:190px;box-sizing:border-box;margin:26px 0 14px;padding:22px 34px 22px 28px;border:1px solid #e4d7c7;border-radius:28px;background:linear-gradient(135deg,color-mix(in srgb,#f6efe3 72%,var(--panel)),var(--panel));box-shadow:0 12px 34px rgba(80,48,30,.075);overflow:hidden}.memoOwlChapter:after{content:"";position:absolute;width:220px;height:220px;border-radius:50%;right:-95px;top:-125px;background:rgba(176,120,80,.055);pointer-events:none}.memoOwlChapter .memoOwlMascot{width:158px;height:164px;flex:0 0 158px;display:grid;place-items:center;filter:drop-shadow(0 12px 12px rgba(80,48,30,.14))}.memoOwlChapter .memoClassicOwl{transform:scale(1.14);transform-origin:center}
      .memoOwlChapterText{min-width:0}.memoOwlChapterText small{display:block;margin-bottom:9px;color:#9b603f;font-size:10px;font-weight:900;letter-spacing:.13em}.memoOwlChapterText p{margin:0;color:var(--text);font-size:clamp(19px,2.4vw,25px);font-weight:800;line-height:1.3;letter-spacing:-.02em}.memoOwlChapterText span{display:block;margin-top:10px;color:var(--muted);font-size:11px;font-weight:650}
      .memoOwlTimer{display:flex;align-items:center;gap:12px;margin:13px 0 -4px;padding:10px 12px;border-radius:14px;background:linear-gradient(135deg,#f7efe4,var(--panel));border:1px solid #e4d7c7}.memoOwlTimer .memoOwlMascot{position:relative;width:56px;height:58px;flex:0 0 56px;overflow:visible}.memoOwlTimer .memoClassicOwl{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.42);transform-origin:center}.memoOwlTimer p{margin:0;font-size:10px;font-weight:800;line-height:1.4;color:var(--text)}.workTimerPanel.running .memoOwlTimer{border-color:#c9ab8e}.workTimerPanel.finished .memoOwlTimer{background:rgba(54,184,121,.1);border-color:rgba(54,184,121,.25)}
      .dark .memoOwlChapter,.dark .memoOwlTimer{background:linear-gradient(135deg,#292622,var(--panel));border-color:#4b4037}
      @media(max-width:650px){.memoOwlChapter{min-height:148px;margin-top:18px;padding:17px 18px;gap:17px;border-radius:22px}.memoOwlChapter .memoOwlMascot{width:104px;height:116px;flex-basis:104px}.memoOwlChapter .memoClassicOwl{transform:scale(.82)}.memoOwlChapterText p{font-size:16px}.memoOwlChapterText span{font-size:9px}}
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