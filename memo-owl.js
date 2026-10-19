(()=>{
  const subject=document.getElementById('subject');
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const chapterLines=["Alors, quel chapitre on avance aujourd’hui ?","On avance sur quoi aujourd’hui ?","Choisis ton chapitre, je révise avec toi.","Un chapitre à la fois. Lequel on attaque ?"];
  const runningLines=["Allez, toujours plus !","Garde le rythme, tu avances !","Concentre-toi, je reste avec toi.","Encore un peu, ça travaille bien !"];

  /*
    Les hiboux contextuels ne sont PAS un même dessin articulé.
    Chaque apparition est une illustration différente de la même mascotte :
    même palette / grands yeux / bec orange, mais proportions, silhouette et pose libres.
    Le hibou d'accueil reste totalement indépendant dans home-mascot.js.
  */
  const chapterOwl=()=>`<div class="memoChapterOwl" role="img" aria-label="Hibou Memo qui présente les chapitres"><svg viewBox="0 0 250 235" aria-hidden="true">
    <ellipse class="owShadow" cx="122" cy="220" rx="78" ry="9"/>
    <path class="owBody" d="M64 104 C47 121 44 154 54 181 C64 207 89 218 119 216 C149 215 169 201 177 177 C186 150 180 120 159 103 C138 86 84 86 64 104Z"/>
    <path class="owBelly" d="M82 126 C92 113 110 108 126 112 C146 117 157 136 155 158 C153 187 139 205 119 207 C97 209 80 191 77 163 C75 147 77 134 82 126Z"/>
    <path class="owEar" d="M54 64 C43 47 45 25 58 13 C72 22 80 35 81 51Z"/><path class="owEar" d="M151 49 C157 31 170 20 185 18 C190 36 184 52 170 65Z"/>
    <path class="owHead" d="M52 55 C68 32 96 25 123 31 C150 27 177 42 187 65 C197 88 186 112 164 126 C144 139 111 140 84 131 C58 122 42 103 42 81 C42 71 45 62 52 55Z"/>
    <path class="owMask" d="M61 72 C68 51 88 44 106 53 C114 57 119 64 122 73 C126 62 135 54 145 52 C163 49 180 63 181 82 C181 104 164 117 145 117 C134 117 126 111 121 102 C115 113 105 119 93 119 C73 119 58 104 57 85 C57 80 58 76 61 72Z"/>
    <circle class="owIris" cx="92" cy="82" r="14"/><circle class="owPupil" cx="92" cy="82" r="8"/><circle class="owGlint" cx="87" cy="77" r="4"/>
    <circle class="owIris" cx="149" cy="80" r="14"/><circle class="owPupil" cx="149" cy="80" r="8"/><circle class="owGlint" cx="144" cy="75" r="4"/>
    <path class="owBeak" d="M108 103 Q121 92 134 102 L121 116Z"/><path class="owMouth" d="M114 113 Q121 122 129 113 Q128 126 121 128 Q114 125 114 113Z"/>
    <path class="owWingDown" d="M67 129 C47 133 34 151 36 170 C38 187 49 195 62 188 C77 181 85 164 84 148 C83 137 77 130 67 129Z"/>
    <path class="owWingUp" d="M164 131 C177 116 185 96 186 77 C195 85 197 99 193 112 C204 104 211 93 214 82 C222 96 218 112 207 125 C218 122 227 116 233 108 C234 127 220 145 201 154 C184 163 168 162 158 151 C151 143 154 137 164 131Z"/>
    <path class="owFeather" d="M174 143 Q194 137 208 122 M184 151 Q205 146 219 134"/>
    <path class="owLeg" d="M95 202 L93 217 M143 201 L145 216"/><path class="owFoot" d="M93 214 Q79 214 72 222 Q87 218 97 222 Q103 216 110 221 M145 214 Q132 214 126 222 Q140 218 150 222 Q157 216 164 221"/>
    <g class="owSpark"><path d="M211 57 L218 40"/><path d="M225 64 L239 54"/></g>
  </svg></div>`;

  const timerOwl=(pose='ready')=>`<div class="memoTimerOwl ${pose}" role="img" aria-label="Hibou Memo du chrono"><svg viewBox="0 0 120 120" aria-hidden="true">
    <ellipse class="owShadow" cx="59" cy="111" rx="34" ry="5"/>
    <path class="owTimerBody" d="M31 49 C24 60 25 82 34 96 C42 108 56 111 69 107 C83 103 91 91 91 75 C91 58 83 47 70 42 C57 37 39 40 31 49Z"/>
    <path class="owTimerBelly" d="M43 68 C47 61 56 59 63 61 C73 64 78 74 76 86 C74 99 67 104 59 104 C49 103 43 95 41 84 C40 78 41 72 43 68Z"/>
    <path class="owTimerEar" d="M31 43 C24 34 25 22 31 16 C39 20 44 27 45 35Z"/><path class="owTimerEar" d="M72 35 C76 25 83 19 91 19 C94 29 90 39 84 45Z"/>
    <path class="owTimerHead" d="M28 39 C37 27 50 24 61 27 C74 24 87 31 92 42 C98 56 90 69 79 75 C67 81 48 80 37 74 C25 68 20 55 24 46 C25 43 26 41 28 39Z"/>
    <path class="owTimerMask" d="M31 46 C35 36 46 34 54 39 C58 41 60 45 61 49 C64 43 68 39 74 38 C84 37 91 45 91 54 C91 64 83 70 74 70 C68 70 64 67 61 62 C58 68 53 71 47 71 C37 71 30 63 30 54 C30 51 30 48 31 46Z"/>
    <circle class="owTimerIris" cx="46" cy="52" r="7"/><circle class="owTimerPupil" cx="46" cy="52" r="4"/><circle class="owTimerGlint" cx="43" cy="49" r="2"/>
    <circle class="owTimerIris" cx="75" cy="51" r="7"/><circle class="owTimerPupil" cx="75" cy="51" r="4"/><circle class="owTimerGlint" cx="72" cy="48" r="2"/>
    <path class="owTimerBeak" d="M55 63 Q61 58 67 63 L61 70Z"/>
    <path class="owTimerWing l" d="M34 70 C23 73 18 84 21 94 C24 102 31 104 37 98 C43 92 45 82 43 76 C41 72 38 70 34 70Z"/>
    <path class="owTimerWing r" d="M85 70 C95 72 101 82 99 92 C97 101 90 104 84 98 C78 92 76 82 78 76 C79 72 82 70 85 70Z"/>
    <path class="owTimerFoot" d="M48 103 Q41 107 36 108 M48 103 Q50 108 54 109 M72 102 Q67 107 62 108 M72 102 Q76 106 80 107"/>
  </svg><span class="memoWatch"><i></i></span></div>`;

  if(!document.getElementById('memoOwlStyle')){
    const style=document.createElement('style');style.id='memoOwlStyle';style.textContent=`
      .memoChapterOwl{width:250px;height:235px}.memoChapterOwl svg,.memoTimerOwl svg{display:block;width:100%;height:100%;overflow:visible}
      .memoChapterOwl .owShadow,.memoTimerOwl .owShadow{fill:rgba(54,34,25,.18)}
      .memoChapterOwl .owBody{fill:#a96f49}.memoChapterOwl .owBelly{fill:#f4ddbf}.memoChapterOwl .owHead{fill:#bd8157}.memoChapterOwl .owEar{fill:#774932}.memoChapterOwl .owMask{fill:#fff6e9;stroke:#e6c39c;stroke-width:5;stroke-linejoin:round}.memoChapterOwl .owIris{fill:#8b4d25}.memoChapterOwl .owPupil{fill:#4c2b1e}.memoChapterOwl .owGlint{fill:#fff}.memoChapterOwl .owBeak{fill:#efa03e}.memoChapterOwl .owMouth{fill:#dc7055}.memoChapterOwl .owWingDown,.memoChapterOwl .owWingUp{fill:#895538}.memoChapterOwl .owFeather{fill:none;stroke:#774932;stroke-width:3;stroke-linecap:round;opacity:.28}.memoChapterOwl .owLeg,.memoChapterOwl .owFoot,.memoChapterOwl .owSpark path{fill:none;stroke:#efa03e;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}.memoChapterOwl .owSpark path{stroke-width:5}
      .memoTimerOwl{position:relative;width:120px;height:120px}.memoTimerOwl .owTimerBody{fill:#a96f49}.memoTimerOwl .owTimerBelly{fill:#f4ddbf}.memoTimerOwl .owTimerHead{fill:#bd8157}.memoTimerOwl .owTimerEar{fill:#774932}.memoTimerOwl .owTimerMask{fill:#fff6e9;stroke:#e6c39c;stroke-width:3}.memoTimerOwl .owTimerIris{fill:#8b4d25}.memoTimerOwl .owTimerPupil{fill:#4c2b1e}.memoTimerOwl .owTimerGlint{fill:#fff}.memoTimerOwl .owTimerBeak{fill:#efa03e}.memoTimerOwl .owTimerWing{fill:#895538;transform-box:fill-box;transition:transform .35s ease}.memoTimerOwl .owTimerWing.l{transform-origin:90% 15%}.memoTimerOwl .owTimerWing.r{transform-origin:10% 15%}.memoTimerOwl .owTimerFoot{fill:none;stroke:#efa03e;stroke-width:4;stroke-linecap:round}
      .memoWatch{position:absolute;right:4px;bottom:12px;width:25px;height:25px;border-radius:50%;background:#fff9e9;border:3px solid #6559a9;box-sizing:border-box}.memoWatch:before{content:"";position:absolute;left:7px;top:-7px;width:6px;height:6px;border-radius:3px 3px 0 0;background:#6559a9}.memoWatch:after{content:"";position:absolute;left:10px;top:5px;width:2px;height:8px;background:#6559a9;transform:rotate(-35deg);transform-origin:bottom}.memoWatch i{position:absolute;left:10px;top:11px;width:6px;height:2px;background:#6559a9}
      .memoTimerOwl.running .owTimerWing.r{transform:rotate(-58deg) translateY(-4px)}.memoTimerOwl.running .owTimerWing.l{transform:rotate(12deg)}.memoTimerOwl.pause .owTimerWing.l,.memoTimerOwl.pause .owTimerWing.r{transform:rotate(10deg)}.memoTimerOwl.finished .owTimerWing.l{transform:rotate(115deg) translate(-2px,-4px)}.memoTimerOwl.finished .owTimerWing.r{transform:rotate(-115deg) translate(2px,-4px)}
      .memoOwlChapter{position:relative;display:flex;align-items:center;gap:28px;width:min(880px,100%);min-height:250px;box-sizing:border-box;margin:26px 0 14px;padding:12px 38px 12px 18px;border:1px solid #e4d7c7;border-radius:28px;background:linear-gradient(135deg,color-mix(in srgb,#f6efe3 72%,var(--panel)),var(--panel));box-shadow:0 12px 34px rgba(80,48,30,.075);overflow:hidden}.memoOwlChapter:after{content:"";position:absolute;width:250px;height:250px;border-radius:50%;right:-110px;top:-145px;background:rgba(176,120,80,.055);pointer-events:none}.memoOwlChapter .memoOwlMascot{width:260px;height:225px;flex:0 0 260px;display:grid;place-items:center;filter:drop-shadow(0 13px 12px rgba(80,48,30,.12))}.memoOwlChapterText{min-width:0;position:relative;z-index:2}.memoOwlChapterText small{display:block;margin-bottom:10px;color:#9b603f;font-size:10px;font-weight:900;letter-spacing:.13em}.memoOwlChapterText p{margin:0;color:var(--text);font-size:clamp(20px,2.4vw,27px);font-weight:800;line-height:1.25;letter-spacing:-.025em}.memoOwlChapterText span{display:block;margin-top:11px;color:var(--muted);font-size:11px;font-weight:650}
      .memoOwlTimer{display:flex;align-items:center;gap:12px;margin:13px 0 -4px;padding:9px 12px;border-radius:14px;background:linear-gradient(135deg,#f7efe4,var(--panel));border:1px solid #e4d7c7}.memoOwlTimer .memoOwlMascot{position:relative;width:64px;height:62px;flex:0 0 64px;overflow:visible}.memoOwlTimer .memoTimerOwl{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.52);transform-origin:center}.memoOwlTimer p{margin:0;font-size:10px;font-weight:800;line-height:1.4;color:var(--text)}.workTimerPanel.running .memoOwlTimer{border-color:#c9ab8e}.workTimerPanel.finished .memoOwlTimer{background:rgba(54,184,121,.1);border-color:rgba(54,184,121,.25)}
      .dark .memoOwlChapter,.dark .memoOwlTimer{background:linear-gradient(135deg,#292622,var(--panel));border-color:#4b4037}
      @media(max-width:650px){.memoOwlChapter{min-height:175px;margin-top:18px;padding:10px 16px;gap:10px;border-radius:22px}.memoOwlChapter .memoOwlMascot{width:145px;height:150px;flex-basis:145px}.memoOwlChapter .memoChapterOwl{transform:scale(.62)}.memoOwlChapterText p{font-size:16px}.memoOwlChapterText span{font-size:9px}}
      @media(prefers-reduced-motion:reduce){.memoTimerOwl .owTimerWing{transition:none}}
    `;document.head.appendChild(style)
  }

  if(subject&&!document.getElementById('memoOwlChapter')){
    const box=document.createElement('div');box.id='memoOwlChapter';box.className='memoOwlChapter';box.innerHTML=`<div class="memoOwlMascot">${chapterOwl()}</div><div class="memoOwlChapterText"><small>TON COMPAGNON DE RÉVISION</small><p id="memoOwlChapterText"></p><span>On avance ensemble, à ton rythme.</span></div>`;
    const title=subject.querySelector('.title');if(title)title.insertAdjacentElement('afterend',box);else subject.prepend(box);
    const sayChapter=()=>{const t=document.getElementById('memoOwlChapterText');if(t)t.textContent=pick(chapterLines)};sayChapter();new MutationObserver(()=>{if(subject.classList.contains('on'))sayChapter()}).observe(subject,{attributes:true,attributeFilter:['class']})
  }

  function setupTimer(){
    const timer=document.getElementById('workTimerPanel');if(!timer||document.getElementById('memoOwlTimer'))return !!timer;
    const box=document.createElement('div');box.id='memoOwlTimer';box.className='memoOwlTimer';box.innerHTML=`<div class="memoOwlMascot">${timerOwl('ready')}</div><p id="memoOwlTimerText">C’est le moment de s’organiser.</p>`;
    const state=document.getElementById('workTimerState');if(state)state.insertAdjacentElement('afterend',box);else timer.appendChild(box);
    const text=box.querySelector('p'),mascot=box.querySelector('.memoTimerOwl');let lastRunning='';
    const setPose=pose=>{mascot.classList.remove('ready','running','pause','finished');mascot.classList.add(pose)};
    const update=()=>{const label=(state?.textContent||'').toLowerCase();if(timer.classList.contains('finished')){setPose('finished');text.textContent='Bravo, session terminée ! Tu peux être fier de toi.'}else if(label.includes('pause')){setPose('pause');lastRunning='';text.textContent='Une petite pause, puis on repart !'}else if(timer.classList.contains('running')){setPose('running');if(!lastRunning)lastRunning=pick(runningLines);text.textContent=lastRunning}else{setPose('ready');lastRunning='';text.textContent='C’est le moment de s’organiser. Combien de temps on travaille ?'}};
    new MutationObserver(update).observe(timer,{attributes:true,attributeFilter:['class']});if(state)new MutationObserver(update).observe(state,{childList:true,characterData:true,subtree:true});setInterval(()=>{if(timer.classList.contains('running')){lastRunning=pick(runningLines);update()}},180000);update();return true
  }
  if(!setupTimer()){let tries=0;const wait=setInterval(()=>{tries++;if(setupTimer()||tries>20)clearInterval(wait)},100)}
})();