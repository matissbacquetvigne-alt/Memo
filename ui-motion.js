(()=>{const s=document.createElement('style');s.textContent=`
:root{--memo-motion:cubic-bezier(.22,.72,.28,1)}
.view.on{animation:memoFadeIn .24s var(--memo-motion) both}
.view.on>.hero,.view.on>.bar,.view.on>.title,.view.on>.chapterHubHead,.view.on>.chapterTools,.view.on>.deckSearch,.view.on>#cards,.view.on>.calendarTop,.view.on>.plannerLayout{animation:memoRiseIn .28s var(--memo-motion) both}
.tile,.chapterTool,button{transition:transform .14s var(--memo-motion),box-shadow .18s ease,border-color .18s ease}
.tile:active,.chapterTool:active{transform:scale(.988)}
button:active{transform:scale(.975)}
dialog[open]{animation:memoDialogIn .2s var(--memo-motion) both}
@media(hover:hover) and (pointer:fine){.tile:hover,.chapterTool:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(36,34,70,.1)}}
@keyframes memoFadeIn{from{opacity:.65}to{opacity:1}}
@keyframes memoRiseIn{from{opacity:.55;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes memoDialogIn{from{opacity:0;transform:translateY(6px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}
@media(prefers-reduced-motion:reduce){.view.on,.view.on>*,dialog[open]{animation:none!important}.tile,.chapterTool,button{transition:none!important}}
`;document.head.appendChild(s)})();