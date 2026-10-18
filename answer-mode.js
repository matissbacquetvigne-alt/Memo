(()=>{
  const flash=document.getElementById("flash");
  if(!flash)return;

  const style=document.createElement("style");
  style.textContent=`
    .writtenAnswer{max-width:760px;margin:-4px auto 18px}
    .writtenAnswerBox{background:var(--panel);border:1px solid var(--line);border-radius:17px;padding:15px 16px;box-shadow:0 5px 18px rgba(36,34,70,.05)}
    .writtenAnswerHead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
    .writtenAnswerHead b{font-size:14px}
    .writtenAnswerHead small{color:var(--muted);font-size:11px}
    #writtenAnswerInput{min-height:92px;resize:vertical;line-height:1.5;padding:13px 14px;background:var(--bg)}
    .writtenCompare{border-left:4px solid var(--accent)}
    .writtenCompareLabel{display:block;color:var(--accent);font-size:11px;font-weight:700;letter-spacing:.08em;margin-bottom:8px}
    #writtenAnswerPreview{margin:0;color:var(--text);font-size:15px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}
    .writtenEmpty{color:var(--muted)!important;font-style:italic}
    @media(max-width:650px){.writtenAnswer{margin-top:-2px}.writtenAnswerBox{padding:13px}#writtenAnswerInput{min-height:82px}}
  `;
  document.head.appendChild(style);

  const wrap=document.createElement("div");
  wrap.id="writtenAnswer";
  wrap.className="writtenAnswer";
  wrap.innerHTML=`
    <div id="writtenAnswerEntry" class="writtenAnswerBox">
      <div class="writtenAnswerHead"><b>✎ Ta réponse</b><small>Facultatif</small></div>
      <textarea id="writtenAnswerInput" placeholder="Écris ta réponse avant de retourner la carte…"></textarea>
    </div>
    <div id="writtenAnswerCompare" class="writtenAnswerBox writtenCompare" hidden>
      <span class="writtenCompareLabel">TA RÉPONSE</span>
      <p id="writtenAnswerPreview"></p>
    </div>`;
  flash.insertAdjacentElement("afterend",wrap);

  const entry=document.getElementById("writtenAnswerEntry"),compare=document.getElementById("writtenAnswerCompare"),input=document.getElementById("writtenAnswerInput"),preview=document.getElementById("writtenAnswerPreview");
  let answers={},lastSession=null;

  function currentCard(){return typeof session!=="undefined"&&session&&session.cards&&session.i<session.cards.length?session.cards[session.i]:null}
  function syncAnswerUI(){
    if(typeof session==="undefined"||!session){wrap.hidden=true;return}
    if(session!==lastSession){answers={};lastSession=session}
    const card=currentCard();
    if(!card){wrap.hidden=true;return}
    wrap.hidden=false;
    const saved=answers[card.id]||"";
    if(typeof flipped!=="undefined"&&flipped){
      if(document.activeElement===input)input.blur();
      entry.hidden=true;compare.hidden=false;
      preview.textContent=saved||"Aucune réponse écrite.";
      preview.classList.toggle("writtenEmpty",!saved);
    }else{
      compare.hidden=true;entry.hidden=false;
      if(input.dataset.card!==String(card.id)){
        input.dataset.card=String(card.id);
        input.value=saved;
      }
    }
  }

  input.addEventListener("input",()=>{const card=currentCard();if(card)answers[card.id]=input.value});
  input.addEventListener("click",e=>e.stopPropagation());
  input.addEventListener("pointerdown",e=>e.stopPropagation());

  if(typeof review==="function"){
    const baseReview=review;
    review=function(){baseReview();syncAnswerUI()};
  }
  flash.addEventListener("click",()=>setTimeout(syncAnswerUI,0));
  document.body.addEventListener("click",e=>{if(e.target.closest("[data-study],[data-rate]"))setTimeout(syncAnswerUI,0)});
  syncAnswerUI();
})();