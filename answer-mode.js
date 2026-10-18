(()=>{
  const flash=document.getElementById("flash");
  if(!flash)return;

  const style=document.createElement("style");
  style.textContent=`
    .writtenAnswer{max-width:760px;margin:-4px auto 18px}
    .writtenAnswerBox{background:var(--panel);border:1px solid var(--line);border-radius:17px;padding:15px 16px;box-shadow:0 5px 18px rgba(36,34,70,.05)}
    .writtenAnswerHead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
    .writtenAnswerHead b{font-size:14px}.writtenAnswerHead small{color:var(--muted);font-size:11px}
    #writtenAnswerInput{min-height:92px;resize:vertical;line-height:1.5;padding:13px 14px;background:var(--bg)}
    .writtenCompare{border-left:4px solid var(--accent)}
    .writtenCompareLabel{display:block;color:var(--accent);font-size:11px;font-weight:700;letter-spacing:.08em;margin-bottom:8px}
    #writtenAnswerPreview{margin:0;color:var(--text);font-size:15px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}
    .writtenEmpty{color:var(--muted)!important;font-style:italic}
    #cards .row[data-answer-card]{cursor:pointer;-webkit-user-select:none;user-select:none}
    #cards .row[data-answer-card]:hover{border-color:#7770d9;box-shadow:0 5px 16px rgba(36,34,70,.08)}
    .answerHistoryDlg{width:min(650px,calc(100% - 28px));padding:24px}
    .answerHistoryDlg h3{font-size:23px;margin-bottom:5px}.answerHistoryDlg>p{font-size:13px;margin-bottom:18px}
    .answerHistoryGrid{display:grid;gap:12px}.answerHistoryBlock{border:1px solid var(--line);border-radius:15px;padding:15px 16px;background:var(--bg)}
    .answerHistoryBlock.user{border-left:4px solid var(--accent)}.answerHistoryBlock.expected{border-left:4px solid #35b976}
    .answerHistoryBlock small{display:block;font-size:10px;font-weight:700;letter-spacing:.09em;color:var(--muted);margin-bottom:7px}
    .answerHistoryBlock.user small{color:var(--accent)}.answerHistoryBlock.expected small{color:#35a66d}
    .answerHistoryBlock p{margin:0;color:var(--text);white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55}
    .answerHistoryClose{width:100%;margin-top:15px}
    @media(max-width:650px){.writtenAnswer{margin-top:-2px}.writtenAnswerBox{padding:13px}#writtenAnswerInput{min-height:82px}.answerHistoryDlg{padding:19px}}
  `;
  document.head.appendChild(style);

  const wrap=document.createElement("div");
  wrap.id="writtenAnswer";wrap.className="writtenAnswer";
  wrap.innerHTML=`<div id="writtenAnswerEntry" class="writtenAnswerBox"><div class="writtenAnswerHead"><b>✎ Ta réponse</b><small>Facultatif</small></div><textarea id="writtenAnswerInput" placeholder="Écris ta réponse avant de retourner la carte…"></textarea></div><div id="writtenAnswerCompare" class="writtenAnswerBox writtenCompare" hidden><span class="writtenCompareLabel">TA RÉPONSE</span><p id="writtenAnswerPreview"></p></div>`;
  flash.insertAdjacentElement("afterend",wrap);

  const dlg=document.createElement("dialog");
  dlg.className="answerHistoryDlg";
  dlg.innerHTML=`<h3 id="answerHistoryTitle"></h3><p>Compare ta dernière réponse écrite avec la réponse attendue.</p><div class="answerHistoryGrid"><div class="answerHistoryBlock user"><small>TA DERNIÈRE RÉPONSE</small><p id="answerHistoryUser"></p></div><div class="answerHistoryBlock expected"><small>RÉPONSE ATTENDUE</small><p id="answerHistoryExpected"></p></div></div><button type="button" id="answerHistoryClose" class="soft answerHistoryClose">Fermer</button>`;
  document.body.appendChild(dlg);

  const entry=document.getElementById("writtenAnswerEntry"),compare=document.getElementById("writtenAnswerCompare"),input=document.getElementById("writtenAnswerInput"),preview=document.getElementById("writtenAnswerPreview");
  let answers={},lastSession=null;

  function currentCard(){return typeof session!=="undefined"&&session&&session.cards&&session.i<session.cards.length?session.cards[session.i]:null}
  function persistCurrentAnswer(){
    const card=currentCard();if(!card)return;
    const text=(answers[card.id]||input.value||"").trim();
    if(!text)return;
    card.lastWrittenAnswer=text;card.lastWrittenAnswerAt=Date.now();
    if(typeof save==="function")save();
  }
  function syncAnswerUI(){
    if(typeof session==="undefined"||!session){wrap.hidden=true;return}
    if(session!==lastSession){answers={};lastSession=session;input.dataset.card="";input.value=""}
    const card=currentCard();if(!card){wrap.hidden=true;return}
    wrap.hidden=false;const current=answers[card.id]||"";
    if(typeof flipped!=="undefined"&&flipped){
      if(document.activeElement===input)input.blur();entry.hidden=true;compare.hidden=false;
      preview.textContent=current||"Aucune réponse écrite.";preview.classList.toggle("writtenEmpty",!current);
    }else{
      compare.hidden=true;entry.hidden=false;
      if(input.dataset.card!==String(card.id)){input.dataset.card=String(card.id);input.value=current}
    }
  }

  input.addEventListener("input",()=>{const card=currentCard();if(card)answers[card.id]=input.value});
  input.addEventListener("click",e=>e.stopPropagation());input.addEventListener("pointerdown",e=>e.stopPropagation());

  if(typeof cardRow==="function"){
    const baseCardRow=cardRow;
    cardRow=function(c){return baseCardRow(c).replace('<div class="row">',`<div class="row" data-answer-card="${String(c.id)}" title="Voir la dernière réponse écrite">`)};
  }
  if(typeof review==="function"){
    const baseReview=review;review=function(){baseReview();syncAnswerUI()};
  }

  flash.addEventListener("click",()=>{setTimeout(()=>{if(typeof flipped!=="undefined"&&flipped)persistCurrentAnswer();syncAnswerUI()},0)});
  document.body.addEventListener("click",e=>{
    const row=e.target.closest("#cards .row[data-answer-card]");
    if(row&&!e.target.closest("button")){
      const card=typeof D==="function"?D()?.cards.find(c=>String(c.id)===row.dataset.answerCard):null;
      if(card){
        document.getElementById("answerHistoryTitle").textContent=card.front;
        const user=document.getElementById("answerHistoryUser");
        user.textContent=card.lastWrittenAnswer||"Aucune réponse écrite enregistrée pour cette carte.";
        user.classList.toggle("writtenEmpty",!card.lastWrittenAnswer);
        document.getElementById("answerHistoryExpected").textContent=card.back;
        dlg.showModal();
      }
      return;
    }
    if(e.target.closest("[data-study],[data-rate]"))setTimeout(syncAnswerUI,0);
  });
  document.getElementById("answerHistoryClose").onclick=()=>dlg.close();
  dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
  syncAnswerUI();
})();