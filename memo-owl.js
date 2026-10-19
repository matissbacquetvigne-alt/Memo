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

  /*
    Hibou contextuel Memo.
    Même famille de couleurs que le hibou d'accueil, mais dessin indépendant :
    silhouette continue, grosses expressions, vraies pattes et ailes organiques.
    Aucune classe du hibou d'accueil n'est réutilisée.
  */
  const owl=(pose='')=>`<div class="memoContextOwl ${pose}" role="img" aria-label="Hibou Memo">
    <svg class="memoCtxSvg" viewBox="0 0 190 210" aria-hidden="true">
      <ellipse class="memoCtxShadow" cx="92" cy="197" rx="61" ry="9"/>
      <g class="memoCtxCharacter">
        <path class="memoCtxBack" d="M50 52 C39 41 36 24 45 10 C56 14 64 22 69 31 C84 25 104 25 119 31 C125 20 134 13 146 11 C152 26 149 40 139 51 C153 66 158 87 154 108 C151 126 145 148 134 164 C123 180 110 190 92 190 C72 190 56 180 46 163 C36 146 31 124 30 105 C29 84 35 65 50 52 Z"/>
        <path class="memoCtxBelly" d="M61 111 C66 101 78 96 92 96 C107 96 119 102 124 113 C129 126 128 151 120 167 C114 180 105 185 92 185 C79 185 69 179 63 167 C55 151 55 126 61 111 Z"/>

        <g class="memoCtxFace">
          <path class="memoCtxBrow" d="M48 50 C58 35 75 30 92 37 C109 29 128 35 139 50 C143 58 143 69 139 78 C133 92 117 101 92 102 C67 101 51 92 45 78 C41 68 42 58 48 50 Z"/>
          <circle class="memoCtxEyeCream l" cx="69" cy="66" r="27"/>
          <circle class="memoCtxEyeCream r" cx="116" cy="66" r="27"/>
          <circle class="memoCtxIris l" cx="70" cy="68" r="14"/>
          <circle class="memoCtxIris r" cx="117" cy="68" r="14"/>
          <circle class="memoCtxPupil l" cx="70" cy="68" r="8"/>
          <circle class="memoCtxPupil r" cx="117" cy="68" r="8"/>
          <circle class="memoCtxGlint l" cx="65" cy="62" r="4"/>
          <circle class="memoCtxGlint r" cx="112" cy="62" r="4"/>
          <path class="memoCtxBeak" d="M82 87 Q92 78 102 87 L92 99 Z"/>
          <path class="memoCtxSmile" d="M85 98 Q92 107 100 98 Q98 112 92 113 Q86 111 85 98 Z"/>
        </g>

        <g class="memoCtxWingLeft">
          <path d="M43 105 C26 111 18 128 20 145 C22 160 33 168 45 161 C55 155 61 143 62 128 C62 116 55 108 43 105 Z"/>
          <path class="memoCtxFeatherLine" d="M29 145 Q42 150 53 139"/>
        </g>
        <g class="memoCtxWingRight">
          <path d="M139 106 C151 98 160 87 164 72 C169 78 169 89 166 99 C175 93 181 84 184 75 C189 89 182 104 172 114 C181 112 187 108 190 104 C189 119 177 130 160 135 C151 138 143 132 137 124 C132 117 133 111 139 106 Z"/>
          <path class="memoCtxFeatherLine" d="M151 118 Q163 116 174 105"/>
        </g>

        <g class="memoCtxFeet">
          <path class="memoCtxLeg l" d="M74 179 L72 193"/>
          <path class="memoCtxLeg r" d="M109 179 L111 193"/>
          <path class="memoCtxFoot l" d="M72 191 Q61 191 57 198 Q68 195 75 198 Q80 194 84 198"/>
          <path class="memoCtxFoot r" d="M111 191 Q101 191 97 198 Q108 195 114 198 Q120 194 125 198"/>
        </g>
      </g>
    </svg>
    <span class="memoCtxTimerBadge"><i></i></span>
  </div>`;

  if(!document.getElementById('memoOwlStyle')){
    const style=document.createElement('style');style.id='memoOwlStyle';
    style.textContent=`
      .memoContextOwl{position:relative;width:190px;height:210px;isolation:isolate;--memo-brown:#b07850;--memo-dark:#774932;--memo-face:#bd8157;--memo-mid:#895538;--memo-cream:#f4ddbf;--memo-eye:#fff6e9;--memo-eye-ring:#e6c39c;--memo-iris:#8b4d25;--memo-pupil:#4c2b1e;--memo-orange:#efa03e}
      .memoCtxSvg{display:block;width:100%;height:100%;overflow:visible}
      .memoCtxShadow{fill:rgba(60,38,28,.15)}
      .memoCtxCharacter{transform-origin:92px 188px;transition:transform .38s ease}
      .memoCtxBack{fill:var(--memo-brown)}
      .memoCtxBelly{fill:var(--memo-cream)}
      .memoCtxBrow{fill:var(--memo-face)}
      .memoCtxEyeCream{fill:var(--memo-eye);stroke:var(--memo-eye-ring);stroke-width:5}
      .memoCtxIris{fill:var(--memo-iris)}.memoCtxPupil{fill:var(--memo-pupil)}.memoCtxGlint{fill:#fff}
      .memoCtxBeak{fill:var(--memo-orange)}.memoCtxSmile{fill:#d96e52}
      .memoCtxWingLeft,.memoCtxWingRight{fill:var(--memo-mid);transform-box:fill-box;transition:transform .4s cubic-bezier(.2,.8,.2,1)}
      .memoCtxWingLeft{transform-origin:85% 20%}.memoCtxWingRight{transform-origin:10% 75%}
      .memoCtxFeatherLine{fill:none;stroke:#774932;stroke-width:3;stroke-linecap:round;opacity:.35}
      .memoCtxLeg{fill:none;stroke:var(--memo-orange);stroke-width:6;stroke-linecap:round}.memoCtxFoot{fill:none;stroke:var(--memo-orange);stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
      .memoCtxFace{transform-box:fill-box;transform-origin:center;transition:transform .35s ease}.memoCtxIris,.memoCtxPupil,.memoCtxGlint{transition:transform .3s ease}
      .memoCtxTimerBadge{display:none;position:absolute;z-index:8;right:13px;bottom:21px;width:36px;height:36px;border-radius:50%;box-sizing:border-box;background:#fff9e9;border:3px solid #6559a9;box-shadow:0 4px 0 rgba(92,81,155,.18)}
      .memoCtxTimerBadge:before{content:"";position:absolute;left:11px;top:-8px;width:8px;height:7px;border-radius:4px 4px 0 0;background:#6559a9}.memoCtxTimerBadge:after{content:"";position:absolute;left:15px;top:7px;width:2px;height:10px;border-radius:2px;background:#6559a9;transform-origin:bottom;transform:rotate(-35deg)}.memoCtxTimerBadge i{position:absolute;left:15px;top:16px;width:8px;height:2px;border-radius:2px;background:#6559a9}

      /* Chapitres : le grand hibou expressif de la maquette, sans livre. */
      .memoContextOwl.pose-chapter .memoCtxCharacter{transform:rotate(-2deg)}
      .memoContextOwl.pose-chapter .memoCtxFace{transform:rotate(4deg) translate(3px,-1px)}
      .memoContextOwl.pose-chapter .memoCtxIris,.memoContextOwl.pose-chapter .memoCtxPupil,.memoContextOwl.pose-chapter .memoCtxGlint{transform:translate(2px,1px)}
      .memoContextOwl.pose-chapter .memoCtxWingRight{transform:rotate(-4deg) translate(2px,-3px)}

      /* Chrono : même personnage, plus compact, avec son petit chrono. */
      .memoContextOwl.pose-ready .memoCtxTimerBadge,.memoContextOwl.pose-running .memoCtxTimerBadge,.memoContextOwl.pose-pause .memoCtxTimerBadge,.memoContextOwl.pose-finished .memoCtxTimerBadge{display:block}
      .memoContextOwl.pose-ready .memoCtxFace{transform:rotate(-3deg)}.memoContextOwl.pose-ready .memoCtxWingRight{transform:rotate(10deg)}
      .memoContextOwl.pose-running .memoCtxCharacter{transform:rotate(2deg) translateY(-2px)}.memoContextOwl.pose-running .memoCtxWingRight{transform:rotate(-12deg) translateY(-5px)}.memoContextOwl.pose-running .memoCtxWingLeft{transform:rotate(8deg)}
      .memoContextOwl.pose-pause .memoCtxFace{transform:rotate(-7deg) translateY(2px)}.memoContextOwl.pose-pause .memoCtxWingRight{transform:rotate(22deg) translateY(5px)}
      .memoContextOwl.pose-finished .memoCtxCharacter{transform:translateY(-5px)}.memoContextOwl.pose-finished .memoCtxWingLeft{transform:rotate(35deg) translate(-4px,-4px)}.memoContextOwl.pose-finished .memoCtxWingRight{transform:rotate(-18deg) translate(4px,-8px)}

      .memoOwlChapter{position:relative;display:flex;align-items:center;gap:34px;width:min(880px,100%);min-height:238px;box-sizing:border-box;margin:26px 0 14px;padding:18px 38px 18px 24px;border:1px solid #e4d7c7;border-radius:28px;background:linear-gradient(135deg,color-mix(in srgb,#f6efe3 72%,var(--panel)),var(--panel));box-shadow:0 12px 34px rgba(80,48,30,.075);overflow:hidden}
      .memoOwlChapter:after{content:"";position:absolute;width:250px;height:250px;border-radius:50%;right:-110px;top:-145px;background:rgba(176,120,80,.055);pointer-events:none}
      .memoOwlChapter .memoOwlMascot{width:230px;height:218px;flex:0 0 230px;display:grid;place-items:center;filter:drop-shadow(0 13px 12px rgba(80,48,30,.13))}
      .memoOwlChapter .memoContextOwl{transform:scale(1.02);transform-origin:center}
      .memoOwlChapterText{min-width:0;position:relative;z-index:2}.memoOwlChapterText small{display:block;margin-bottom:10px;color:#9b603f;font-size:10px;font-weight:900;letter-spacing:.13em}.memoOwlChapterText p{margin:0;color:var(--text);font-size:clamp(20px,2.4vw,27px);font-weight:800;line-height:1.25;letter-spacing:-.025em}.memoOwlChapterText span{display:block;margin-top:11px;color:var(--muted);font-size:11px;font-weight:650}
      .memoOwlTimer{display:flex;align-items:center;gap:12px;margin:13px 0 -4px;padding:10px 12px;border-radius:14px;background:linear-gradient(135deg,#f7efe4,var(--panel));border:1px solid #e4d7c7}.memoOwlTimer .memoOwlMascot{position:relative;width:72px;height:70px;flex:0 0 72px;overflow:visible}.memoOwlTimer .memoContextOwl{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.34);transform-origin:center}.memoOwlTimer p{margin:0;font-size:10px;font-weight:800;line-height:1.4;color:var(--text)}.workTimerPanel.running .memoOwlTimer{border-color:#c9ab8e}.workTimerPanel.finished .memoOwlTimer{background:rgba(54,184,121,.1);border-color:rgba(54,184,121,.25)}
      .dark .memoOwlChapter,.dark .memoOwlTimer{background:linear-gradient(135deg,#292622,var(--panel));border-color:#4b4037}
      @media(max-width:650px){.memoOwlChapter{min-height:170px;margin-top:18px;padding:12px 16px;gap:12px;border-radius:22px}.memoOwlChapter .memoOwlMascot{width:135px;height:145px;flex-basis:135px}.memoOwlChapter .memoContextOwl{transform:scale(.68)}.memoOwlChapterText p{font-size:16px}.memoOwlChapterText span{font-size:9px}}
      @media(prefers-reduced-motion:reduce){.memoCtxCharacter,.memoCtxFace,.memoCtxWingLeft,.memoCtxWingRight,.memoCtxIris,.memoCtxPupil,.memoCtxGlint{transition:none}}
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