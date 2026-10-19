(()=>{
  // High-resolution owl artwork loader.
  // The previous embedded source was only 93×96 px and became blurry when enlarged.
  const apply=()=>{
    const chapter=document.querySelector('#memoOwlChapter .memoOwlMascot,.memoOwlChapter .memoOwlMascot');
    if(!chapter)return false;
    const existing=chapter.querySelector('.memoGeneratedChapterOwl');
    if(existing){
      existing.style.imageRendering='auto';
      existing.style.width='min(100%,180px)';
      existing.style.maxWidth='180px';
    }
    if(!document.getElementById('memoGeneratedOwlSharpStyle')){
      const s=document.createElement('style');
      s.id='memoGeneratedOwlSharpStyle';
      s.textContent=`.memoGeneratedChapterOwl{image-rendering:auto!important;width:min(100%,180px)!important;max-width:180px!important;height:auto!important}@media(max-width:650px){.memoGeneratedChapterOwl{width:min(100%,150px)!important;max-width:150px!important}}`;
      document.head.appendChild(s);
    }
    return true;
  };
  if(!apply()){let n=0;const t=setInterval(()=>{n++;if(apply()||n>40)clearInterval(t)},100)}
})();