(function(root){
'use strict';
const CARD_FIELDS={level:0,next:0,lastRate:null,lastReviewed:0};
const STAT_FIELDS=['qcmStats','aiQcmStats','recallStats','recallHistory'];
const controllers=new WeakMap();
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const copy=x=>JSON.parse(JSON.stringify(x));
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function merge(target,other){
 if(target?.memberProgressVersion!==1||other?.memberProgressVersion!==1)return target;
 if(!Array.isArray(target.members)||!Array.isArray(other.members))return target;
 if(!object(target.memberProgress))target.memberProgress={};
 for(const m of other.members){
  if(!object(m)||typeof m.id!=='string'||typeof m.name!=='string')continue;
  const current=target.members.find(x=>x.id===m.id);
  if(!current)target.members.push(copy(m));
  else if(Number(m.updatedAt||0)>Number(current.updatedAt||0))Object.assign(current,copy(m));
  const incoming=other.memberProgress?.[m.id],present=own(target.memberProgress,m.id)?target.memberProgress[m.id]:null;
  if(object(incoming)&&(!object(present)||Number(incoming.updatedAt||0)>Number(present.updatedAt||0)))Object.defineProperty(target.memberProgress,m.id,{value:copy(incoming),writable:true,configurable:true,enumerable:true});
 }
 return target;
}
function signature(p){const value={...p};delete value.updatedAt;return JSON.stringify(value)}
function bind(data,preferred){
 if(!object(data))throw new Error('Bibliothèque invalide.');
 if(controllers.has(data)){const c=controllers.get(data);c.refresh();return c}
 if(!Array.isArray(data.members)||!data.members.length)data.members=[{id:'member-initial',name:'Profil initial',createdAt:Date.now()}];
 data.members=data.members.filter(m=>object(m)&&typeof m.id==='string'&&typeof m.name==='string');
 if(!data.members.length)data.members=[{id:'member-initial',name:'Profil initial',createdAt:Date.now()}];
 if(!object(data.memberProgress))data.memberProgress={};
 let active=data.members.some(m=>m.id===preferred)?preferred:data.members[0].id;
 const boundCards=new WeakSet(),signatures=new Map();
 function record(id=active){
  if(!own(data.memberProgress,id)||!object(data.memberProgress[id]))Object.defineProperty(data.memberProgress,id,{value:{},writable:true,configurable:true,enumerable:true});
  const p=data.memberProgress[id];if(!object(p.cards))p.cards={};
  for(const key of STAT_FIELDS)if(!object(p[key]))p[key]={};
  return p;
 }
 function eachCard(fn){for(const subject of data.subjects||[])for(const deck of subject.decks||[])for(const card of deck.cards||[])fn(card,deck)}
 const migrating=data.memberProgressVersion!==1;let initialScan=migrating;
 if(migrating){
  const p=record(data.members[0].id);p.updatedAt=Date.now();
  for(const key of STAT_FIELDS)if(object(data[key]))p[key]=copy(data[key]);
 }
 function refresh(){
  eachCard((card,deck)=>{
   if(boundCards.has(card))return;
   const key=JSON.stringify([String(deck.id),String(card.id)]);
   const old={};let has=false;
   for(const f of Object.keys(CARD_FIELDS))if(own(card,f)&&card[f]!==undefined){old[f]=card[f];if(card[f]!==CARD_FIELDS[f])has=true}
   const owner=initialScan?data.members[0].id:active;
   const p=record(owner);
   if(has&&!own(p.cards,key))p.cards[key]=copy(old);
   for(const [field,fallback] of Object.entries(CARD_FIELDS)){
    delete card[field];
    Object.defineProperty(card,field,{configurable:true,enumerable:false,
     get(){const saved=record().cards[key];return saved&&own(saved,field)?saved[field]:fallback},
     set(value){const r=record();if(!own(r.cards,key))r.cards[key]={};r.cards[key][field]=value}
    });
   }
   boundCards.add(card);
  });
 }
 for(const key of STAT_FIELDS){delete data[key];Object.defineProperty(data,key,{configurable:true,enumerable:false,get(){return record()[key]},set(value){record()[key]=object(value)?value:{}}})}
 data.memberProgressVersion=1;refresh();initialScan=false;for(const m of data.members)signatures.set(m.id,signature(record(m.id)));
 const controller={data,get id(){return active},get member(){return data.members.find(m=>m.id===active)},refresh,
  select(id){if(!data.members.some(m=>m.id===id))throw new Error('Membre introuvable.');active=id;refresh();return controller.member},
  add(name,id){name=String(name||'').trim();if(!name||name.length>40)throw new Error('Choisis un prénom de 1 à 40 caractères.');if(data.members.some(m=>m.name.toLocaleLowerCase('fr')===name.toLocaleLowerCase('fr')))throw new Error('Ce membre existe déjà.');if(typeof id!=='string'||!id||data.members.some(m=>m.id===id))throw new Error('Identifiant de membre invalide.');const m={id,name,createdAt:Date.now(),updatedAt:Date.now()};data.members.push(m);record(id).updatedAt=Date.now();signatures.set(id,signature(record(id)));return m},
  rename(id,name){name=String(name||'').trim();const m=data.members.find(m=>m.id===id);if(!m||!name||name.length>40)throw new Error('Choisis un prénom de 1 à 40 caractères.');if(data.members.some(x=>x.id!==id&&x.name.toLocaleLowerCase('fr')===name.toLocaleLowerCase('fr')))throw new Error('Ce membre existe déjà.');m.name=name;m.updatedAt=Date.now()},
  stamp(){refresh();const p=record(),s=signature(p);if(signatures.get(active)!==s){p.updatedAt=Date.now();signatures.set(active,s)}},
  merge(other){merge(data,other);for(const m of data.members)signatures.set(m.id,signature(record(m.id)));refresh()},
  summary(id){
   const p=record(id);let total=0,known=0,chapters=0,done=0,sum=0,qcmDone=0,recallDone=0;
   for(const s of data.subjects||[])for(const d of s.decks||[]){
    const cards=d.cards||[];let acquired=0;
    for(const card of cards){total++;const c=p.cards[JSON.stringify([String(d.id),String(card.id)])];if(c?.lastRate==='known'&&(!c.next||c.next>Date.now())){known++;acquired++}}
    const f=cards.length?Math.round(acquired/cards.length*100):0,q=p.qcmStats[d.id],r=p.recallStats[d.id];
    const qp=Math.max(0,Math.min(100,Number(q?.bestPct)||0)),rp=Math.max(0,Math.min(100,Number(r?.bestBalancedPct)||0));
    const qd=q?.validated===true||qp===100,rd=r?.validated===true||rp===100;
    if(qd)qcmDone++;if(rd)recallDone++;chapters++;if(cards.length&&acquired===cards.length&&qd&&rd)done++;sum+=Math.round((f+qp+rp)/3);
   }
   return{total,known,chapters,done,qcmDone,recallDone,pct:chapters?Math.round(sum/chapters):0};
  }
 };
 controllers.set(data,controller);return controller;
}
root.MemoMembers={bind,merge};
})(globalThis);