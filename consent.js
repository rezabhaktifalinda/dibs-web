/* Cookie notice + consent-gated Google Analytics 4 and Meta Pixel.
   Nothing from Google or Meta loads until the visitor taps Accept.
   IDs come from config.js, which the Vercel build writes from env variables. */
(function(){
  /* ---------- wording (replace with the text from the website doc) ---------- */
  var TEXT = {
    message: '[COOKIE TEXT FROM WEBSITE DOC]',
    accept:  '[ACCEPT]',
    decline: '[DECLINE]'
  };

  var KEY = 'dibsConsent';                    // 'granted' | 'denied'
  var cfg = window.DIBS_CONFIG || {};
  var GA_ID = cfg.gaId || '', PIXEL_ID = cfg.metaPixelId || '';
  var loaded = false, banner = null;

  function get(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function set(v){ try { localStorage.setItem(KEY, v); } catch(e){} }

  /* Consent Mode v2: everything denied until Accept. This only queues
     settings in memory — no Google script is fetched here. */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500
  });

  function addScript(src){
    var s = document.createElement('script');
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }

  function loadTrackers(){
    if (loaded) return;
    loaded = true;
    gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
    if (GA_ID){
      addScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID));
      gtag('js', new Date());
      gtag('config', GA_ID);
    }
    if (PIXEL_ID){
      /* Meta's standard base code, unrolled */
      var n = window.fbq = function(){ n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!window._fbq) window._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      addScript('https://connect.facebook.net/en_US/fbevents.js');
      fbq('set', 'autoConfig', false, PIXEL_ID); // no automatic form/button scraping
      fbq('init', PIXEL_ID);
      fbq('track', 'PageView');
    }
  }

  /* Withdrawing consent: tell Google and Meta, drop their cookies, then reload
     so their scripts are gone from the page entirely. */
  function stopTrackers(){
    gtag('consent', 'update', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: 'denied'
    });
    if (GA_ID) window['ga-disable-' + GA_ID] = true;
    if (window.fbq) fbq('consent', 'revoke');
    document.cookie.split(';').forEach(function(c){
      var name = c.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)){
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + host, '; domain=.' + host].forEach(function(d){
          document.cookie = name + '=; Max-Age=0; path=/' + d;
        });
      }
    });
    location.reload();
  }

  function choose(value){
    var before = get();
    set(value);
    hide();
    if (value === 'granted') loadTrackers();
    else if (before === 'granted' || loaded) stopTrackers();
  }

  /* ---------- the notice ---------- */
  var css =
    '.cookie{position:fixed;left:0;right:0;bottom:0;z-index:1000;' +
      'padding:16px clamp(16px,5vw,88px) calc(16px + env(safe-area-inset-bottom));' +
      'background:#FAF7EF;color:#2E2D26;border-top:1px solid #E9EAD0;' +
      'font-family:"Satoshi",-apple-system,BlinkMacSystemFont,sans-serif;font-weight:300;' +
      'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 28px;' +
      'box-shadow:0 -8px 24px rgba(35,38,18,.06)}' +
    '.cookie[hidden]{display:none}' +
    '.cookie p{flex:1 1 320px;margin:0;text-transform:uppercase;letter-spacing:.08em;' +
      'font-size:clamp(10px,.95vw,12px);line-height:1.8}' +
    '.cookie p a{color:#737700}' +
    '.cookie .cookie-btns{display:flex;gap:10px;flex:0 0 auto}' +
    '.cookie button{font:inherit;font-size:clamp(10px,.9vw,12px);font-weight:400;' +
      'text-transform:uppercase;letter-spacing:.2em;padding:12px 22px;cursor:pointer;' +
      'border:1px solid #737700;transition:background .25s ease,color .25s ease}' +
    '.cookie .cookie-accept{background:#737700;color:#FAF7EF}' +
    '.cookie .cookie-accept:hover{background:transparent;color:#737700}' +
    '.cookie .cookie-decline{background:transparent;color:#737700}' +
    '.cookie .cookie-decline:hover{background:#E9EAD0}' +
    '.cookie button:focus-visible{outline:2px solid #C8553D;outline-offset:3px}' +
    '@media (max-width:560px){.cookie .cookie-btns{width:100%}.cookie button{flex:1}}';

  function build(){
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    banner = document.createElement('div');
    banner.className = 'cookie';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie notice');
    banner.hidden = true;

    var p = document.createElement('p');
    p.textContent = TEXT.message + ' ';
    var link = document.createElement('a');
    link.href = '/privacy'; link.textContent = 'Privacy policy';
    p.appendChild(link);

    var btns = document.createElement('div');
    btns.className = 'cookie-btns';
    var decline = document.createElement('button');
    decline.type = 'button'; decline.className = 'cookie-decline'; decline.textContent = TEXT.decline;
    decline.addEventListener('click', function(){ choose('denied'); });
    var accept = document.createElement('button');
    accept.type = 'button'; accept.className = 'cookie-accept'; accept.textContent = TEXT.accept;
    accept.addEventListener('click', function(){ choose('granted'); });
    btns.appendChild(decline); btns.appendChild(accept);

    banner.appendChild(p); banner.appendChild(btns);
    document.body.appendChild(banner);
  }

  function show(){ if (!banner) build(); banner.hidden = false; }
  function hide(){ if (banner) banner.hidden = true; }

  /* ---------- public hooks ---------- */
  window.dibsConsent = {
    open: show,
    granted: function(){ return get() === 'granted'; },
    /* call only after a sign-up has actually been saved; sends no personal data */
    trackLead: function(){
      if (get() !== 'granted' || !loaded) return;
      if (GA_ID) gtag('event', 'generate_lead');
      if (window.fbq && PIXEL_ID) fbq('track', 'Lead');
    }
  };

  function init(){
    var choice = get();
    if (choice === 'granted') loadTrackers();
    else if (choice !== 'denied') show();
    document.addEventListener('click', function(e){
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t){ e.preventDefault(); show(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
