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

  // Même identité que le hibou de l'accueil : palette, yeux et visage Memo.
  // Le dessin, la silhouette et les accessoires changent selon le contexte.
  // IMPORTANT : toutes les classes internes sont propres à ce hibou pour ne jamais modifier celui de l'accueil.
  const owl=(pose='')=>`<div class="memoContextOwl ${pose}" role="img" aria-label="Hibou Memo">
    <i class="memoCtxEar l"></i><i class="memoCtxEar r"></i>
    <div class="memoCtxBody"></div><div class="memoCtxBelly"></div>
    <div class="memoCtxHead"><i class="memoCtxEye l"></i><i class="memoCtxEye r"></i><i class="memoCtxBeak"></i></div>
    <i class="memoCtxWing l"></i><i class="memoCtxWing r"></i>
    <i class="memoCtxFoot l"></i><i class="memoCtxFoot r"></i>
    <span class="memoCtxTimerBadge"><i></i></span>
  </div>`;

  if(!document.getElementById('memoOwlStyle')){
    const style=document.createElement('style');style.id='memoOwlStyle';
    style.textContent=`
      /* Identité Memo : palette chaude du hibou d'accueil, sans toucher à son dessin. */
      .memoContextOwl{position:relative;width:132px;height:145px;isolation:isolate}
      .memoCtxBody{position:absolute;z-index:1;left:22px;bottom:13px;width:88px;height:96px;border-radius:46% 46% 43% 43%/42% 42% 58% 58%;background:linear-gradient(145deg,#b07850,#774932);transition:transform .35s ease}
      .memoCtxBelly{position:absolute;z-index:2;left:39px;bottom:18px;width:54px;height:65px;border-radius:50% 50% 46% 46%;background:#f4ddbf;transition:transform .35s ease}
      .memoCtxHead{position:absolute;z-index:5;left:12px;top:13px;width:108px;height:76px;border-radius:48% 48% 43% 43%;background:#bd8157;transition:transform .35s ease;transform-origin:54px 60px}
      .memoCtxEar{position:absolute;z-index:3;top:5px;width:29px;height:35px;background:#9b603f;border-radius:8px 75% 8px 70%}
      .memoCtxEar.l{left:20px;transform:rotate(31deg)}.memoCtxEar.r{right:20px;transform:scaleX(-1) rotate(31deg)}
      .memoCtxEye{position:absolute;top:13px;width:43px;height:43px;border-radius:50%;background:#fff6e9;border:4px solid #e6c39c;box-sizing:border-box}
      .memoCtxEye.l{left:8px}.memoCtxEye.r{right:8px}
      .memoCtxEye:before{content:"";position:absolute;width:22px;height:22px;border-radius:50%;background:#4c2b1e;left:7px;top:7px;box-shadow:inset 0 0 0 5px #8b4d25;transition:transform .3s ease}
      .memoCtxEye:after{content:"";position:absolute;width:6px;height:6px;border-radius:50%;background:white;left:13px;top:10px}
      .memoCtxBeak{position:absolute;z-index:7;left:47px;top:50px;border-left:7px solid transparent;border-right:7px solid transparent;border-top:14px solid #efa03e}
      .memoCtxWing{position:absolute;z-index:4;top:75px;width:34px;height:58px;background:#895538;border-radius:75% 28% 72% 34%;transition:transform .38s ease,top .38s ease,left .38s ease,right .38s ease}
      .memoCtxWing.l{left:10px;transform:rotate(16deg);transform-origin:25px 8px}.memoCtxWing.r{right:10px;transform:scaleX(-1) rotate(16deg);transform-origin:9px 8px}
      .memoCtxFoot{position:absolute;z-index:0;bottom:7px;width:25px;height:8px;border-radius:50%;border-bottom:4px solid #efa03e}
      .memoCtxFoot.l{left:34px;transform:rotate(-5deg)}.memoCtxFoot.r{right:34px;transform:rotate(5deg)}
      .memoCtxTimerBadge{display:none;position:absolute;z-index:8;right:4px;bottom:17px;width:30px;height:30px;border-radius:50%;box-sizing:border-box;background:#fff9e9;border:3px solid #6559a9;box-shadow:0 3px 0 rgba(92,81,155,.18)}
      .memoCtxTimerBadge:before{content:"";position:absolute;left:9px;top:-7px;width:7px;height:6px;border-radius:3px 3px 0 0;background:#6559a9}.memoCtxTimerBadge:after{content:"";position:absolute;left:12px;top:5px;width:2px;height:9px;border-radius:2px;background:#6559a9;transform-origin:bottom;transform:rotate(-35deg)}.memoCtxTimerBadge i{position:absolute;left:12px;top:12px;width:7px;height:2px;border-radius:2px;background:#6559a9}

      /* Chapitres : hibou debout, sans livre, qui présente les choix. */
      .memoContextOwl.pose-chapter{transform:rotate(-2deg)}
      .memoContextOwl.pose-chapter .memoCtxHead{transform:rotate(5deg) translate(2px,0)}
      .memoContextOwl.pose-chapter .memoCtxEye:before{transform:translate(2px,1px)}
      .memoContextOwl.pose-chapter .memoCtxWing.l{top:83px;left:8px;transform:rotate(24deg)}
      .memoContextOwl.pose-chapter .memoCtxWing.r{top:55px;right:-18px;transform:scaleX(-1) rotate(-78deg)}
      .memoContextOwl.pose-chapter .memoCtxBody{transform:rotate(1deg)}

      /* Chrono : silhouette plus vive + petit chronomètre, jamais de livre. */
      .memoContextOwl.pose-ready .memoCtxTimerBadge,.memoContextOwl.pose-running .memoCtxTimerBadge,.memoContextOwl.pose-pause .memoCtxTimerBadge,.memoContextOwl.pose-finished .memoCtxTimerBadge{display:block}
      .memoContextOwl.pose-ready .memoCtxHead{transform:rotate(-3deg)}.memoContextOwl.pose-ready .memoCtxWing.l{top:66px;left:1px;transform:rotate(48deg)}
      .memoContextOwl.pose-running .memoCtxHead{transform:rotate(4deg) translateY(-2px)}.memoContextOwl.pose-running .memoCtxBody{transform:rotate(-3deg) translateY(-1px)}.memoContextOwl.pose-running .memoCtxWing.l{top:65px;left:-5px;transform:rotate(64deg)}.memoContextOwl.pose-running .memoCtxWing.r{top:58px;right:-9px;transform:scaleX(-1) rotate(-69deg)}.memoContextOwl.pose-running .memoCtxFoot.l{transform:translateY(-3px) rotate(-12deg)}
      .memoContextOwl.pose-pause .memoCtxHead{transform:rotate(-7deg) translateY(2px)}.memoContextOwl.pose-pause .memoCtxWing.l{top:78px;left:8px;transform:rotate(28deg)}.memoContextOwl.pose-pause .memoCtxWing.r{top:79px;right:8px;transform:scaleX(-1) rotate(28deg)}
      .memoContextOwl.pose-finished .memoCtxHead{transform:translateY(-5px)}.memoContextOwl.pose-finished .memoCtxWing.l{top:48px;left:-10px;transform:rotate(145deg)}.memoContextOwl.pose-finished .memoCtxWing.r{top:48px;right:-10px;transform:scaleX(-1) rotate(-145deg)}.memoContextOwl.pose-finished .memoCtxBody{transform:translateY(-2px)}

      .memoOwlChapter{position:relative;display:flex;align-items:center;gap:34px;width:min(880px,100%);min-height:190px;box-sizing:border-box;margin:26px 0 14px;padding:22px 34px 22px 28px;border:1px solid #e4d7c7;border-radius:28px;background:linear-gradient(135deg,color-mix(in srgb,#f6efe3 72%,var(--panel)),var(--panel));box-shadow:0 12px 34px rgba(80,48,30,.075);overflow:hidden}.memoOwlChapter:after{content:"";position:absolute;width:220px;height:220px;border-radius:50%;right:-95px;top:-125px;background:rgba(176,120,80,.055);pointer-events:none}.memoOwlChapter .memoOwlMascot{width:178px;height:170px;flex:0 0 178px;display:grid;place-items:center;filter:drop-shadow(0 12px 12px rgba(80,48,30,.14))}.memoOwlChapter .memoContextOwl{transform:scale(1.16) rotate(-2deg);transform-origin:center}
      .memoOwlChapterText{min-width:0}.memoOwlChapterText small{display:block;margin-bottom:9px;color:#9b603f;font-size:10px;font-weight:900;letter-spacing:.13em}.memoOwlChapterText p{margin:0;color:var(--text);font-size:clamp(19px,2.4vw,25px);font-weight:800;line-height:1.3;letter-spacing:-.02em}.memoOwlChapterText span{display:block;margin-top:10px;color:var(--muted);font-size:11px;font-weight:650}
      .memoOwlTimer{display:flex;align-items:center;gap:12px;margin:13px 0 -4px;padding:10px 12px;border-radius:14px;background:linear-gradient(135deg,#f7efe4,var(--panel));border:1px solid #e4d7c7}.memoOwlTimer .memoOwlMascot{position:relative;width:68px;height:66px;flex:0 0 68px;overflow:visible}.memoOwlTimer .memoContextOwl{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.43);transform-origin:center}.memoOwlTimer p{margin:0;font-size:10px;font-weight:800;line-height:1.4;color:var(--text)}.workTimerPanel.running .memoOwlTimer{border-color:#c9ab8e}.workTimerPanel.finished .memoOwlTimer{background:rgba(54,184,121,.1);border-color:rgba(54,184,121,.25)}
      .dark .memoOwlChapter,.dark .memoOwlTimer{background:linear-gradient(135deg,#292622,var(--panel));border-color:#4b4037}
      @media(max-width:650px){.memoOwlChapter{min-height:148px;margin-top:18px;padding:17px 18px;gap:17px;border-radius:22px}.memoOwlChapter .memoOwlMascot{width:112px;height:116px;flex-basis:112px}.memoOwlChapter .memoContextOwl{transform:scale(.8) rotate(-2deg)}.memoOwlChapterText p{font-size:16px}.memoOwlChapterText span{font-size:9px}}
      @media(prefers-reduced-motion:reduce){.memoCtxWing,.memoCtxHead,.memoCtxBody,.memoCtxBelly,.memoCtxEye:before{transition:none}}
    `;document.head.appendChild(style)
  }

  if(subject&&!document.getElementById('memoOwlChapter')){
    const box=document.createElement('div');box.id='memoOwlChapter';box.className='memoOwlChapter';
    box.innerHTML=`<div class="memoOwlMascot">${owl('pose-chapter')}</div><div class="memoOwlChapterText"><small>TON COMPAGNON DE RÉVISION</small><p id="memoOwlChapterText"></p><span>On avance ensemble, à ton rythme.</span></div>`;
    const title=subject.querySelector('.title');if(title)title.insertAdjacentElement('afterend',box);else subject.prepend(box);
    const sayChapter=()=>{const t=document.getElementById('memoOwlChapterText');if(t)t.textContent=pick(chapterLines)};
    sayChapter();new MutationObserver(()=>{if(subject.classList.contains('on'))sayChapter()}).observe(subject,{attributes:true,attributeFilter:['class']})
  }

  function setupTimer(){
    const timer=document.getElementById('workTimerPanel');if(!timer||document.getElementById('memoOwlTimer'))return !!timer;
    const box=document.createElement('div');box.id='memoOwlTimer';box.className='memoOwlTimer';
    box.innerHTML=`<div class="memoOwlMascot">${owl('pose-ready')}</div><p id="memoOwlTimerText">C’est le moment de s’organiser.</p>`;
    const state=document.getElementById('workTimerState');if(state)state.insertAdjacentElement('afterend',box);else timer.appendChild(box);
    const text=box.querySelector('p'),mascot=box.querySelector('.memoContextOwl');let lastRunning='';
    const setPose=pose=>{mascot.classList.remove('pose-ready','pose-running','pose-pause','pose-finished');mascot.classList.add(pose)};
    const update=()=>{const label=(state?.textContent||'').toLowerCase();if(timer.classList.contains('finished')){setPose('pose-finished');text.textContent='Bravo, session terminée ! Tu peux être fier de toi.'}else if(label.includes('pause')){setPose('pose-pause');lastRunning='';text.textContent='Une petite pause, puis on repart !'}else if(timer.classList.contains('running')){setPose('pose-running');if(!lastRunning)lastRunning=pick(runningLines);text.textContent=lastRunning}else{setPose('pose-ready');lastRunning='';text.textContent='C’est le moment de s’organiser. Combien de temps on travaille ?'}};
    new MutationObserver(update).observe(timer,{attributes:true,attributeFilter:['class']});if(state)new MutationObserver(update).observe(state,{childList:true,characterData:true,subtree:true});setInterval(()=>{if(timer.classList.contains('running')){lastRunning=pick(runningLines);update()}},180000);update();return true
  }
  if(!setupTimer()){let tries=0;const wait=setInterval(()=>{tries++;if(setupTimer()||tries>20)clearInterval(wait)},100)}
})();