/* Aeth3r degrader — behaviour.
   Load once per page:  <script src="../../static/aeth3r-degrader.js"></script>
   Safe to place anywhere — it waits for DOMContentLoaded. */
(function(){
  "use strict";
  function init(){
  const S=id=>document.getElementById("ad-"+id);
  const NS="http://www.w3.org/2000/svg";
  const motionOK=!window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp=(t,lo=0,hi=1)=>Math.min(hi,Math.max(lo,t));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const easeInOut=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  const easeOut=t=>1-Math.pow(1-t,3);
  const seg=(p,a,b)=>clamp((p-a)/(b-a));
  const setT=(el,x,y,s=1)=>el.setAttribute("transform",`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(3)})`);
  const op=(el,v)=>el.style.opacity=clamp(v);

  const PHASES=[
    {k:"Target", dur:2600, desc:"The protein of interest (POI) drives the tumor and normally slips past the cell's disposal system."},
    {k:"Engage", dur:2900, desc:"A bifunctional peptide PROTAC clamps onto the POI with one of its two binding ends."},
    {k:"Recruit",dur:2900, desc:"The peptide PROTAC's other end recruits an E3 ubiquitin ligase, locking all three into a ternary complex."},
    {k:"Tag",    dur:4400, desc:"Held in proximity, an E2 enzyme hands off ubiquitin, building a K48-linked polyubiquitin chain on the POI."},
    {k:"Degrade",dur:4800, desc:"The 26S proteasome reads the chain, unfolds and shreds the POI into peptides — the peptide PROTAC releases to recycle."}
  ];
  const TOTAL=PHASES.reduce((a,p)=>a+p.dur,0);
  const STARTS=[]; { let a=0; PHASES.forEach(p=>{STARTS.push(a); a+=p.dur;}); }

  const track=S("track");
  PHASES.forEach((p,i)=>{
    const b=document.createElement("button"); b.className="ad-seg"; b.dataset.i=i;
    b.setAttribute("aria-label","Go to step "+(i+1)+": "+p.k);
    b.innerHTML=`<div class="ad-rail"><div class="ad-fill"></div></div><div class="ad-lab">${String(i+1).padStart(2,"0")} ${p.k}</div>`;
    b.addEventListener("click",()=>{ setMode("carousel"); current=i; clock=0; playing=true; syncBtn(); });
    track.appendChild(b);
  });
  const segEls=[...track.children];

  const amb=S("amb"), AMB=[];
  for(let i=0;i<18;i++){
    const c=document.createElementNS(NS,"circle");
    const r=1.6+Math.random()*3;
    c.setAttribute("r",r); c.setAttribute("fill","#848DC6"); c.setAttribute("opacity",(0.05+Math.random()*0.09).toFixed(2));
    amb.appendChild(c);
    AMB.push({el:c,x:Math.random()*1180,y:60+Math.random()*440,sp:0.12+Math.random()*0.32,ph:Math.random()*6.28,amp:8+Math.random()*18});
  }

  const UBN=6, ubchain=S("ubchain"), ubbond=S("ubbond"), UB=[];
  const ubLocal=i=>({x:30+i*6+Math.sin(i*1.35)*13, y:-44-i*30});
  for(let i=0;i<UBN;i++){
    const g=document.createElementNS(NS,"g");
    g.innerHTML=`<circle r="15" fill="url(#ad-gUb)" stroke="#EFEEEA" stroke-width="1.3"/>
                 <text y="5" text-anchor="middle" font-size="12" font-weight="700" fill="#141937" font-family="system-ui,Segoe UI,sans-serif">Ub</text>`;
    g.style.opacity=0; ubchain.appendChild(g); UB.push(g);
  }

  const pepG=S("peptides"), PEP=[];
  for(let i=0;i<8;i++){
    const r=document.createElementNS(NS,"rect"); const w=10+Math.random()*12;
    r.setAttribute("width",w); r.setAttribute("height",7); r.setAttribute("rx",3.5);
    r.setAttribute("fill","#2a3157"); r.style.opacity=0; pepG.appendChild(r);
    PEP.push({el:r,dy:(Math.random()-0.5)*70,dr:(Math.random()*90)+70,w});
  }

  const world=S("world"), poi=S("poi"), poiStrand=S("poiStrand"), protac=S("protac"),
        e3=S("e3"), e2=S("e2"), e2ub=S("e2ub"), proteasome=S("proteasome"), readout=S("readout"), xfer=S("xfer");
  const PROTE_X=1055, PROTE_Y=340, MOUTH_X=PROTE_X-115;

  function locate(E){
    let acc=0;
    for(let i=0;i<PHASES.length;i++){
      if(E<acc+PHASES[i].dur) return {idx:i,p:(E-acc)/PHASES[i].dur};
      acc+=PHASES[i].dur;
    }
    return {idx:PHASES.length-1,p:1};
  }

  function render(E,idx,p){
    const t=E;
    const bob=motionOK?Math.sin(t/820)*6:0;
    const drift=motionOK?Math.sin(t/1100)*4:0;

    op(poi,0); op(protac,0); op(e3,0); op(e2,0); op(proteasome,0);
    op(ubbond,0); op(poiStrand,0); op(readout,0); op(xfer,0);
    UB.forEach(u=>u.style.opacity=0); PEP.forEach(pp=>pp.el.style.opacity=0);

    AMB.forEach(a=>{
      a.x+=a.sp; if(a.x>1200)a.x=-10;
      const yy=a.y+(motionOK?Math.sin(t/1000*a.sp+a.ph)*a.amp:0);
      a.el.setAttribute("cx",a.x.toFixed(1)); a.el.setAttribute("cy",yy.toFixed(1));
    });

    let poiX=640, poiY=340, poiGoneScale=1;
    if(idx===0){ poiX=640; poiY=340+bob; op(poi,easeOut(seg(p,0,.35))); S("poiLab").style.opacity=easeOut(seg(p,.15,.55)); }
    else { S("poiLab").style.opacity=0; }
    if(idx===1){ poiX=lerp(640,585,easeInOut(clamp(p*1.2))); poiY=340+bob; op(poi,1); }
    else if(idx>=2){ poiX=585; poiY=(idx===2?340+bob*.5:340); op(poi,1); }

    if(idx>=1){
      op(protac,1);
      if(idx===1){
        const e=easeInOut(clamp(p*1.15));
        setT(protac,lerp(300,poiX+108,e),poiY,1);
        op(protac,easeOut(seg(p,0,.25)));
        S("protacLab").style.opacity=easeOut(seg(p,.35,.7));
      }
    }

    if(idx>=2){
      op(e3,1);
      if(idx===2){
        const e=easeInOut(clamp(p*1.1));
        setT(e3,lerp(1120,805,e),340+drift,1); op(e3,easeOut(seg(p,0,.28)));
        setT(protac,690,poiY,1);
      } else { setT(e3,805,340+drift,1); setT(protac,690,340,1); }
    }

    let ubCount=0;
    if(idx===3){
      setT(protac,690,340,1); setT(e3,805,340+drift,1);
      op(e2,easeOut(seg(p,0,.2)));
      const reveal=clamp(p/0.82)*UBN;
      ubCount=Math.min(UBN,Math.floor(reveal+0.001));
      const frac=reveal-Math.floor(reveal);
      const dip=Math.sin(clamp(frac)*Math.PI);
      // E2 perched on top of the E3 complex (x~805), with a small nudge on each deposit
      const e2x=805-16*dip+Math.sin(reveal*1.5)*4;
      const e2y=232+10*dip+Math.sin(t/700)*3;
      setT(e2, e2x, e2y, 1);
      op(e2ub,1-dip*0.9);
      // ubiquitin transfer beam: E2 (atop E3) -> growing chain tip on the POI
      const iNew=Math.min(UBN-1,Math.floor(reveal));
      const Ln=ubLocal(iNew);
      xfer.setAttribute("x1",e2x.toFixed(1)); xfer.setAttribute("y1",(e2y+16).toFixed(1));
      xfer.setAttribute("x2",(585+Ln.x).toFixed(1)); xfer.setAttribute("y2",(340+Ln.y).toFixed(1));
      op(xfer, dip*0.4);
      readout.textContent=`K48 polyUb chain  ×${Math.min(UBN,Math.round(reveal))}`;
      op(readout,easeOut(seg(p,.1,.35)));
    }
    if(idx>3) ubCount=UBN;

    let poiUnfold=0;
    if(idx===4){
      const enter=easeInOut(seg(p,0,.3));
      op(proteasome,enter); setT(proteasome,lerp(1650,PROTE_X,enter),PROTE_Y,1);

      const e3out=easeInOut(seg(p,0,.24));
      op(e3,1-e3out); setT(e3,lerp(805,905,e3out),lerp(340,470,e3out),lerp(1,.7,e3out));
      const protout=easeInOut(seg(p,.05,.34));
      op(protac,1-protout); setT(protac,lerp(690,470,protout),lerp(340,205,protout),lerp(1,.7,protout));
      readout.textContent="peptide PROTAC recycles ↻";
      op(readout, easeOut(seg(p,.05,.2))*(1-seg(p,.4,.55)));

      const travel=easeInOut(seg(p,.24,.62));
      poiX=lerp(585,MOUTH_X-6,travel); poiY=340;

      const strip=seg(p,.34,.7);
      ubCount=Math.round(lerp(UBN,0,easeOut(strip)));

      poiUnfold=easeOut(seg(p,.55,.9));
      const thread=easeInOut(seg(p,.62,.96));
      poiGoneScale=lerp(1,.05,thread);
      op(poi,1-easeOut(seg(p,.78,.98)));

      if(poiUnfold>0.02 && thread<0.98){
        const w=lerp(0,150,poiUnfold)*(1-thread);
        poiStrand.setAttribute("d",`M ${poiX} 340 q ${w*.2} -26 ${w*.4} 0 t ${w*.4} 0 t ${w*.4} 0`);
        op(poiStrand,poiUnfold*(1-easeOut(seg(p,.85,.98))));
      }

      const emit=seg(p,.66,1);
      PEP.forEach((pp,j)=>{
        const e=clamp(emit*8-j);
        if(e>0){
          const x=PROTE_X+110+easeOut(e)*pp.dr, y=PROTE_Y+pp.dy;
          pp.el.setAttribute("x",x.toFixed(1)); pp.el.setAttribute("y",(y-3.5).toFixed(1));
          pp.el.style.opacity=(e<1?e:Math.max(0,1-(e-1)*1.4))*0.95;
        }
      });
    }

    setT(poi,poiX,poiY,poiGoneScale);

    if(ubCount>0){
      op(ubbond,1);
      let d=`M ${poiX+22} ${poiY-30}`;
      for(let i=0;i<ubCount;i++){
        const L=ubLocal(i); const bx=poiX+L.x, by=poiY+L.y;
        let sc=1,al=1;
        if(idx===3){ const reveal=clamp(p/0.82)*UBN; const local=clamp(reveal-i); sc=lerp(0.2,1,easeOut(local)); al=easeOut(local); }
        setT(UB[i],bx,by,sc); UB[i].style.opacity=al; d+=` L ${bx} ${by}`;
      }
      ubbond.setAttribute("d",d);
    }
  }

  function updateUI(idx,p){
    segEls.forEach((el,i)=>{
      let active,fill;
      if(mode==="timeline"){ active=(i===idx); el.classList.toggle("is-done",i<idx);
        fill=(i<idx)?100:(i===idx?p*100:0); }
      else { active=(i===current); el.classList.remove("is-done"); fill=(i===current?p*100:0); }
      el.classList.toggle("is-active",active);
      el.querySelector(".ad-fill").style.width=fill.toFixed(1)+"%";
    });
    S("pnum").textContent=String(idx+1).padStart(2,"0")+" / 05";
    S("ptitle").textContent=PHASES[idx].k;
    S("desc").textContent=PHASES[idx].desc;
  }

  let mode="timeline", current=0, clock=0, last=performance.now(), playing=true;

  function applyState(){
    S("app").classList.toggle("is-carousel", mode==="carousel");
    S("mAll").classList.toggle("is-on", mode==="timeline");
    S("mStep").classList.toggle("is-on", mode==="carousel");
  }
  function setMode(m){ if(m===mode){applyState();return;} mode=m; clock=0; applyState(); }

  const playBtn=S("play");
  const ICON_PLAY='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE='<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  const syncBtn=()=>playBtn.innerHTML=playing?ICON_PAUSE:ICON_PLAY;

  function frame(now){
    const dt=Math.min(64,now-last); last=now;
    if(playing) clock+=dt;
    let E, worldOp=1;
    if(mode==="timeline"){ E=clock%TOTAL; }
    else{
      const dur=PHASES[current].dur, local=clock%dur;
      E=STARTS[current]+local;
      const f=Math.min(300,dur*0.16);
      const inA=clamp(local/f), outA=1-clamp((local-(dur-f))/f);
      worldOp=lerp(0.25,1,Math.min(inA,outA));
    }
    world.style.opacity=worldOp;
    const {idx,p}=locate(E);
    render(E,idx,p);
    updateUI(idx,p);
    requestAnimationFrame(frame);
  }

  playBtn.addEventListener("click",()=>{playing=!playing;syncBtn();});
  S("restart").addEventListener("click",()=>{clock=0;playing=true;syncBtn();});
  S("mAll").addEventListener("click",()=>{setMode("timeline");playing=true;syncBtn();});
  S("mStep").addEventListener("click",()=>{setMode("carousel");playing=true;syncBtn();});
  S("prev").addEventListener("click",()=>{current=(current-1+PHASES.length)%PHASES.length;clock=0;playing=true;syncBtn();});
  S("next").addEventListener("click",()=>{current=(current+1)%PHASES.length;clock=0;playing=true;syncBtn();});
  window.addEventListener("keydown",e=>{
    if(e.code==="Space"){e.preventDefault();playing=!playing;syncBtn();}
    else if(e.code==="ArrowRight" && mode==="carousel"){current=(current+1)%PHASES.length;clock=0;}
    else if(e.code==="ArrowLeft" && mode==="carousel"){current=(current-1+PHASES.length)%PHASES.length;clock=0;}
  });

  syncBtn(); applyState();
  render(0,0,0); updateUI(0,0);
  requestAnimationFrame(frame);
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();