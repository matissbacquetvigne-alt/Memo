(()=>{
  const flash=document.getElementById("flash");
  if(!flash)return;

  const style=document.createElement("style");
  style.textContent=`
    .reviewView{perspective:1400px}
    #flash{transform-style:preserve-3d;will-change:transform,box-shadow;backface-visibility:hidden;-webkit-backface-visibility:hidden}
    #flash.memoFlipFirst{transition:transform .20s cubic-bezier(.45,.05,.55,.95),box-shadow .20s ease;transform:perspective(1200px) rotateY(90deg) scale(.975);box-shadow:0 4px 12px rgba(36,34,70,.05)}
    #flash.memoFlipSecond{transition:none;transform:perspective(1200px) rotateY(-90deg) scale(.975)}
    #flash.memoFlipOpen{transition:transform .24s cubic-bezier(.2,.7,.25,1),box-shadow .24s ease;transform:perspective(1200px) rotateY(0deg) scale(1);box-shadow:var(--shadow)}
    @media(prefers-reduced-motion:reduce){#flash.memoFlipFirst,#flash.memoFlipSecond,#flash.memoFlipOpen{transition:none!important;transform:none!important}}
  `;
  document.head.appendChild(style);

  let busy=false;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  function rememberWrittenAnswer(){
    if(typeof session==="undefined"||!session||session.i>=session.cards.length)return;
    if(typeof flipped!=="undefined"&&flipped)return;
    const input=document.getElementById("writtenAnswerInput");
    if(!input)return;
    const text=input.value.trim();
    if(!text)return;
    const card=session.cards[session.i];
    card.lastWrittenAnswer=text;
    card.lastWrittenAnswerAt=Date.now();
    if(typeof save==="function")save();
  }

  flash.addEventListener("click",async e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    if(busy||typeof session==="undefined"||!session||session.i>=session.cards.length)return;
    busy=true;

    const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(!reduce){
      flash.classList.remove("memoFlipSecond","memoFlipOpen");
      flash.classList.add("memoFlipFirst");
      await wait(200);
    }

    if(typeof flipped!=="undefined"&&!flipped)rememberWrittenAnswer();
    flipped=!flipped;
    if(typeof review==="function")review();

    if(!reduce){
      flash.classList.remove("memoFlipFirst");
      flash.classList.add("memoFlipSecond");
      void flash.offsetWidth;
      requestAnimationFrame(()=>{
        flash.classList.remove("memoFlipSecond");
        flash.classList.add("memoFlipOpen");
      });
      await wait(250);
      flash.classList.remove("memoFlipOpen");
    }
    busy=false;
  },true);
})();