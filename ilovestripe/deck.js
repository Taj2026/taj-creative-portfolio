// Slide-deck behaviour: bottom-right prev/next arrows, keyboard paging, fit-to-slide scaling.
(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  if(!slides.length) return;
  var desk=window.matchMedia('(min-width:901px) and (min-height:360px)');
  var nav=document.querySelector('.dnav');
  var UP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  var DOWN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
  function title(s){ return s.getAttribute('data-title') || ''; }

  function setNavH(){ if(nav) document.documentElement.style.setProperty('--navh', nav.offsetHeight+'px'); }

  // ----- arrows -----
  slides.forEach(function(s,i){
    var old=s.querySelector(':scope > .pnav'); if(old) old.remove();
    var html='';
    if(i>0) html+='<button type="button" class="nav-arrow nav-prev" data-go="'+(i-1)+'" aria-label="Previous: '+title(slides[i-1])+'"><span class="na-c">'+UP+'</span></button>';
    if(i<slides.length-1) html+='<button type="button" class="nav-arrow nav-next" data-go="'+(i+1)+'" aria-label="Next: '+title(slides[i+1])+'"><span class="na-l">'+title(slides[i+1])+'</span><span class="na-c">'+DOWN+'</span></button>';
    if(!html) return;
    var p=document.createElement('div');
    p.className='pnav'+(i===0?' hero-pnav':'');
    p.innerHTML='<div class="wrap">'+html+'</div>';
    s.appendChild(p);
  });
  document.addEventListener('click',function(e){
    var b=e.target.closest && e.target.closest('[data-go]'); if(!b) return;
    e.preventDefault(); go(+b.getAttribute('data-go'));
  });

  // ----- navigation -----
  var pending=null, timer=null;
  function go(i){
    i=Math.max(0,Math.min(slides.length-1,i));
    pending=i; clearTimeout(timer); timer=setTimeout(function(){pending=null;},800);
    slides[i].scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
  }
  function current(){
    var navh=nav?nav.offsetHeight:0, cur=0, lim=navh+window.innerHeight*0.35;
    slides.forEach(function(s,i){ if(s.getBoundingClientRect().top<=lim) cur=i; });
    return cur;
  }
  document.addEventListener('keydown',function(e){
    if(e.metaKey||e.ctrlKey||e.altKey) return;
    var t=e.target; if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable)) return;
    if(document.querySelector('.is-open')) return;           // image lightbox open
    var k=e.key, base=pending!==null?pending:current();
    if(k==='ArrowDown'||k==='PageDown'||k==='ArrowRight'||(k===' '&&!e.shiftKey)){ e.preventDefault(); go(base+1); }
    else if(k==='ArrowUp'||k==='PageUp'||k==='ArrowLeft'||(k===' '&&e.shiftKey)){ e.preventDefault(); go(base-1); }
    else if(k==='Home'){ e.preventDefault(); go(0); }
    else if(k==='End'){ e.preventDefault(); go(slides.length-1); }
  });

  // ----- fit content to the slide -----
  function fit(){
    setNavH();
    [].slice.call(document.querySelectorAll('.slide-fit')).forEach(function(f){
      f.style.transform=''; f.style.width=''; f.style.marginBottom=''; f.style.transformOrigin='';
      if(!desk.matches) return;
      var par=f.parentElement, cs=getComputedStyle(par), keep=f.hasAttribute('data-keepw');
      var avail=par.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom), h=f.offsetHeight;
      if(!avail||h<=avail) return;
      var k=Math.max(0.35,avail/h);
      if(!keep){
        for(var n=0;n<4;n++){
          f.style.width=(100/k)+'%';
          h=f.offsetHeight;
          if(h*k<=avail+1) break;
          k=Math.max(0.35,avail/h);
        }
      }
      f.style.transformOrigin=keep?'top center':'top left';
      f.style.transform='scale('+k+')';
      f.style.marginBottom=(-(f.offsetHeight*(1-k)))+'px';
    });
  }
  var rt; function refit(){ clearTimeout(rt); rt=setTimeout(fit,60); }
  window.addEventListener('resize',refit);
  window.addEventListener('load',function(){ fit(); setTimeout(fit,400); setTimeout(fit,1500); });
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
  setNavH(); fit();
})();
