(()=>{
  const subject=document.getElementById('subject');
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const chapterLines=["Alors, quel chapitre on avance aujourd’hui ?","On avance sur quoi aujourd’hui ?","Choisis ton chapitre, je révise avec toi.","Un chapitre à la fois. Lequel on attaque ?"];
  const runningLines=["Allez, toujours plus !","Garde le rythme, tu avances !","Concentre-toi, je reste avec toi.","Encore un peu, ça travaille bien !"];

  /* Hibou contextuel Memo. Dessin totalement indépendant du hibou d'accueil. */
  const owl=(pose='')=>`<div class="memoContextOwl ${pose}" role="img" aria-label="Hibou Memo">
    <svg class="memoCtxSvg" viewBox="0 0 240 230" aria-hidden="true">
      <ellipse class="memoCtxShadow" cx="113" cy="216" rx="82" ry="10"/>
      <g class="memoCtxCharacter">
        <!-- corps compact : la tête chevauche vraiment le torse -->
        <path class="memoCtxBody" d="M73 101 C55 113 48 137 52 164 C56 190 75 207 104 209 C132 211 153 197 162 174 C171 151 167 124 151 108 C133 91 94 88 73 101 Z"/>
        <path class="memoCtxBelly" d="M82 126 C89 115 104 110 119 114 C136 119 145 134 144 153 C143 177 132 196 114 199 C94 202 78 187 75 163 C73 147 76 135 82 126 Z"/>

        <!-- grande tête expressive, inclinée comme dans la maquette -->
        <g class="memoCtxHead">
          <path class="memoCtxHeadShape" d="M39 47 C47 26 66 15 89 14 C111 7 139 13 155 30 C174 48 176 75 164 95 C151 117 124 127 94 122 C65 119 42 104 34 82 C30 69 31 57 39 47 Z"/>
          <path class="memoCtxTuft l" d="M45 45 C34 34 33 18 42 7 C56 12 65 22 68 34 Z"/>
          <path class="memoCtxTuft r" d="M137 29 C144 14 157 7 170 9 C174 23 168 37 157 46 Z"/>
          <circle class="memoCtxEyeCream l" cx="78" cy="67" r="31"/>
          <circle class="memoCtxEyeCream r" cx="132" cy="64" r="31"/>
          <circle class="memoCtxIris l" cx="80" cy="70" r="16"/><circle class="memoCtxIris r" cx="134" cy="67" r="16"/>
          <circle class="memoCtxPupil l" cx="80" cy="70" r="10"/><circle class="memoCtxPupil r" cx="134" cy="67" r="10"/>
          <circle class="memoCtxGlint l" cx="74" cy="63" r="5"/><circle class="memoCtxGlint r" cx="128" cy="60" r="5"/>
          <path class="memoCtxBeak" d="M96 91 Q107 82 119 90 L108 103 Z"/>
          <path class="memoCtxMouth" d="M101 102 Q108 111 116 102 Q115 115 108 117 Q101 114 101 102 Z"/>
        </g>

        <!-- aile gauche intégrée au corps -->
        <path class="memoCtxWingLeft" d="M67 125 C48 128 34 145 35 163 C36 176 44 184 56 181 C70 178 79 164 82 148 C84 137 78 128 67 125 Z"/>

        <!-- aile droite levée, faite de grandes plumes organiques -->
        <g class="memoCtxWingRight">
          <path d="M148 125 C162 112 173 95 177 76 C185 84 184 99 180 110 C191 102 199 90 202 78 C211 91 206 108 196 121 C207 117 216 110 222 101 C225 119 213 136 196 146 C181 155 165 158 153 149 C143 142 140 133 148 125 Z"/>
          <path class="memoCtxFeatherLine" d="M160 137 Q178 132 192 117 M169 145 Q189 141 203 128"/>
        </g>

        <!-- pattes courtes et solides -->
        <g class="memoCtxFeet">
          <path class="memoCtxLeg" d="M89 197 L87 211 M135 195 L137 210"/>
          <path class="memoCtxFoot" d="M87 209 Q73 208 67 216 Q81 213 91 216 Q98 211 104 216 M137 208 Q125 209 119 216 Q133 213 142 216 Q150 211 157 216"/>
        </g>
      </g>
    </svg>
    <span class="memoCtxTimerBadge"><i></i></span>
  </div>`;

  if(!document.getElementById('memoOwlStyle')){
    const style=document.createElement('style');style.id='memoOwlStyle';
    style.textContent=`
      .memoContextOwl{position:relative;width:240px;height:230px;isolation:isolate;--memo-brown:#b07850;--memo-dark:#774932;--memo-face:#bd8157;--memo-mid:#895538;--memo-cream:#f4ddbf;--memo-eye:#fff6e9;--memo-ring:#e6c39c;--memo-iris:#8b4d25;--memo-pupil:#4c2b1e;--memo-orange:#efa03e}
      .memoCtxSvg{display:block;width:100%;height:100%;overflow:visible}.memoCtxShadow{fill:rgba(60,38,28,.18)}
      .memoCtxCharacter{transform-origin:112px 208px;transition:transform .38s ease}.memoCtxBody{fill:var(--memo-brown)}.memoCtxBelly{fill:var(--memo-cream)}
      .memoCtxHead{transform-origin:108px 102px;transition:transform .35s ease}.memoCtxHeadShape{fill:var(--memo-face)}.memoCtxTuft{fill:var(--memo-dark)}
      .memoCtxEyeCream{fill:var(--memo-eye);stroke:var(--memo-ring);stroke-width:6}.memoCtxIris{fill:var(--memo-iris)}.memoCtxPupil{fill:var(--memo-pupil)}.memoCtxGlint{fill:#fff}.memoCtxBeak{fill:var(--memo-orange)}.memoCtxMouth{fill:#df7054}
      .memoCtxWingLeft,.memoCtxWingRight{fill:var(--memo-mid);transform-box:fill-box;transition:transform .4s cubic-bezier(.2,.8,.2,1)}.memoCtxWingLeft{transform-origin:85% 15%}.memoCtxWingRight{transform-origin:12% 80%}.memoCtxFeatherLine{fill:none;stroke:var(--memo-dark);stroke-width:3;stroke-linecap:round;opacity:.28}
      .memoCtxLeg,.memoCtxFoot{fill:none;stroke:var(--memo-orange);stroke-width:6;stroke-linecap:round;stroke-linejoin:round}.memoCtxIris,.memoCtxPupil,.memoCtxGlint{transition:transform .3s ease}
      .memoCtxTimerBadge{display:none;position:absolute;z-index:8;right:20px;bottom:22px;width:36px;height:36px;border-radius:50%;box-sizing:border-box;background:#fff9e9;border:3px solid #6559a9;box-shadow:0 4px 0 rgba(92,81,155,.18)}.memoCtxTimerBadge:before{content:"";position:absolute;left:11px;top:-8px;width:8px;height:7px;border-radius:4px 4px 0 0;background:#6559a9}.memoCtxTimerBadge:after{content:"";position:absolute;left:15px;top:7px;width:2px;height:10px;border-radius:2px;background:#6559a9;transform-origin:bottom;transform:rotate(-35deg)}.memoCtxTimerBadge i{position:absolute;left:15px;top:16px;width:8px;height:2px;border-radius:2px;background:#6559a9}

      .memoContextOwl.pose-chapter .memoCtxCharacter{transform:rotate(-1deg)}.memoContextOwl.pose-chapter .memoCtxHead{transform:rotate(-8deg) translate(-3px,3px)}.memoContextOwl.pose-chapter .memoCtxIris,.memoContextOwl.pose-chapter .memoCtxPupil,.memoContextOwl.pose-chapter .memoCtxGlint{transform:translate(3px,1px)}.memoContextOwl.pose-chapter .memoCtxWingRight{transform:rotate(-5deg) translate(1px,-2px)}
      .memoContextOwl.pose-ready .memoCtxTimerBadge,.memoContextOwl.pose-running .memoCtxTimerBadge,.memoContextOwl.pose-pause .memoCtxTimerBadge,.memoContextOwl.pose-finished .memoCtxTimerBadge{display:block}.memoContextOwl.pose-ready .memoCtxHead{transform:rotate(-3deg)}.memoContextOwl.pose-ready .memoCtxWingRight{transform:rotate(10deg)}.memoContextOwl.pose-running .memoCtxCharacter{transform:rotate(2deg) translateY(-2px)}.memoContextOwl.pose-running .memoCtxWingRight{transform:rotate(-12deg) translateY(-5px)}.memoContextOwl.pose-pause .memoCtxHead{transform:rotate(-7deg) translateY(2px)}.memoContextOwl.pose-pause .memoCtxWingRight{transform:rotate(18deg) translateY(5px)}.memoContextOwl.pose-finished .memoCtxCharacter{transform:translateY(-5px)}.memoContextOwl.pose-finished .memoCtxWingLeft{transform:rotate(25deg)}.memoContextOwl.pose-finished .memoCtxWingRight{transform:rotate(-14deg) translateY(-8px)}

      .memoOwlChapter{position:relative;display:flex;align-items:center;gap:30px;width:min(880px,100%);min-height:250px;box-sizing:border-box;margin:26px 0 14px;padding:14px 38px 14px 20px;border:1px solid #e4d7c7;border-radius:28px;background:linear-gradient(135deg,color-mix(in srgb,#f6efe3 72%,var(--panel)),var(--panel));box-shadow:0 12px 34px rgba(80,48,30,.075);overflow:hidden}.memoOwlChapter:after{content:"";position:absolute;width:250px;height:250px;border-radius:50%;right:-110px;top:-145px;background:rgba(176,120,80,.055);pointer-events:none}.memoOwlChapter .memoOwlMascot{width:250px;height:225px;flex:0 0 250px;display:grid;place-items:center;filter:drop-shadow(0 13px 12px rgba(80,48,30,.13))}.memoOwlChapter .memoContextOwl{transform:scale(1);transform-origin:center}
      .memoOwlChapterText{min-width:0;position:relative;z-index:2}.memoOwlChapterText small{display:block;margin-bottom:10px;color:#9b603f;font-size:10px;font-weight:900;letter-spacing:.13em}.memoOwlChapterText p{margin:0;color:var(--text);font-size:clamp(20px,2.4vw,27px);font-weight:800;line-height:1.25;letter-spacing:-.025em}.memoOwlChapterText span{display:block;margin-top:11px;color:var(--muted);font-size:11px;font-weight:650}
      .memoOwlTimer{display:flex;align-items:center;gap:12px;margin:13px 0 -4px;padding:10px 12px;border-radius:14px;background:linear-gradient(135deg,#f7efe4,var(--panel));border:1px solid #e4d7c7}.memoOwlTimer .memoOwlMascot{position:relative;width:72px;height:70px;flex:0 0 72px;overflow:visible}.memoOwlTimer .memoContextOwl{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.3);transform-origin:center}.memoOwlTimer p{margin:0;font-size:10px;font-weight:800;line-height:1.4;color:var(--text)}.workTimerPanel.running .memoOwlTimer{border-color:#c9ab8e}.workTimerPanel.finished .memoOwlTimer{background:rgba(54,184,121,.1);border-color:rgba(54,184,121,.25)}
      .dark .memoOwlChapter,.dark .memoOwlTimer{background:linear-gradient(135deg,#292622,var(--panel));border-color:#4b4037}
      @media(max-width:650px){.memoOwlChapter{min-height:175px;margin-top:18px;padding:10px 16px;gap:10px;border-radius:22px}.memoOwlChapter .memoOwlMascot{width:145px;height:150px;flex-basis:145px}.memoOwlChapter .memoContextOwl{transform:scale(.63)}.memoOwlChapterText p{font-size:16px}.memoOwlChapterText span{font-size:9px}}
      @media(prefers-reduced-motion:reduce){.memoCtxCharacter,.memoCtxHead,.memoCtxWingLeft,.memoCtxWingRight,.memoCtxIris,.memoCtxPupil,.memoCtxGlint{transition:none}}
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