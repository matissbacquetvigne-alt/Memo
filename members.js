(()=>{
if(window.memoMembersUIReady||!window.memoMemberStore)return;
window.memoMembersUIReady=true;
const main=document.querySelector('main'),actions=document.querySelector('.headerActions');if(!main||!actions)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store=()=>window.memoMemberStore;
const screen=document.createElement('section');screen.id='members';screen.className='view membersView';
screen.innerHTML='<button id="membersBack" class="back soft">← Accueil</button><div class="membersHeading"><div><span class="eyebrow">UNE BIBLIOTHÈQUE, PLUSIEURS PARCOURS</span><h2>Qui révise aujourd’hui ?</h2><p>Les mêmes cours et flashcards pour tous. Une progression propre à chaque membre.</p></div><button id="memberCreate" class="primary">＋ Nouveau membre</button></div><div id="memberCards" class="memberCards"></div><p class="membersHint">Les membres partagent cette bibliothèque Mémo. Les cartes acquises, les résultats de QCM et l’historique de rédaction sont personnels.</p>';
main.appendChild(screen);
const button=document.createElement('button');button.id='membersButton';button.className='soft membersButton';button.setAttribute('aria-label','Choisir un membre');button.setAttribute('aria-controls','members');actions.prepend(button);
const dialog=document.createElement('dialog');dialog.className='memberNameDialog';dialog.setAttribute('aria-labelledby','memberNameTitle');
dialog.innerHTML='<form><span class="eyebrow">MEMBRE MÉMO</span><h3 id="memberNameTitle">Nouveau membre</h3><p id="memberNameHelp"></p><label for="memberNameInput">Prénom ou pseudo</label><input id="memberNameInput" name="memberName" required maxlength="40" autocomplete="off" placeholder="Ex. Matiss, Christophe…"><p id="memberNameError" class="error" role="status"></p><div class="dialogButtons"><button type="button" id="memberNameCancel" class="soft">Annuler</button><button class="primary">Enregistrer</button></div></form>';
document.body.appendChild(dialog);
const notice=document.createElement('div');notice.className='memberNotice';notice.setAttribute('role','status');notice.hidden=true;document.body.appendChild(notice);let timer;
function announce(text){notice.textContent=text;notice.hidden=false;clearTimeout(timer);timer=setTimeout(()=>{notice.hidden=true},5000)}
const style=document.createElement('style');style.textContent=`
.membersView{max-width:1050px;margin:0 auto;padding:12px 0 50px}.membersHeading{display:flex;align-items:center;justify-content:space-between;gap:24px;margin:14px 0 28px}.membersHeading h2{font-size:clamp(28px,4vw,42px);letter-spacing:-.035em;margin:10px 0}.membersHeading p{max-width:570px}.membersHeading>.primary{white-space:nowrap;font-size:13px}.memberCards{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:18px}.memberCard{min-width:0;padding:23px;border:1px solid var(--line);border-radius:22px;background:var(--panel)}.memberCard.isActive{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent-soft)}.memberCardHead{display:flex;align-items:center;gap:13px;margin-bottom:20px}.memberAvatar{display:grid;place-items:center;width:48px;height:48px;flex-shrink:0;border-radius:16px;background:var(--accent-soft);color:var(--accent);font-size:23px;font-weight:800}.memberCardHead>div{min-width:0}.memberCard h3{font-size:21px;overflow-wrap:anywhere}.memberCardHead small{display:block;color:var(--muted);font-size:11px;margin-top:4px}.memberProgressHead{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--muted);margin:8px 0}.memberProgressHead strong{color:var(--accent);font-size:22px}.memberProgressBar{height:7px;border-radius:99px;background:var(--soft);overflow:hidden}.memberProgressBar i{display:block;height:100%;width:var(--member-pct);background:var(--accent);border-radius:inherit}.memberStats{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:20px 0}.memberStats div{padding:11px;background:var(--bg);border-radius:12px}.memberStats b{display:block;font-size:17px}.memberStats small{display:block;font-size:10px;color:var(--muted);margin-top:5px}.memberCardActions{display:flex;align-items:center;gap:8px}.memberCardActions>button:first-child{flex:1}.memberCardActions button{font-size:12px;padding:11px}.memberCardActions button:disabled{opacity:1;cursor:default}.memberLegacy{font-size:11px;color:var(--muted);line-height:1.5;margin-top:13px}.membersHint{font-size:12px;margin:22px 2px}.membersButton{display:flex;align-items:center;gap:8px;padding:9px 12px;max-width:190px;font-size:12px}.membersButton .memberMiniAvatar{display:grid;place-items:center;width:25px;height:25px;background:var(--accent-soft);color:var(--accent);border-radius:8px;flex-shrink:0}.membersButton .memberMiniName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.memberNameDialog label{display:block;font-size:12px;font-weight:700;margin:20px 0 8px}.memberNameDialog input{font-size:16px}.memberNameDialog .dialogButtons{margin-top:18px}.memberNameDialog p{font-size:13px}.memberNotice{position:fixed;z-index:12000;bottom:24px;left:50%;transform:translateX(-50%);max-width:calc(100vw - 32px);padding:14px 18px;border:1px solid var(--line);border-radius:15px;background:var(--panel);color:var(--text);box-shadow:var(--shadow);font-size:13px;line-height:1.5}.memberNotice[hidden]{display:none}@media(max-width:650px){.membersHeading{align-items:stretch;flex-direction:column}.membersHeading h2{font-size:30px}.memberCards{grid-template-columns:1fr}.membersButton{max-width:130px;padding:8px;font-size:11px}.memberCard{padding:19px}.headerActions{flex-wrap:wrap}}`;
document.head.appendChild(style);
function renderHeader(){
 const current=store()?.member;if(!current)return;
 button.innerHTML='<span class="memberMiniAvatar" aria-hidden="true">'+esc(Array.from(current.name)[0]?.toLocaleUpperCase('fr')||'M')+'</span><span class="memberMiniName">'+esc(current.name)+'</span><span aria-hidden="true">⌄</span>';
 button.setAttribute('aria-label','Membre actif : '+current.name+'. Choisir un membre.');
 const heading=document.querySelector('#checklist h2');if(heading)heading.textContent='Check list · '+current.name;
}
function render(){
 renderHeader();const current=store();if(!current)return;
 document.getElementById('memberCards').innerHTML=db.members.map(m=>{
 const p=current.summary(m.id),active=m.id===current.id;
 return '<article class="memberCard '+(active?'isActive':'')+'"><div class="memberCardHead"><span class="memberAvatar" aria-hidden="true">'+esc(Array.from(m.name)[0]?.toLocaleUpperCase('fr')||'M')+'</span><div><h3>'+esc(m.name)+'</h3><small>'+(active?'Membre actif':'Parcours personnel')+'</small></div></div><div class="memberProgressHead"><span>Accomplissement global</span><strong>'+p.pct+' %</strong></div><div class="memberProgressBar"><i style="--member-pct:'+p.pct+'%"></i></div><div class="memberStats"><div><b>'+p.known+' / '+p.total+'</b><small>Cartes acquises</small></div><div><b>'+p.done+' / '+p.chapters+'</b><small>Chapitres maîtrisés</small></div><div><b>'+p.qcmDone+'</b><small>QCM complets validés</small></div><div><b>'+p.recallDone+'</b><small>Rédactions validées</small></div></div><div class="memberCardActions"><button type="button" class="'+(active?'soft':'primary')+'" data-member-select="'+esc(m.id)+'" '+(active?'disabled':'')+'>'+(active?'✓ Profil actif':'Continuer avec '+esc(m.name))+'</button><button type="button" class="soft" data-member-rename="'+esc(m.id)+'" aria-label="Renommer '+esc(m.name)+'">Renommer</button></div>'+(m.id==='member-initial'?'<p class="memberLegacy">Ce profil conserve la progression qui existait avant la création des membres.</p>':'')+'</article>';
 }).join('');
}
function open(){
 const allowed=['home','subject','deck','chapterHub','checklist','members'];
 const visible=document.querySelector('.view.on')?.id;
 if(!allowed.includes(visible)){announce('Reviens à l’accueil ou au chapitre avant de changer de membre, pour ne pas interrompre ton travail.');return}
 render();view('members');
}
function select(id){
 const current=store();if(!current||current.id===id)return;
 const old=current.id;
 try{
  current.select(id);localSave();localStorage.setItem(window.memoMemberPreferenceKey(),id);
 }catch(e){current.select(old);announce('Le changement de membre n’a pas pu être enregistré. Réessaie.');return}
 session=null;flipped=false;
 const answer=document.getElementById('recallText');if(answer){answer.value='';const counter=document.getElementById('recallCount');if(counter)counter.textContent='0 caractère'}
 const result=document.getElementById('recallResult');if(result){result.hidden=true;result.replaceChildren()}
 home();window.memoChecklistRefresh?.();window.memoChapterProgressRefresh?.();renderHeader();
 const progress=document.getElementById('memoProgressText');if(progress)progress.textContent=current.summary(id).pct+'%';
 window.dispatchEvent(new CustomEvent('memo-member-changed',{detail:{memberId:id}}));
 announce('✓ Progression de '+current.member.name+' activée.');
}
function nameForm(id=null){
 const current=store(),existing=id?db.members.find(m=>m.id===id):null;
 document.getElementById('memberNameTitle').textContent=existing?'Renommer le membre':'Créer un membre';
 document.getElementById('memberNameHelp').textContent=existing?'La progression de ce membre reste conservée.':'Ce membre aura les mêmes contenus et commencera avec une progression à zéro.';
 const input=document.getElementById('memberNameInput'),error=document.getElementById('memberNameError');input.value=existing?.name||'';error.textContent='';
 dialog.querySelector('form').onsubmit=e=>{
  e.preventDefault();const oldMembers=JSON.parse(JSON.stringify(db.members)),oldProgress=JSON.parse(JSON.stringify(db.memberProgress));
  try{
   if(existing)current.rename(existing.id,input.value);else current.add(input.value,uid());
   save();dialog.close();render();announce(existing?'✓ Membre renommé.':'✓ Nouveau membre créé. Choisis son profil pour commencer.');
  }catch(err){db.members=oldMembers;db.memberProgress=oldProgress;error.textContent=err.message||'Impossible d’enregistrer le membre.'}
 };
 dialog.showModal();input.focus();input.select();
}
button.onclick=open;document.getElementById('membersBack').onclick=home;document.getElementById('memberCreate').onclick=()=>nameForm();document.getElementById('memberNameCancel').onclick=()=>dialog.close();
screen.addEventListener('click',e=>{const selectButton=e.target.closest('[data-member-select]'),rename=e.target.closest('[data-member-rename]');if(selectButton)select(selectButton.dataset.memberSelect);if(rename)nameForm(rename.dataset.memberRename)});
const baseHome=home;home=function(){const result=baseHome();renderHeader();return result};
window.addEventListener('storage',e=>{if(e.key===window.memoMemberPreferenceKey())announce('Un autre onglet a changé de membre. Recharge Mémo avant de poursuivre tes révisions.')});
window.memoOpenMembers=open;window.memoMembersRefresh=()=>screen.classList.contains('on')?render():renderHeader();renderHeader();
})();