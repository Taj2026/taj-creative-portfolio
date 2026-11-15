// Keeps every full-height section the same height by scaling its content down to fit.
(function(){
  var desk=window.matchMedia('(min-width:901px) and (min-height:360px)');
  function fit(){
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
  fit();
})();
