(()=>{
const sheetView=document.getElementById('revisionSheet'),main=document.querySelector('main');if(!sheetView||!main)return;
const actions=sheetView.querySelector('.sheetActions');if(actions&&!document.getElementById('startRecallAI')){const b=document.createElement('button');b.id='startRecallAI';b.className='primary';b.type='button';b.textContent='✨ Rappel libre';actions.prepend(b)}
const recall=document.createElement('section');recall.id='recallAI';recall.className='view recallAIView';recall.innerHTML=`<div class="recallHead"><div><button id="recallBack" class="back soft