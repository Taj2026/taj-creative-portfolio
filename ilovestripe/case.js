function fitEmbeds(){
    document.querySelectorAll('.embed[data-fit]').forEach(function(el){
      var bw=parseFloat(el.getAttribute('data-w'))||1440;
      var bh=parseFloat(el.getAttribute('data-h'))||900;
      var w=el.clientWidth, s=w/bw;
      el.style.height=(bh*s)+'px';
      var f=el.querySelector('iframe'); if(f){ f.style.width=bw+'px'; f.style.height=bh+'px'; f.style.transform='scale('+s+')'; }
    });
  }
  window.addEventListener('load',fitEmbeds);
  window.addEventListener('resize',fitEmbeds);
  document.addEventListener('DOMContentLoaded',fitEmbeds);

  // Defer each animation: only load (and thus start playing) its iframe once its section scrolls into view.
  (function(){
    function load(f){ if(!(f && f.getAttribute('data-src'))) return; var em=f.closest('.embed'); var poster=em?em.querySelector('.embed-poster'):null; var started=false; function start(){ if(started) return; started=true; f.src=f.getAttribute('data-src'); f.removeAttribute('data-src'); setTimeout(fitEmbeds,60); if(!em) return; var cap=0,lastSig='',stable=0; function reveal(){ em.classList.add('is-live'); } function sigOf(s){ var h=0,L=s.length,i; for(i=0;i<L;i+=9){ h=(h*31+s.charCodeAt(i))|0; } return h+'#'+L; } (function poll(){ cap++; try{ var d=f.contentDocument; if(d && d.body && !d.getElementById('__bundler_thumbnail')){ var sig=sigOf(d.body.innerHTML||''); if(sig===lastSig){ stable++; } else { stable=0; lastSig=sig; } if(stable>=3){ reveal(); return; } } }catch(e){ reveal(); return; } if(cap>50){ reveal(); return; } setTimeout(poll,180); })(); } if(poster && !poster.complete){ poster.addEventListener('load',start,{once:true}); poster.addEventListener('error',start,{once:true}); setTimeout(start,1000); } else { start(); } }
    if(!('IntersectionObserver' in window)){ document.querySelectorAll('iframe[data-src]').forEach(load); return; }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ load(e.target.querySelector('iframe[data-src]')); io.unobserve(e.target); } });
    },{rootMargin:'0px 0px -20% 0px',threshold:0.01});
    document.querySelectorAll('.embed').forEach(function(el){ io.observe(el); });
  })();

  // Reveal quote blocks as they scroll into view.
  (function(){
    var quotes=document.querySelectorAll('.quote');
    if(!quotes.length) return;
    if(!('IntersectionObserver' in window)){ quotes.forEach(function(q){ q.classList.add('in'); }); return; }
    var qo=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); qo.unobserve(e.target); } });
    },{rootMargin:'0px 0px -12% 0px',threshold:0.25});
    quotes.forEach(function(q){ qo.observe(q); });
  })();

  // Align the "Portfolio" back button to the same left edge the home headline uses.
  // Mirrors the home page's split-layout geometry: the left content block is 570px
  // (capped to the half-width minus 48px) centered in the left half of the viewport.
  function homeLeftEdge(){
    var vw=document.documentElement.clientWidth||window.innerWidth;
    if(vw<=900) return 28;                 // matches home mobile --pad
    var innerW=Math.min(570, vw/2-48);
    return Math.round((vw/2-innerW)/2);
  }
  function alignBack(){
    var nav=document.querySelector('.dnav-in');
    if(!nav) return;
    if(window.matchMedia('(max-width:900px)').matches){ nav.style.paddingLeft=''; nav.style.paddingRight=''; return; }
    var e=homeLeftEdge();
    nav.style.paddingLeft=e+'px';
    nav.style.paddingRight=e+'px';
  }
  window.addEventListener('load',alignBack);
  window.addEventListener('resize',alignBack);
  document.addEventListener('DOMContentLoaded',alignBack);
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(alignBack); }
