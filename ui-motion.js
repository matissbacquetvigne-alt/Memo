(()=>{
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const style=document.createElement("style");
  style.textContent=`
    :root{--memo-ease:cubic-bezier(.22,.8,.28,1)}
    body{overflow-x:hidden}
    .tile,.chapterToolCard,.cardCompartment,.agendaItem,.calendarDay,button,.iconButton,.searchWrap input{transition:transform .2s var(--memo-ease),box-shadow .2s var(--memo-ease),border-color .2s var(--memo-ease),background-color .2s var(--memo-ease),opacity .2s var(--memo-ease)}
    .tile:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(36,34,70,.12)}
    .tile:active,.chapterToolCard:active{transform:translateY(-1px) scale(.985)}
    button:active{transform:scale(.965)}
    .primary:hover{box-shadow:0 8px 20px rgba(98,84,232,.23);transform:translateY(-1px)}
    .iconButton:hover{transform:translateY(-2px) rotate(-2deg)}
    .logo{transition:transform .35s var(--memo-ease),box-shadow .35s var(--memo-ease)}
    .brand:hover .logo{transform:rotate(-5deg) scale(1.05);box-shadow:0 8px 20px rgba(98,84,232,.25)}
    .searchWrap:focus-within{transform:translateY(-1px)}
    .searchWrap{transition:transform .2s var(--memo-ease)}
    dialog[open]{animation:memoDialogIn .24s var(--memo-ease) both}
    dialog[open]::backdrop{animation:memoBackdropIn .2s ease both}
    .compartmentCards{transform-origin:top center}
    .cardCompartment:not(.folded) .compartmentCards{animation:memoUnfold .22s var(--memo-ease) both}
    .calendarDay:not(.pastDay):hover{transform:translateY(-2px);box-shadow:0 6px 15px rgba(36,34,70,.08)}
    .memo-ripple{position:fixed;z-index:9999;width:10px;height:10px;border-radius:999px;pointer-events:none;background:rgba(98,84,232,.16);transform:translate(-50%,-50%) scale(0);animation:memoRipple .48s ease-out forwards}
    @keyframes memoDialogIn{from{opacity:0;transform:translateY(12px) scale(.975)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes memoBackdropIn{from{background:#0000}to{background:#0008}}
    @keyframes memoUnfold{from{opacity:.2;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes memoRipple{0%{opacity:.8;transform:translate(-50%,-50%) scale(0)}100%{opacity:0;transform:translate(-50%,-50%) scale(16)}}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.001ms!important}.memo-ripple{display:none!important}}
  `;
  document.head.appendChild(style);
  if(reduce)return;

  const rank={home:0,subject:1,chapterHub:2,deck:3,review:4,calendar:1};
  let current=document.querySelector(".view.on")?.id||"home",busy=false;

  function animatePage(el,fromId){
    if(!el||busy)return;
    const toId=el.id,fromRank=rank[fromId]??0,toRank=rank[toId]??0;
    let x=toRank>=fromRank?28:-28;
    let y=5;
    if(toId==="calendar"||fromId==="calendar"){x=0;y=18}
    busy=true;
    el.animate([
      {opacity:0,transform:`translate(${x}px,${y}px) scale(.992)`},
      {opacity:1,transform:"translate(0,0) scale(1)"}
    ],{duration:300,easing:"cubic-bezier(.22,.8,.28,1)",fill:"none"}).finished.finally(()=>busy=false);
    const lead=el.querySelector("h2,h3");
    if(lead)lead.animate([{opacity:.25,transform:`translateX(${x*.45}px)`},{opacity:1,transform:"translateX(0)"}],{duration:360,easing:"cubic-bezier(.22,.8,.28,1)"});
  }

  const pageObserver=new MutationObserver(records=>{
    for(const r of records){
      const el=r.target;
      if(el.classList?.contains("view")&&el.classList.contains("on")&&el.id!==current){
        const old=current;current=el.id;animatePage(el,old);break;
      }
    }
  });
  document.querySelectorAll(".view").forEach(v=>pageObserver.observe(v,{attributes:true,attributeFilter:["class"]}));

  function stagger(container,selector){
    const items=[...container.querySelectorAll(selector)].filter(x=>!x.dataset.memoAnimated);
    items.slice(0,18).forEach((el,i)=>{
      el.dataset.memoAnimated="1";
      el.animate([
        {opacity:0,transform:"translateY(12px) scale(.985)"},
        {opacity:1,transform:"translateY(0) scale(1)"}
      ],{duration:260,delay:Math.min(i*38,260),easing:"cubic-bezier(.22,.8,.28,1)",fill:"backwards"});
    });
  }

  const zones=[
    [document.getElementById("subjects"),".tile"],
    [document.getElementById("decks"),".tile"],
    [document.getElementById("cards"),".cardCompartment"],
    [document.getElementById("agendaList"),".agendaItem"],
    [document.getElementById("calendarGrid"),".calendarDay"]
  ];
  zones.forEach(([zone,sel])=>{if(!zone)return;const run=()=>requestAnimationFrame(()=>stagger(zone,sel));new MutationObserver(run).observe(zone,{childList:true,subtree:true});run()});

  document.addEventListener("pointerdown",e=>{
    const target=e.target.closest(".tile,.chapterToolCard,.primary,.soft,.ghost,.calendarDay");
    if(!target||target.matches("input,label"))return;
    const r=document.createElement("span");r.className="memo-ripple";r.style.left=e.clientX+"px";r.style.top=e.clientY+"px";document.body.appendChild(r);setTimeout(()=>r.remove(),520);
  },{passive:true});

  document.addEventListener("click",e=>{
    const tile=e.target.closest(".tile,.chapterToolCard");
    if(tile)tile.animate([{transform:"scale(1)"},{transform:"scale(.975)"},{transform:"scale(1)"}],{duration:180,easing:"ease-out"});
  });
})();