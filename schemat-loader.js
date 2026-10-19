(()=>{
  const grid=document.querySelector('#chapterHub .chapterToolsGrid');if(!grid||document.getElementById('openSchemat'))return;
  const card=document.createElement('button');card.type='button';card.id='openSchemat';card.className='chapterToolCard schematToolCard';card.innerHTML=`<div class="schematHubIcon" aria-hidden="true"><span></span><i></i><b>✎</b></div><div class="chapterToolText"><small>DESSIN · MÉMORISATION VISUELLE</small><h3>Schémas</h3><p id="chapterSchematInfo">Dessine, annote et entraîne-toi à refaire tes schémas.</p></div>`;grid.appendChild(card);
  const style=document.createElement('style');style.textContent=`.schematToolCard{grid-template-columns:58px 1fr}.schematHubIcon{position:relative;width:52px;height:52px;border-radius:14px;background:var(--accent-soft);border:1.5px solid var(--accent);overflow:hidden}.schematHubIcon span{position:absolute;left:9px;top:12px;width:29px;height:22px;border:2px solid var(--accent);border-radius:50%;transform:rotate(-12deg)}.schematHubIcon i{position:absolute;left:13px;top:31px;width:26px;height:2px;background:var(--accent);transform:rotate(-28deg);transform-origin:left}.schematHubIcon b{position:absolute;right:4px;bottom:1px;color:var(--accent);font-size:18px}.schematToolCard:hover .schematHubIcon{transform:rotate(-2deg)}@media(max-width:650px){.schematToolCard{grid-template-columns:52px 1fr}.schematHubIcon{transform:scale(.9);transform-origin:left center}}`;document.head.appendChild(style);
  function refreshInfo(){const d=typeof D==='function'?D():null,info=document.getElementById('chapterSchematInfo');if(!d||!info)return;const n=Array.isArray(db?.schematics?.[d.id])?db.schematics[d.id].length:0;info.textContent=n?`${n} schéma${n>1?'s':''} enregistré${n>1?'s':''} · entraînement disponible`:'Dessine, annote et entraîne-toi à refaire tes schémas.'}
  const oldHub=window.chapterHub;if(typeof oldHub==='function')window.chapterHub=async(...args)=>{const r=await oldHub(...args);refreshInfo();return r};refreshInfo();
  let loading=null;function load(){if(window.memoOpenSchemat)return Promise.resolve();if(loading)return loading;loading=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='schemat.js';s.async=false;s.onload=resolve;s.onerror=()=>{loading=null;s.remove();reject(new Error('Chargement impossible'))};document.body.appendChild(s)});return loading}
  card.onclick=async()=>{try{await load();window.memoOpenSchemat?.()}catch{alert('Impossible de charger le module Schémas.')}};

  // Show saved chapter drawings in both course modes, without creating stale copies.
  function attachCourseGallery(){
  const course=document.getElementById('courseView');
  if(!course)return false;
  if(course.querySelector('.courseSchematics'))return true;
  {
    const gallery=document.createElement('div');gallery.className='courseSchematics';gallery.hidden=true;
    gallery.innerHTML='<h3>Schémas du chapitre</h3><p>Les schémas enregistrés dans « Schémas », disponibles aussi dans ton cours. Clique pour agrandir.</p><div class="courseSchematicsGrid"></div>';
    course.appendChild(gallery);
    const preview=document.createElement('dialog');preview.className='courseSchematicPreview';preview.setAttribute('aria-labelledby','courseSchematicTitle');
    preview.innerHTML='<div><h3 id="courseSchematicTitle"></h3><button class="soft" aria-label="Fermer le schéma">×</button></div><canvas width="1200" height="800"></canvas>';
    document.body.appendChild(preview);preview.querySelector('button').onclick=()=>preview.close();
    preview.addEventListener('click',e=>{if(e.target===preview){const r=preview.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)preview.close()}});
    const css=document.createElement('style');css.textContent='.courseSchematics{margin-top:24px;padding:20px;border:1px solid var(--line);border-radius:18px;background:var(--panel)}.courseSchematics[hidden]{display:none}.courseSchematics h3{margin:0 0 8px}.courseSchematics p{color:var(--muted);font-size:12px}.courseSchematicsGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}.courseSchematicCard{padding:10px;border:1px solid var(--line);border-radius:14px;background:var(--bg);color:var(--text);text-align:left}.courseSchematicCard canvas{width:100%;height:auto;border-radius:8px;background:white;display:block}.courseSchematicCard b{display:block;margin-top:10px;overflow-wrap:anywhere}.courseSchematicPreview{width:min(1100px,94vw);max-height:92vh;box-sizing:border-box;overflow:auto;border:1px solid var(--line);border-radius:20px;padding:16px;background:var(--panel);color:var(--text)}.courseSchematicPreview::backdrop{background:#100d20bb;backdrop-filter:blur(6px)}.courseSchematicPreview>div{display:flex;justify-content:space-between;align-items:center;gap:20px}.courseSchematicPreview h3{overflow-wrap:anywhere}.courseSchematicPreview canvas{display:block;width:100%;height:auto;background:white;border-radius:12px}';document.head.appendChild(css);
    let generation=0;
    async function refreshGallery(){
      const request=++generation,d=typeof D==='function'?D():null;
      if(!d||!course.classList.contains('on'))return;
      const models=db.schematics?.[d.id]||[],box=gallery.querySelector('.courseSchematicsGrid');box.replaceChildren();gallery.hidden=!models.length;
      if(!models.length)return;
      try{await load();if(request!==generation||D()?.id!==d.id)return;
        for(const model of models){
          const btn=document.createElement('button');btn.type='button';btn.className='courseSchematicCard';
          const c=document.createElement('canvas');c.width=600;c.height=400;const label=document.createElement('b');label.textContent=model.name||'Schéma';
          btn.append(c,label);box.appendChild(btn);window.memoDrawSchematic(c,model);
          btn.onclick=()=>{preview.querySelector('h3').textContent=model.name||'Schéma';window.memoDrawSchematic(preview.querySelector('canvas'),model);preview.showModal()};
        }
      }catch{box.textContent='Impossible de charger les schémas. ';const retry=document.createElement('button');retry.textContent='Réessayer';retry.className='soft';retry.onclick=refreshGallery;box.appendChild(retry)}
    }
    new MutationObserver(refreshGallery).observe(course,{attributes:true,attributeFilter:['class']});
    refreshGallery();
  }
  return true;
  }
  if(!attachCourseGallery()){const observer=new MutationObserver(()=>{if(attachCourseGallery())observer.disconnect()});observer.observe(document.querySelector('main'),{childList:true})}
})();