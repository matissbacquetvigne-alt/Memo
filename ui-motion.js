(()=>{
  const style=document.createElement("style");
  style.textContent=`
    :root{--motion-ease:cubic-bezier(.2,.7,.25,1)}

    /* Navigation : animation volontairement simple et GPU-friendly. */
    .view.on{animation:memoViewFade .24s var(--motion-ease) both}
    .view.on>.hero,.view.on>.bar,.view.on>.sectionLabel,.view.on>.title,.view.on>.grid,.view.on>.chapterHubHead,.view.on>.chapterToolsLabel,.view.on>.chapterToolsGrid,.view.on>.deckSearch,.view.on>#cards,.view.on>.calendarTop,.view.on>.plannerLayout{
      animation:memoContentIn .28s var(--motion-ease) both;
    }

    /* Petites réactions tactiles, sans observateurs ni animations en cascade. */
    .tile,.chapterToolCard,.primary,.soft,.ghost,.iconButton{
      -webkit-tap-highlight-color:transparent;
    }
    .tile,.chapterToolCard{
      transition:transform .16s var(--motion-ease),box-shadow .16s var(--motion-ease),border-color .16s ease;
    }
    button,.ghost,.iconButton{
      transition:transform .12s var(--motion-ease),box-shadow .16s ease,background-color .16s ease;
    }
    .tile:active,.chapterToolCard:active{transform:scale(.988)}
    button:active,.ghost:active{transform:scale(.975)}

    /* Les effets de survol ne sont utilisés que sur les appareils ayant une vraie souris. */
    @media(hover:hover) and (pointer:fine){
      .tile:hover,.chapterToolCard:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(36,34,70,.11)}
      .primary:hover{box-shadow:0 7px 18px rgba(98,84,232,.2)}
    }

    dialog[open]{animation:memoDialogIn .2s var(--motion-ease) both}
    dialog[open]::backdrop{animation:memoBackdropIn .18s ease-out both}

    @keyframes memoViewFade{
      from{opacity:.72}
      to{opacity:1}
    }
    @keyframes memoContentIn{
      from{opacity:.45;transform:translate3d(0,7px,0)}
      to{opacity:1;transform:translate3d(0,0,0)}
    }
    @keyframes memoDialogIn{
      from{opacity:0;transform:translate3d(0,7px,0) scale(.99)}
      to{opacity:1;transform:translate3d(0,0,0) scale(1)}
    }
    @keyframes memoBackdropIn{
      from{background:rgba(0,0,0,0)}
      to{background:rgba(0,0,0,.53)}
    }

    @media(prefers-reduced-motion:reduce){
      .view.on,.view.on>*,dialog[open],dialog[open]::backdrop{animation:none!important}
      .tile,.chapterToolCard,button,.ghost,.iconButton{transition:none!important}
    }
  `;
  document.head.appendChild(style);
})();