(()=>{const s=document.createElement('style');s.textContent=`
:root{--memo-motion:cubic-bezier(.2,.75,.25,1);--memo-fast:160ms;--memo-normal:280ms}
.view.on{animation:memoViewIn var(--memo-normal) var(--memo-motion) both}
.view.on>.hero,.view.on>.bar,.view.on>.title,.view.on>.chapterHubHead,.view.on>.chapterTools,.view.on>.deckSearch,.view.on>#cards,.view.on>.calendarTop,.view.on>.plannerLayout,.view.on>.sheetTop,.view.on>.courseTop,.view.on>.courseModeTabs{animation:memoRiseIn 340ms var(--memo-motion) both}
.view.on>.chapterTools,.view.on>#cards,.view.on>.plannerLayout{animation-delay:35ms}
.tile,.chapterTool,button,.soft,.primary,input,textarea,.sheetTab,.courseModeTabs button{transition:transform var(--memo-fast) var(--memo-motion),box-shadow 220ms ease,border-color 200ms ease,background-color 200ms ease,color 180ms ease,opacity 180ms ease}
.tile:active,.chapterTool:active{transform:scale(.985)}button:active{transform:scale(.97)}
dialog[open]{animation:memoDialogIn 240ms var(--memo-motion) both}
dialog::backdrop{animation:memoBackdropIn 200ms ease both}
.memoNotesPanel:not([hidden]){animation:memoPanelIn 260ms var(--memo-motion) both}
.sheetZoom:not([hidden]){animation:memoBackdropIn 220ms ease both}.sheetZoom:not([hidden]) .sheetZoomContent{animation:memoZoomIn 280ms var(--memo-motion) both}
.courseModeTabs button.on,.sheetTab.on{animation:memoSelect 180ms var(--memo-motion) both}
@media(hover:hover) and (pointer:fine){.tile:hover,.chapterTool:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(36,34,70,.11)}button:hover{transform:translateY(-1px)}}
@keyframes memoViewIn{from{opacity:.35;transform:translateY(3px)}to{opacity:1;transform:none}}
@keyframes memoRiseIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes memoDialogIn{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}
@keyframes memoBackdropIn{from{opacity:0}to{opacity:1}}
@keyframes memoPanelIn{from{opacity:0;transform:translateX(18px) scale(.99)}to{opacity:1;transform:none}}
@keyframes memoZoomIn{from{opacity:0;transform:scale(.965)}to{opacity:1;transform:none}}
@keyframes memoSelect{from{transform:scale(.97)}to{transform:scale(1)}}
@media(prefers-reduced-motion:reduce){.view.on,.view.on>*,dialog[open],dialog::backdrop,.memoNotesPanel:not([hidden]),.sheetZoom:not([hidden]),.sheetZoom:not([hidden]) .sheetZoomContent,.courseModeTabs button.on,.sheetTab.on{animation:none!important}.tile,.chapterTool,button,.soft,.primary,input,textarea,.sheetTab,.courseModeTabs button{transition:none!important}}
`;document.head.appendChild(s);if(!document.querySelector('script[data-memo-owl]')){const o=document.createElement('script');o.src='memo-owl.js';o.dataset.memoOwl='1';document.head.appendChild(o)}})();