(()=>{
/* Modules complémentaires chargés sans modifier le démarrage principal de Memo. */
function load(src,key){if(document.querySelector(`script[data-memo-${key}]`))return;const s=document.createElement('script');s.src=src;s.async=false;s.dataset['memo'+key[0].toUpperCase()+key.slice(1)]='1';document.body.appendChild(s)}

/* Le zoom doit vivre directement sous <body> : sur iPad, un position:fixed placé
   dans une vue animée/transformée est calculé par rapport à cette vue au lieu de
   l'écran, ce qui le décale et le réduit. */
function fixRevisionSheetZoomRoot(){
  const zoom=document.getElementById('sheetZoom');
  if(zoom&&zoom.parentElement!==document.body)document.body.appendChild(zoom);
}
fixRevisionSheetZoomRoot();

load('voice-dictation.js?v=20261019-1','voice');
load('course.js?v=20261019-3','course');
load('course-pdf-ipad.js?v=20261019-2','coursePdfIpad');
load('course-notes.js?v=20261019-1','courseNotes');
load('study-notes.js?v=20261019-1','studyNotes');
load('home-mascot.js?v=20261019-1','homeMascot');
})();