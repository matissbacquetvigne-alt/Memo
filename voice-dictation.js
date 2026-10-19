(()=>{
  let tries=0;
  function init(){
    const text=document.getElementById('recallText'),bar=document.querySelector('#recallAI .recallBar'),correct=document.getElementById('recallCorrect');
    if(!text||!bar||!correct){if(tries++<30)setTimeout(init,150);return}
    if(document.getElementById('recallVoice'))return;

    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const btn=document.createElement('button');
    btn.type='button';btn.id='recallVoice';btn.className='soft recallVoice';btn.innerHTML='<span aria-hidden="true">🎙</span> Dicter';
    btn.title='Dicter ta rédaction en français';
    bar.insertBefore(btn,correct);

    const style=document.createElement('style');
    style.textContent=`.recallVoice{min-width:112px;display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap}.recallVoice.listening{color:#c53d49;border-color:rgba(197,61,73,.45);background:rgba(197,61,73,.09)}.recallVoice.listening span{animation:memoMicPulse 1s ease-in-out infinite}@keyframes memoMicPulse{50%{transform:scale(1.18);opacity:.55}}@media(max-width:700px){.recallVoice{width:100%}}`;
    document.head.appendChild(style);

    if(!SR){btn.disabled=true;btn.textContent='🎙 Dictée indisponible';btn.title='La reconnaissance vocale n’est pas disponible dans ce navigateur.';return}

    const rec=new SR();
    rec.lang='fr-FR';rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=1;
    let wanted=false,running=false,restartTimer=null;

    function ui(on){btn.classList.toggle('listening',on);btn.innerHTML=on?'<span aria-hidden="true">●</span> Écoute…':'<span aria-hidden="true">🎙</span> Dicter';btn.setAttribute('aria-pressed',on?'true':'false')}
    function add(words){
      words=String(words||'').trim();if(!words)return;
      const a=Number.isFinite(text.selectionStart)?text.selectionStart:text.value.length,b=Number.isFinite(text.selectionEnd)?text.selectionEnd:a;
      const before=text.value.slice(0,a),after=text.value.slice(b);
      const prefix=before&&!/\s$/.test(before)?' ':'',suffix=after&&!/^\s/.test(after)?' ':'';
      text.setRangeText(prefix+words+suffix,a,b,'end');
      text.dispatchEvent(new Event('input',{bubbles:true}));
      text.focus();
    }
    function start(){
      if(running)return;wanted=true;ui(true);
      try{rec.start()}catch(e){if(e?.name!=='InvalidStateError'){wanted=false;ui(false);alert('Impossible de démarrer la dictée vocale.')}}
    }
    function stop(){wanted=false;clearTimeout(restartTimer);ui(false);if(running){try{rec.stop()}catch{}}}

    rec.onstart=()=>{running=true;ui(true)};
    rec.onresult=e=>{let final='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)final+=(final?' ':'')+e.results[i][0].transcript;if(final)add(final)};
    rec.onerror=e=>{
      const fatal=['not-allowed','service-not-allowed','audio-capture','network','language-not-supported'].includes(e.error);
      if(fatal){wanted=false;ui(false)}
      if(e.error==='not-allowed'||e.error==='service-not-allowed')alert('Autorise le microphone et la reconnaissance vocale pour Memo, puis réessaie.');
      else if(e.error==='audio-capture')alert('Memo ne parvient pas à accéder au microphone.');
      else if(e.error==='network')alert('La reconnaissance vocale a besoin d’une connexion pour fonctionner sur cet appareil.');
    };
    rec.onend=()=>{running=false;if(wanted){clearTimeout(restartTimer);restartTimer=setTimeout(()=>{if(wanted)try{rec.start()}catch{}},220)}else ui(false)};
    btn.onclick=()=>wanted?stop():start();
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
    document.getElementById('recallBack')?.addEventListener('click',stop);
    correct.addEventListener('click',()=>{if(wanted)stop()},true);
  }
  setTimeout(init,0);
})();