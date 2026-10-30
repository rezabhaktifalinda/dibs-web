/* Dibs cookie notice + Google Tag Manager, loaded only after consent.
   Basic Consent Mode: nothing from Google loads until the visitor allows Statistics.
   Categories: necessary (always on), statistics (GA4 via GTM), marketing (Meta Pixel, later).
   To change wording, edit TEXT below. To add the Meta Pixel later, set MARKETING_READY = true
   and add the Pixel tag in GTM with a "marketing" consent check. */
(function(){
  var GTM_ID = 'GTM-MTWNDGC3';         // DIBS container (GA4 G-WMH1T5N8MN set up inside GTM)
  var MARKETING_READY = false;          // Meta Pixel not set up yet
  var KEY = 'dibs_consent_v1';          // {"statistics":true,"marketing":false,"t":...}

  var TEXT = {
    title: 'Cookies, briefly',
    body: 'We use a few cookies to see which pages people read, so we can make Dibs better. Nothing loads until you say yes. You can change your mind any time in Cookie settings.',
    accept: 'Accept all',
    essential: 'Only essential',
    settings: 'Settings',
    save: 'Save choices',
    necessary: ['Necessary', 'Keeps the site working and remembers your choices. Always on.'],
    statistics: ['Statistics', 'Google Analytics: which pages people visit and how they found us. Counted together, never sold.'],
    marketing: ['Marketing', 'Helps us show Dibs on Instagram to people who might like it. Not in use yet.'],
    privacy: 'Privacy policy'
  };

  function read(){ try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch(e){ return null; } }
  function write(v){ try { localStorage.setItem(KEY, JSON.stringify(v)); } catch(e){} }

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', { analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' });

  var gtmLoaded = false;
  function apply(c){
    gtag('consent', 'update', {
      analytics_storage: c.statistics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    dataLayer.push({ event: 'dibs_consent', consent_statistics: !!c.statistics, consent_marketing: !!c.marketing });
    if ((c.statistics || c.marketing) && !gtmLoaded && /^GTM-[A-Z0-9]+$/.test(GTM_ID) && GTM_ID !== 'GTM-XXXXXXX'){
      gtmLoaded = true;
      dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
      document.head.appendChild(s);
    }
  }
  function clearGa(){
    document.cookie.split(';').forEach(function(c){
      var n = c.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_fbp|_fbc)/.test(n)){
        var h = location.hostname.replace(/^www\./,'');
        ['', '; domain=' + h, '; domain=.' + h].forEach(function(d){ document.cookie = n + '=; Max-Age=0; path=/' + d; });
      }
    });
  }

  /* ---------- UI ---------- */
  var css = ''
  + '.ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:90;max-width:560px;background:#FAF7EF;color:#232612;'
  + 'box-shadow:0 18px 50px rgba(0,0,0,.28);padding:22px 24px;font-family:Satoshi,-apple-system,sans-serif;font-weight:300;'
  + 'opacity:0;transform:translateY(12px);transition:opacity .3s,transform .3s}'
  + '.ck.show{opacity:1;transform:none}.ck[hidden]{display:none}'
  + '.ck-t{text-transform:uppercase;letter-spacing:.2em;font-size:11px;color:#6B6A5E}'
  + '.ck-b{text-transform:uppercase;letter-spacing:.07em;font-size:12px;line-height:1.75;margin-top:10px;color:#2E2D26}'
  + '.ck-b a{color:inherit}'
  + '.ck-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}'
  + '.ck-row button{font:inherit;font-weight:400;text-transform:uppercase;letter-spacing:.18em;font-size:11px;padding:13px 16px;cursor:pointer;border:1px solid #232612;background:transparent;color:#232612;flex:1 1 auto}'
  + '.ck-row button.pri{background:#737700;border-color:#737700;color:#FAF7EF}'
  + '.ck-row button:hover{background:#232612;color:#FAF7EF;border-color:#232612}'
  + '.ck-set{margin-top:14px;border-top:1px solid rgba(35,38,18,.15)}.ck-set[hidden]{display:none}'
  + '.ck-opt{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(35,38,18,.15)}'
  + '.ck-opt b{display:block;font-weight:400;text-transform:uppercase;letter-spacing:.14em;font-size:11px}'
  + '.ck-opt span{display:block;text-transform:uppercase;letter-spacing:.06em;font-size:10.5px;line-height:1.6;color:#6B6A5E;margin-top:4px}'
  + '.ck-sw{position:relative;flex:0 0 40px;height:22px;margin-top:2px}'
  + '.ck-sw input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}'
  + '.ck-sw i{position:absolute;inset:0;background:rgba(35,38,18,.2);border-radius:11px;transition:background .2s;pointer-events:none}'
  + '.ck-sw i::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#FAF7EF;transition:transform .2s}'
  + '.ck-sw input:checked+i{background:#737700}.ck-sw input:checked+i::after{transform:translateX(18px)}'
  + '.ck-sw input:disabled{cursor:default}.ck-sw input:disabled+i{opacity:.5}'
  + '@media (min-width:601px){.ck{left:auto}}'
  + '@media (max-width:600px){.ck{left:10px;right:10px;bottom:10px;padding:18px}}';

  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function opt(id, t, on, dis){
    return '<div class="ck-opt"><div><b>' + t[0] + '</b><span>' + t[1] + '</span></div>'
      + '<label class="ck-sw"><input type="checkbox" id="ck-' + id + '"' + (on ? ' checked' : '') + (dis ? ' disabled' : '') + ' aria-label="' + t[0] + '"><i></i></label></div>';
  }

  var box;
  function build(c){
    box = document.createElement('div');
    box.className = 'ck'; box.hidden = true;
    box.setAttribute('role','dialog'); box.setAttribute('aria-label', TEXT.title);
    box.innerHTML = '<p class="ck-t">' + TEXT.title + '</p>'
      + '<p class="ck-b">' + TEXT.body + ' <a href="/privacy">' + TEXT.privacy + '</a>.</p>'
      + '<div class="ck-set" hidden>'
      +   opt('nec', TEXT.necessary, true, true)
      +   opt('stat', TEXT.statistics, c ? c.statistics : false, false)
      +   opt('mkt', TEXT.marketing, c ? c.marketing : false, !MARKETING_READY)
      + '</div>'
      + '<div class="ck-row"><button type="button" class="pri" data-a="all">' + TEXT.accept + '</button>'
      + '<button type="button" data-a="ess">' + TEXT.essential + '</button>'
      + '<button type="button" data-a="set">' + TEXT.settings + '</button></div>';
    document.body.appendChild(box);
    box.addEventListener('click', function(e){
      var a = e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return;
      if (a === 'all') choose({ statistics:true, marketing: MARKETING_READY });
      else if (a === 'ess') choose({ statistics:false, marketing:false });
      else if (a === 'set'){
        var s = box.querySelector('.ck-set');
        if (s.hidden){ s.hidden = false; e.target.textContent = TEXT.save; e.target.className = 'pri'; box.querySelector('[data-a="all"]').className = ''; }
        else choose({ statistics: box.querySelector('#ck-stat').checked, marketing: MARKETING_READY && box.querySelector('#ck-mkt').checked });
      }
    });
  }
  function show(){ if (!box) build(read()); box.hidden = false; requestAnimationFrame(function(){ box.classList.add('show'); }); }
  function hide(){ if (!box) return; box.classList.remove('show'); setTimeout(function(){ box.hidden = true; }, 300); }

  function choose(c){
    var prev = read();
    c.t = Date.now(); write(c); hide(); apply(c);
    window.dispatchEvent(new CustomEvent('dibs:consent', { detail: c }));
    if (prev && prev.statistics && !c.statistics){ clearGa(); location.reload(); }
  }

  window.DibsConsent = { open: function(){ if (box) { box.remove(); box = null; } show(); var s = box.querySelector('.ck-set'); s.hidden = false; var b = box.querySelector('[data-a="set"]'); b.textContent = TEXT.save; b.className = 'pri'; box.querySelector('[data-a="all"]').className = ''; }, get: read };

  function init(){
    var c = read();
    if (c) apply(c); else show();
    document.querySelectorAll('[data-cookie-settings]').forEach(function(a){
      a.addEventListener('click', function(e){ e.preventDefault(); window.DibsConsent.open(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
