/* A city you run with your laptop: eight small riddles whose answers use the machine itself. Nothing is recorded or sent;
   solved windows are remembered only in this browser. Hidden on phones. */
(()=>{const e=document.getElementById("tk-laptop");if(!e||!matchMedia("(min-width:761px) and (pointer:fine)").matches){e&&e.remove();return;}
const $=s=>e.querySelector(s),cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),R=(x,y,w,h,c="",r=0)=>`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
const ROWS=["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"],OFF=[0,.28,.8],KP={};ROWS.forEach((r,j)=>[...r].forEach((k,i)=>KP[k]=[i+OFF[j],j]));const near=(a,b)=>{const p=KP[a],q=KP[b];return p&&q&&a!==b&&Math.abs(p[1]-q[1])<=1&&Math.abs(p[0]-q[0])<(p[1]===q[1]?1.1:.95);},WET=["G","H"];
const st={path:["A"],z:0,w0:innerWidth,away:0,light:false,pw:0,ang:null,caps:false};
const P=[
{id:"walk",n:"Walk to work",q:"Your keyboard is a street grid. Walk from A to L, one neighboring key at a time. G and H are under water.",h:"Press A’s neighbors one by one. Go around the flood, above or below it.",a:"One way: A S D F V B N M K L.",
 d:()=>Object.entries(KP).map(([k,p])=>{const x=14+p[0]*38.5,y=52+p[1]*46,c=WET.includes(k)?"wet":st.path.at(-1)===k?"cur":st.path.includes(k)?"vis":k==="L"?"goal":"key";return R(x,y,34,40,c,7)+`<text x="${x+17}" y="${y+26}">${k}</text>`;}).join("")},
{id:"scale",n:"Change scale",q:"Planners work from the street to the region. You’re standing too close. Pull back until you can see all of it.",h:"Pinch the trackpad, as if zooming out on a map. With a mouse, hold Ctrl and scroll.",a:"Rest the pointer on this card and pinch two fingers together, several times, until the label says Region.",
 d:()=>{let o="";const names=["Street","Block","Neighborhood","City","Region"],base=196;for(let k=4;k>=0;k--){const s=base*Math.pow(2.6,k-st.z*4);if(s<4||s>3000)continue;o+=`<g style="opacity:${cl(1.3-Math.abs(Math.log(s/170))*.4,.15)}">`+R(210-s/2,116-s/2,s,s,"sq",s*.04)+`</g>`;}const q=Math.pow(2.6,-st.z*4);o+=`<g transform="translate(210 116) scale(${q})"><path class="hs" d="M-34 40V-8L0 -40L34 -8V40H10V14H-10V40z"/></g>`;return o+`<text class="nm2" x="210" y="248">${names[Math.round(st.z*4)]}</text>`;}},
{id:"gap",n:"Close the gap",q:"Two banks, no bridge. The city is simply too wide. Bring the banks together.",h:()=>tgt()<st.w0?"Make the browser window narrower. If it fills the screen, leave full screen first.":"Make the browser window wider.",a:()=>tgt()<st.w0?`Drag the edge of the window inward until it’s about ${Math.round(tgt())} pixels wide. It’s ${innerWidth} now.`:`Drag the edge of the window outward until it’s about ${Math.round(tgt())} pixels wide. It’s ${innerWidth} now.`,
 d:()=>{const g=gap()*150;return R(0,0,420,260,"water")+R(-10,60,220-g,140,"land",10)+R(210+g,60,220,140,"land",10)+[30,70,110].map((x,i)=>R(x,96-i*9,26,50+i*9,"bl",2)+R(390-x-26+10,100-i*7,26,46+i*7,"bl",2)).join("");}},
{id:"fox",n:"The shy fox",q:"It only crosses the street when nobody is watching.",h:"It can tell when you’re on this page. Give it some privacy.",a:"Open another tab or another app, count to three, and come back.",
 d:()=>{const y=solved.has("fox")?44:214;return R(0,76,420,104,"road")+[0,1,2,3,4,5].map(i=>R(20+i*70,125,40,6,"dash")).join("")+`<g transform="translate(206 ${y})" class="fox"><path d="M-30 4C-58 10 -70 -8 -62 -24C-50 -18 -44 -8 -28 -6z"/><path d="M-32 -8C-20 -16 12 -16 24 -10L26 8L22 28H16L14 10C0 13 -12 13 -20 10L-22 28H-28z"/><path d="M18 -10L20 -34L30 -24L40 -34L44 -14L34 2z"/><circle class="ey" cx="31" cy="-13" r="2.2"/><path class="tip" d="M-62 -24C-56 -22 -53 -18 -51 -14C-57 -10 -63 -12 -65 -14z"/></g>`;}},
{id:"caps",n:"Room to grow",q:"A strict height limit keeps everyone out. LIFT IT.",h:"The riddle is shouting. One key lets you shout too.",a:"Press Caps Lock. Or hold Shift and type LIFT.",
 d:()=>{const k=st.caps||solved.has("caps")?1:.28;return R(0,212,420,48,"road")+[38,96,150,214,270,330].map((x,i)=>{const h=[150,118,172,134,160,110][i]*k;return R(x,212-h,44,h,"bl",3);}).join("")+`<path class="lim" d="M14 ${k>.5?26:152}H406"/>`;}},
{id:"night",n:"Find the stars",q:"The stars never left. Something is drowning them out.",h:()=>isDark()&&!st.light?"You can’t see nightfall if it’s always night. Make it day on this whole page first.":"It’s too bright on this whole page, not just in the picture.",a:()=>{const b=document.getElementById("theme");b.classList.add("hey");setTimeout(()=>b.classList.remove("hey"),3600);return isDark()&&!st.light?"Click the sun at the top right of the screen, then the moon that replaces it.":"Click the moon at the top right of the screen.";},
 d:()=>{const n=isDark(),dk=n&&(st.light||solved.has("night"));let o=R(0,0,420,260,n?"sky":"day");if(n&&!dk)o+=R(0,0,420,260,"haze");const C4=["#fff","#cfe0ff","#ffe9bd","#fff"],sp=(x,y,r,i)=>{const k=r*.16;return `<g class="star" style="opacity:${dk?1:0}"><circle class="glow" cx="${x}" cy="${y}" r="${r*1.05}" fill="${C4[i%4]}"/><path class="star tw" style="--d:${i%9};fill:${C4[i%4]}" d="M${x} ${y-r}Q${x+k} ${y-k} ${x+r} ${y}Q${x+k} ${y+k} ${x} ${y+r}Q${x-k} ${y+k} ${x-r} ${y}Q${x-k} ${y-k} ${x} ${y-r}z"/></g>`;};
 if(dk)o+=`<path class="mw" d="M-30 150C80 60 250 130 450 -10"/><path class="moon" d="M372 26a17 17 0 1 0 15 25a13.5 13.5 0 0 1 -15 -25z"/><path class="shoot" d="M70 26L38 12"/>`;
 for(let i=0;i<70;i++)o+=`<circle class="star" style="opacity:${dk?.25+(i*37%60)/95:0}" cx="${(i*137+(i*i)%53)%420}" cy="${(i*71+(i*i)%37)%176}" r="${.5+(i%3)*.3}"/>`;
 [[42,70,7],[96,26,10],[128,104,6],[168,58,8],[232,22,7],[262,92,6],[330,96,9],[398,108,6],[300,40,5],[20,128,5],[205,120,5],[352,150,6]].forEach((s,i)=>o+=sp(...s,i));return o+[0,1,2,3,4,5,6,7].map(i=>R(i*54,200-(i*53%60),48,62+(i*53%60),"sil")).join("");}},
{id:"quiet",n:"Unplug",q:"This town is buzzing with signals. Give it one second of silence.",h:"What does your laptop use to talk to the world?",a:"Turn your Wi-Fi off, then on again.",
 d:()=>{const off=!navigator.onLine||solved.has("quiet");return `<path class="mast" d="M210 230V110M190 230L210 150L230 230"/><circle class="dotc" cx="210" cy="104" r="7"/>`+[26,48,70,92].map((r,i)=>`<path class="wave${off?" off":""}" style="animation-delay:${i*.25}s" d="M${210-r} ${104-r*.6}A${r*1.15} ${r*1.15} 0 0 1 ${210+r} ${104-r*.6}"/>`).join("");}},
{id:"power",n:"Keep the lights on",q:"The grid is down. Make power by hand, all the way to the top.",h:"Grab the wheel and drag it around in circles. Don’t stop: it runs down.",a:"Press on the handle, hold, and draw about fifteen quick circles.",
 d:()=>{const a=st.rot||0;return `<circle class="wh" cx="130" cy="130" r="76"/><g transform="rotate(${a} 130 130)"><path class="sp" d="M130 130V70"/><circle class="hd" cx="130" cy="68" r="13"/></g>`+R(290,36,44,188,"tank",10)+R(290,36+188*(1-st.pw),44,188*st.pw,"fill",10);}}];
const solved=new Set();try{JSON.parse(localStorage.getItem("laptopCity")||"[]").forEach(k=>solved.add(k));}catch(_){}
const tgt=()=>st.w0>900?Math.max(800,st.w0*.78):st.w0*1.14,gap=()=>solved.has("gap")?0:cl((innerWidth-tgt())/(st.w0-tgt()));
let cur=Math.max(0,P.findIndex(p=>!solved.has(p.id))),over=false;
e.innerHTML=`<div class="tk-s"><svg class="lp" viewBox="0 0 420 260" role="img" aria-label="Puzzle scene"></svg></div><div class="tk-t"><h3>A city you run with your laptop</h3><button type="button" class="tk-try">Try it</button><div class="wins" role="group" aria-label="Riddles">${P.map((p,i)=>`<button type="button" data-i="${i}" aria-label="${p.n}" title="${p.n}"></button>`).join("")}</div><p class="lp-n"></p><p class="tk-q"></p><div class="tk-o"><button type="button" data-h>Hint</button><button type="button" data-n>Next</button><button type="button" data-z>Start over</button></div><p class="tk-a" aria-live="polite"></p></div>`;
const svg=$(".lp"),A=$(".tk-a"),draw=()=>{svg.innerHTML=P[cur].d();svg.setAttribute("class","lp l-"+P[cur].id);};
let ht=0;const tier=k=>{ht=k;$("[data-h]").textContent=k?"Show me how":"Hint";};
function show(i,keep){cur=i;const p=P[i];$(".lp-n").textContent=p.n;$(".tk-q").textContent=p.q;tier(0);if(!keep)A.textContent=solved.has(p.id)?"Solved.":"";e.querySelectorAll(".wins button").forEach((b,k)=>{b.classList.toggle("lit",solved.has(P[k].id));b.setAttribute("aria-pressed",String(k===i));});if(p.id==="gap"&&!solved.has("gap"))st.w0=innerWidth;if(p.id==="night")st.light=!isDark();if(p.id==="walk"&&!solved.has("walk"))st.path=["A"];draw();}
function win(id,msg){if(solved.has(id))return;solved.add(id);try{localStorage.setItem("laptopCity",JSON.stringify([...solved]));}catch(_){}A.innerHTML="<b>Lights on.</b> "+msg+(solved.size===P.length?`<span class="fin">You lit the whole building. <a href="mailto:amy_chen[at]gsd.harvard.edu?subject=I%20lit%20the%20whole%20building">Tell me which one was hardest.</a></span>`:"");show(cur,true);e.classList.toggle("alllit",solved.size===P.length);}
$(".tk-try").onclick=()=>{e.classList.add("op");show(cur);e.scrollIntoView({block:"nearest"});};
const is=id=>e.classList.contains("op")&&e.offsetParent!==null&&P[cur].id===id&&!solved.has(id);
$(".wins").onclick=v=>{const b=v.target.closest("button");if(b)show(+b.dataset.i);};$("[data-h]").onclick=()=>{const h=P[cur][ht?"a":"h"];A.textContent=typeof h==="function"?h():h;tier(1);};
$("[data-n]").onclick=()=>{let k=cur;do k=(k+1)%P.length;while(solved.has(P[k].id)&&k!==cur);show(k===cur?(cur+1)%P.length:k);};
$("[data-z]").onclick=()=>{solved.clear();try{localStorage.removeItem("laptopCity");}catch(_){}st.z=0;st.pw=0;e.classList.remove("alllit");show(0);};
e.addEventListener("pointerenter",()=>over=true);e.addEventListener("pointerleave",()=>over=false);
const seen=()=>{const r=e.getBoundingClientRect();return over||r.top<innerHeight*.75&&r.bottom>innerHeight*.25;};
const active=()=>seen()&&!document.querySelector("dialog[open]")&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||"");
/* keyboard walk, Caps Lock */
addEventListener("keydown",v=>{caps(v);if(!active()||!is("walk")||v.metaKey||v.ctrlKey||v.altKey)return;const m=/^Key([A-Z])$/.exec(v.code);if(!m)return;const k=m[1],at=st.path.at(-1);if(k===at&&st.path.length===1){A.textContent="";return;}
 if(WET.includes(k))A.textContent=k+" is flooded.";else if(!near(at,k))A.textContent=`${k} isn’t next to ${at}.`;else{st.path.push(k);A.textContent="";if(k==="L")return win("walk",`You made it in ${st.path.length-1} steps. When one route floods, a well-connected grid gives you another.`);}draw();});
let typed="";
function caps(v){if(!v.getModifierState)return;const c=v.getModifierState("CapsLock");if(c!==st.caps){st.caps=c;if(P[cur].id==="caps")draw();}if(v.type==="keydown"&&is("caps")&&active()){if(v.shiftKey&&/^Key[A-Z]$/.test(v.code))typed=(typed+v.code[3]).slice(-4);else if(v.key!=="Shift")typed="";}if((c||typed==="LIFT")&&active()&&is("caps"))win("caps","More homes fit on the same land. Whether they should is the real debate.");}
addEventListener("keyup",caps);e.addEventListener("pointermove",caps);
/* pinch */
const zoom=d=>{st.z=cl(st.z+d);draw();if(st.z>=.985)win("scale","From a doorstep to a region. The best answer often depends on the scale you pick.");};
e.addEventListener("wheel",v=>{if(!v.ctrlKey||P[cur].id!=="scale")return;v.preventDefault();if(is("scale"))zoom(cl(v.deltaY,-40,40)*.0032);},{passive:false});
let gs=1;e.addEventListener("gesturestart",v=>{if(P[cur].id==="scale"){v.preventDefault();gs=1;}});e.addEventListener("gesturechange",v=>{if(!is("scale"))return;v.preventDefault();zoom((gs-v.scale)*.7);gs=v.scale;});
/* window width */
addEventListener("resize",()=>{if(P[cur].id!=="gap")return;draw();if(is("gap")&&gap()<=.001)win("gap","The banks meet. Distance is the first thing every city has to solve.");});
/* look away: another tab, or another app */
addEventListener("blur",()=>{if(!document.hidden)st.away=Date.now();});
const back=()=>{if(is("fox")&&st.away&&Date.now()-st.away>2200)win("fox","It crossed. Being watched changes behavior, which is a real problem in fieldwork.");st.away=0;};addEventListener("focus",back);
document.addEventListener("visibilitychange",()=>{if(document.hidden)st.away=st.away||Date.now();else back();});
/* night, offline */
onTheme(()=>{if(!isDark())st.light=true;if(P[cur].id==="night"){draw();if(is("night")&&isDark()&&st.light)win("night","There they are. Most people in cities live under skies too bright for them.");}});
addEventListener("offline",()=>{if(P[cur].id==="quiet"){draw();if(is("quiet"))win("quiet","A second of quiet. You can reconnect now.");}});addEventListener("online",()=>{if(P[cur].id==="quiet")draw();});
/* crank */
const ang=v=>{const r=svg.getBoundingClientRect();return Math.atan2((v.clientY-r.top)/r.height*260-130,(v.clientX-r.left)/r.width*420-130)*57.2958;};let raf=0,lt=0;
const tick=t=>{raf=0;const dt=Math.min(.05,(t-lt)/1000||0);lt=t;if(P[cur].id!=="power")return;if(!solved.has("power"))st.pw=Math.max(0,st.pw-dt*.07);draw();if(st.pw>0&&!solved.has("power"))raf=requestAnimationFrame(tick);};
svg.addEventListener("pointerdown",v=>{if(!is("power"))return;st.ang=ang(v);svg.setPointerCapture(v.pointerId);});
svg.addEventListener("pointermove",v=>{if(st.ang===null||!is("power"))return;const a=ang(v);let d=a-st.ang;if(d>180)d-=360;if(d<-180)d+=360;st.ang=a;st.rot=(st.rot||0)+d;st.pw=cl(st.pw+Math.abs(d)/360*.1);if(st.pw>=1){st.ang=null;st.pw=1;win("power","That took work. Clean grids need storage for the moment the turning stops.");}if(!raf){lt=performance.now();raf=requestAnimationFrame(tick);}});
["pointerup","pointercancel"].forEach(k=>svg.addEventListener(k,()=>st.ang=null));
e.classList.toggle("alllit",solved.size===P.length);show(cur);
})();
