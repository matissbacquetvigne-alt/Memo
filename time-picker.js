(()=>{
  const input=document.getElementById("agendaTime");
  if(!input)return;
  input.type="hidden";

  const button=document.createElement("button");
  button.type="button";button.id="memoTimeButton";button.className="memoTimeButton";
  button.innerHTML=`<span id="memoTimeLabel">Heure</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5v5l3.2 2"></path></svg>`;
  input.insertAdjacentElement("afterend",button);

  const picker=document.createElement("div");
  picker.className="memoTimePicker";picker.hidden=true;
  picker.innerHTML=`<div class="timePickerHead"><div><small>HEURE</small><b>Choisir une heure</b></div><button type="button" id="timeClose" aria-label="Fermer">×</button></div><div class="timeDial"><div class="timeUnit"><button type="button" data-time="hour" data-step="1">⌃</button><strong id="timeHour">15</strong><button type="button" data-time="hour" data-step="-1">⌄</button><small>HEURES</small></div><span class="timeColon">:</span><div class="timeUnit"><button type="button" data-time="minute" data-step="5">⌃</button><strong id="timeMinute">00</strong><button type="button" data-time="minute" data-step="-5">⌄</button><small>MINUTES</small></div></div><div class="timeQuick"><button type="button" data-quick="08:00">08:00</button><button type="button" data-quick="12:00">12:00</button><button type="button" data-quick="14:00">14:00</button><button type="button" data-quick="18:00">18:00</button></div><div class="timePickerActions"><button type="button" id="timeClear" class="soft">Sans heure</button><button type="button" id="timeApply" class="primary">Valider</button></div>`;
  document.body.appendChild(picker);

  const style=document.createElement("style");
  style.textContent=`
    #agendaTime{display:none!important}.memoTimeButton{grid-column:1;width:100%;height:48px;box-sizing:border-box;border:1px solid var(--line);border-radius:14px;background:var(--bg);color:var(--muted);display:flex;align-items:center;justify-content:space-between;padding:0 14px;font:inherit;font-size:13px;transition:.15s}.memoTimeButton:hover{border-color:#7770d9}.memoTimeButton.hasTime{color:var(--text);font-weight:600}.memoTimeButton svg{width:18px;height:18px;color:var(--muted)}
    .memoTimePicker{position:fixed;z-index:10000;width:268px;padding:16px;background:var(--panel);border:1px solid var(--line);border-radius:19px;box-shadow:0 18px 50px rgba(20,18,45,.24);animation:timePop .14s ease-out}.memoTimePicker[hidden]{display:none}@keyframes timePop{from{opacity:0;transform:translateY(-5px) scale(.98)}to{opacity:1;transform:none}}
    .timePickerHead{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.timePickerHead small{display:block;color:var(--accent);font-size:9px;font-weight:800;letter-spacing:.12em;margin-bottom:2px}.timePickerHead b{font-size:14px}.timePickerHead>button{width:30px;height:30px;padding:0;border:0;border-radius:9px;background:var(--bg);color:var(--muted);font-size:18px}.timePickerHead>button:hover{background:var(--accent-soft);color:var(--accent)}
    .timeDial{display:grid;grid-template-columns:1fr 18px 1fr;align-items:center;padding:10px 8px 8px;background:var(--bg);border:1px solid var(--line);border-radius:15px}.timeUnit{display:grid;justify-items:center;gap:2px}.timeUnit button{width:48px;height:29px;padding:0;border:0;background:transparent;color:var(--accent);font-size:18px;border-radius:8px}.timeUnit button:hover{background:var(--accent-soft)}.timeUnit strong{font-size:29px;line-height:34px;font-variant-numeric:tabular-nums}.timeUnit small{font-size:8px;color:var(--muted);font-weight:700;letter-spacing:.08em;margin-top:3px}.timeColon{text-align:center;font-size:27px;font-weight:700;color:var(--muted);margin-top:-13px}
    .timeQuick{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-top:10px}.timeQuick button{padding:7px 3px;border:1px solid var(--line);border-radius:9px;background:transparent;color:var(--muted);font-size:10px}.timeQuick button:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}
    .timePickerActions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:11px}.timePickerActions button{padding:9px 8px;font-size:11px}
    @media(max-width:520px){.memoTimePicker{width:min(268px,calc(100vw - 28px));box-sizing:border-box}}
  `;
  document.head.appendChild(style);

  let h=15,m=0;
  const pad=n=>String(n).padStart(2,"0");
  const hour=document.getElementById("timeHour"),minute=document.getElementById("timeMinute"),label=document.getElementById("memoTimeLabel");
  function draw(){hour.textContent=pad(h);minute.textContent=pad(m)}
  function position(){const r=button.getBoundingClientRect(),w=picker.offsetWidth||268;let left=Math.min(window.innerWidth-w-10,Math.max(10,r.left));let top=r.bottom+7;if(top+(picker.offsetHeight||320)>window.innerHeight-10)top=Math.max(10,r.top-(picker.offsetHeight||320)-7);picker.style.left=left+"px";picker.style.top=top+"px"}
  function open(){if(input.value){[h,m]=input.value.split(":").map(Number)}else{const n=new Date();h=n.getHours();m=Math.round(n.getMinutes()/5)*5;if(m===60){m=0;h=(h+1)%24}}draw();picker.hidden=false;requestAnimationFrame(position)}
  function close(){picker.hidden=true}
  function syncLabel(){label.textContent=input.value||"Heure";button.classList.toggle("hasTime",!!input.value)}
  button.onclick=e=>{e.stopPropagation();picker.hidden?open():close()};
  picker.addEventListener("click",e=>{e.stopPropagation();const step=e.target.closest("[data-time]");if(step){const n=Number(step.dataset.step);if(step.dataset.time==="hour")h=(h+n+24)%24;else m=(m+n+60)%60;draw();return}const quick=e.target.closest("[data-quick]");if(quick){[h,m]=quick.dataset.quick.split(":").map(Number);draw()}});
  document.getElementById("timeClose").onclick=close;
  document.getElementById("timeClear").onclick=()=>{input.value="";syncLabel();close()};
  document.getElementById("timeApply").onclick=()=>{input.value=`${pad(h)}:${pad(m)}`;syncLabel();close()};
  document.addEventListener("click",close);window.addEventListener("resize",()=>{if(!picker.hidden)position()});window.addEventListener("scroll",()=>{if(!picker.hidden)position()},{passive:true});
  const add=document.getElementById("agendaAdd");if(add)add.addEventListener("click",()=>setTimeout(syncLabel,0));
  syncLabel();
})();