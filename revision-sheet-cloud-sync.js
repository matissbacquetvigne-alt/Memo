(()=>{
/* La synchronisation des fiches est désormais intégrée directement à revision-sheet.js.
   Ce fichier reste chargé pour compatibilité et initialise aussi les outils visuels liés aux fiches. */
if(!document.querySelector('script[data-memo-schemat]')){
 const s=document.createElement('script');
 s.src='schemat.js';
 s.async=false;
 s.dataset.memoSchemat='1';
 document.body.appendChild(s);
}
})();