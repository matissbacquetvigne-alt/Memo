(()=>{
  /* Crisp contextual owl. Kept separate from the home mascot. */
  const owl=`<div class="memoGeneratedChapterOwl" role="img" aria-label="Hibou Memo"><svg viewBox="0 0 280 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="mgoBody" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c68755"/><stop offset="1" stop-color="#9b603f"/></linearGradient>
      <linearGradient id="mgoWing" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d99558"/><stop offset="1" stop-color="#a76743"/></linearGradient>
      <linearGradient id="mgoBelly" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff0d4"/><stop offset="1" stop-color="#f4ddbf"/></linearGradient>
    </defs>
    <ellipse cx="137" cy="244" rx="91" ry="10" fill="rgba(20,15,24,.18)"/>
    <g transform="rotate(-7 133 126)">
      <path d="M91 111 C72 125 66 153 70 181 C74 215 96 235 130 236 C166 237 190 215 194 181 C198 150 189 124 169 110 C150 97 111 97 91 111Z" fill="url(#mgoBody)"/>
      <path d="M102 145 C111 131 128 125 143 130 C161 136 169 154 166 178 C163 207 150 224 132 225 C111 225 98 206 96 180 C95 164 97 153 102 145Z" fill="url(#mgoBelly)"/>
      <path d="M79 151 C57 151 39 169 39 190 C39 208 51 216 65 207 C80 198 89 179 87 164 C86 156 83 152 79 151Z" fill="#9b603f"/>
      <path d="M65 203 C54 211 49 220 55 224 C64 230 80 216 87 202 C78 208 70 210 65 203Z" fill="#d99558"/>
      <path d="M180 154 C196 140 204 119 204 98 C214 108 216 124 211 139 C224 130 232 116 235 101 C244 117 239 136 226 151 C240 147 250 138 256 127 C259 148 244 170 222 181 C204 190 184 189 174 176 C166 166 170 160 180 154Z" fill="url(#mgoWing)"/>
      <path d="M188 163 C207 157 224 145 237 130 M196 174 C216 169 231 158 243 145" fill="none" stroke="#895538" stroke-width="7" stroke-linecap="round" opacity=".75"/>
      <path d="M68 72 C58 57 60 37 72 24 C87 32 95 44 96 58Z" fill="#a76743"/>
      <path d="M159 58 C166 41 179 31 193 31 C197 47 191 62 178 73Z" fill="#a76743"/>
      <path d="M66 61 C83 38 110 31 135 36 C160 32 187 45 199 67 C211 90 203 115 181 132 C161 148 128 152 98 143 C70 135 52 116 51 92 C50 80 55 69 66 61Z" fill="url(#mgoBody)"/>
      <path d="M69 77 C76 58 94 51 111 58 C121 62 128 71 131 82 C136 69 146 60 158 58 C178 55 195 70 196 90 C197 111 181 126 162 127 C149 127 138 121 132 110 C125 123 114 130 100 130 C79 130 64 115 63 95 C63 88 65 82 69 77Z" fill="#e6c39c"/>
      <circle cx="101" cy="91" r="31" fill="#fff6e9"/><circle cx="162" cy="88" r="31" fill="#fff6e9"/>
      <circle cx="103" cy="92" r="17" fill="#8b4d25"/><circle cx="164" cy="89" r="17" fill="#8b4d25"/>
      <circle cx="103" cy="92" r="10" fill="#4c2b1e"/><circle cx="164" cy="89" r="10" fill="#4c2b1e"/>
      <circle cx="97" cy="85" r="5" fill="white"/><circle cx="158" cy="82" r="5" fill="white"/>
      <path d="M119 116 Q132 104 146 114 L132 128Z" fill="#efa03e"/>
      <path d="M125 125 Q133 136 142 125 Q141 140 133 142 Q125 138 125 125Z" fill="#e56f55"/>
      <path d="M105 229 L102 244 M157 227 L160 243" stroke="#efa03e" stroke-width="7" stroke-linecap="round"/>
      <path d="M102 241 Q87 241 78 250 Q94 246 106 251 Q112 245 120 250 M160 240 Q146 240 138 249 Q153 245 164 250 Q171 244 179 249" fill="none" stroke="#efa03e" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <path d="M230 70 L238 51 M247 80 L263 68" stroke="#efa03e" stroke-width="7" stroke-linecap="round"/>
  </svg></div>`;
  const apply=()=>{
    const chapter=document.querySelector('#memoOwlChapter .memoOwlMascot,.memoOwlChapter .memoOwlMascot');
    if(!chapter)return false;
    chapter.innerHTML=owl;
    if(!document.getElementById('memoGeneratedOwlSharpStyle')){
      const s=document.createElement('style');s.id='memoGeneratedOwlSharpStyle';
      s.textContent=`#memoOwlChapter .memoOwlMascot,.memoOwlChapter .memoOwlMascot{display:flex!important;align-items:flex-end!important;justify-content:center!important;overflow:visible!important;filter:none!important}.memoGeneratedChapterOwl{display:block;width:255px;height:238px;max-width:100%;flex:none}.memoGeneratedChapterOwl svg{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 12px 12px rgba(80,48,30,.14))}@media(max-width:650px){.memoGeneratedChapterOwl{width:165px;height:154px}}`;
      document.head.appendChild(s);
    }
    return true;
  };
  if(!apply()){let n=0;const t=setInterval(()=>{n++;if(apply()||n>40)clearInterval(t)},100)}
})();