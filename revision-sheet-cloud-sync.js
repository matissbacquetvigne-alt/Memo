(()=>{
/* La synchronisation des fiches est désormais intégrée directement à revision-sheet.js.
   Ce fichier reste chargé pour compatibilité et initialise la dictée vocale de la rédaction. */
if(!document.querySelector('script[data-memo-voice]')){
 const s=document.createElement('script');
 s.src='voice-dictation.js?v=20261019-1';
 s.async=false;
 s.dataset.memoVoice='1';
 document.body.appendChild(s);
}
})();