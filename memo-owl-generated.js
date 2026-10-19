(()=>{
  // Compatibility bootstrap: contextual owl stays disabled; load the diagram entry point.
  if(document.querySelector('script[data-memo-schemat-loader]'))return;
  const s=document.createElement('script');s.src='schemat-loader.js';s.async=false;s.dataset.memoSchematLoader='1';document.body.appendChild(s);
})();
