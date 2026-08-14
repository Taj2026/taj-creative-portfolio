/* Lightweight image lightbox: click a small content image to expand it to a
   medium size in an overlay. Excludes hero images, links, logos, nav/footer,
   and animation posters. No dependencies; injects its own styles. */
(function () {
  var CSS =
    '.lb-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;' +
    'padding:6vh 6vw;background:rgba(8,8,10,.82);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);' +
    'opacity:0;visibility:hidden;transition:opacity .28s ease,visibility .28s ease}' +
    '.lb-overlay.is-open{opacity:1;visibility:visible}' +
    '.lb-img{max-width:min(860px,86vw);max-height:82vh;width:auto;height:auto;object-fit:contain;' +
    'border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,.6);transform:scale(.96);transition:transform .28s ease}' +
    '.lb-overlay.is-open .lb-img{transform:scale(1)}' +
    '.lb-close{position:fixed;top:22px;right:26px;width:34px;height:34px;border-radius:50%;border:1px solid #fff;' +
    'background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;' +
    'transition:background .2s ease}' +
    '.lb-close:hover{background:rgba(255,255,255,.14)}' +
    'img[data-lb]{cursor:zoom-in}' +
    '@media(prefers-reduced-motion:reduce){.lb-overlay,.lb-img{transition:none}}';

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var ov = document.createElement('div');
    ov.className = 'lb-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    var img = document.createElement('img');
    img.className = 'lb-img';
    img.alt = '';
    var btn = document.createElement('button');
    btn.className = 'lb-close';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Close');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M6 6 18 18M18 6 6 18"/></svg>';
    ov.appendChild(img);
    ov.appendChild(btn);
    document.body.appendChild(ov);

    function open(src, alt) {
      img.src = src;
      img.alt = alt || '';
      ov.classList.add('is-open');
      document.documentElement.style.overflow = 'hidden';
    }
    function close() {
      ov.classList.remove('is-open');
      document.documentElement.style.overflow = '';
    }
    btn.addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ov.classList.contains('is-open')) close();
    });

    function eligible(x) {
      if (x.closest('a')) return false;                                   // linked thumbnails
      if (x.closest('.dvisual')) return false;                            // case-study hero
      if (x.classList.contains('embed-poster') || x.closest('.embed')) return false; // animation posters
      if (x.closest('nav, footer, .site-footer, .dnav, .fnav, .prev-logos, .hero')) return false; // nav / footer / logos / home hero
      var s = x.getAttribute('src') || '';
      if (/\.svg(\?|$)/i.test(s)) return false;                           // logos
      return true;
    }

    Array.prototype.forEach.call(document.querySelectorAll('img'), function (x) {
      if (!eligible(x)) return;
      x.setAttribute('data-lb', '1');
      x.addEventListener('click', function () { open(x.currentSrc || x.src, x.alt); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
