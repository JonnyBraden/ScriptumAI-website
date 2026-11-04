/* ============================================================
   Scriptum AI — cookie consent and Google Analytics 4
   ------------------------------------------------------------
   The GA4 measurement ID is the GA_MEASUREMENT_ID constant below
   (Admin → Data streams → Web → Measurement ID).

   If that constant is set back to the placeholder 'G-XXXXXXXXXX',
   this script does not load gtag.js and does not send any
   request to Google.
   ============================================================ */
var GA_MEASUREMENT_ID = 'G-KYCT58VXEP';

(function () {
  'use strict';

  if (window.__scriptumConsentLoaded) return;
  window.__scriptumConsentLoaded = true;

  var STORAGE_KEY = 'scriptum-cookie-consent';
  var CONSENT_VERSION = 1;
  var CONSENT_MONTHS = 12;
  var PLACEHOLDER_ID = 'G-XXXXXXXXXX';

  /* Consent Mode v2. Advertising stays denied: this site only uses analytics. */
  var CONSENT_DENIED = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  };

  var analyticsAllowed = false;
  var gaScriptInserted = false;
  var activeRecord = null;
  var banner;
  var settingsBtn;
  var choicePanel;
  var prefsPanel;
  var choiceTitle;
  var prefsTitle;
  var analyticsSwitch;
  var analyticsState;

  function measurementId() {
    return String(GA_MEASUREMENT_ID || '').trim().toUpperCase();
  }

  function measurementIdIsConfigured() {
    var id = measurementId();
    return id !== PLACEHOLDER_ID && /^G-[A-Z0-9]+$/.test(id);
  }

  function ensureGtagStub() {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function () { window.dataLayer.push(arguments); };
    }
  }

  function consentUpdate(analyticsGranted) {
    return {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: analyticsGranted ? 'granted' : 'denied'
    };
  }

  /* Basic consent mode: gtag.js is added only after analytics consent, and only with a real ID. */
  function loadAnalytics() {
    if (!measurementIdIsConfigured()) return;
    var id = measurementId();
    window['ga-disable-' + id] = false;
    ensureGtagStub();
    if (!gaScriptInserted) {
      window.gtag('consent', 'default', CONSENT_DENIED);
      window.gtag('set', 'ads_data_redaction', true);
      window.gtag('consent', 'update', consentUpdate(true));
      window.gtag('js', new Date());
      window.gtag('config', id);
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      script.setAttribute('data-scriptum-ga', 'true');
      document.head.appendChild(script);
      gaScriptInserted = true;
    } else {
      window.gtag('consent', 'update', consentUpdate(true));
    }
  }

  function cookieNames() {
    return document.cookie.split(';').map(function (part) {
      return part.split('=')[0].replace(/^\s+|\s+$/g, '');
    }).filter(function (name) {
      return name === '_ga' ||
        name.indexOf('_ga_') === 0 ||
        name === '_gid' ||
        name.indexOf('_gat') === 0 ||
        name.indexOf('_gac_') === 0 ||
        name === '_gcl_au';
    });
  }

  function expireCookie(name) {
    var host = location.hostname;
    var domains = ['', host, '.' + host];
    var labels = host.split('.');
    var i;
    for (i = 1; i < labels.length; i++) {
      var parent = labels.slice(i).join('.');
      domains.push(parent);
      domains.push('.' + parent);
    }
    var suffixes = [
      '; path=/',
      '; path=/; Secure',
      '; path=/; SameSite=Lax',
      '; path=/; Secure; SameSite=Lax',
      '; path=/; Secure; SameSite=None'
    ];
    domains.forEach(function (domain) {
      suffixes.forEach(function (suffix) {
        var cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0' + suffix;
        if (domain) cookie += '; domain=' + domain;
        document.cookie = cookie;
      });
    });
  }

  function deleteAnalyticsCookies() {
    cookieNames().forEach(expireCookie);
  }

  function stopAnalytics() {
    analyticsAllowed = false;
    var id = measurementId();
    if (id) window['ga-disable-' + id] = true;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', CONSENT_DENIED);
    }
    deleteAnalyticsCookies();
    [200, 800, 2000].forEach(function (delay) {
      setTimeout(function () {
        if (!analyticsAllowed) deleteAnalyticsCookies();
      }, delay);
    });
  }

  function readStoredConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.version !== CONSENT_VERSION) return null;
      if (typeof data.analytics !== 'boolean' || typeof data.updatedAt !== 'string') return null;
      var updated = new Date(data.updatedAt);
      if (isNaN(updated.getTime())) return null;
      var expires = new Date(updated.getTime());
      expires.setMonth(expires.getMonth() + CONSENT_MONTHS);
      if (Date.now() >= expires.getTime()) return null;
      return data;
    } catch (err) {
      return null;
    }
  }

  function persist(analytics) {
    activeRecord = {
      version: CONSENT_VERSION,
      analytics: analytics,
      necessary: true,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeRecord));
    } catch (err) {}
    if (analytics) {
      analyticsAllowed = true;
      loadAnalytics();
    } else {
      stopAnalytics();
    }
    hideBanner();
  }

  function privacyHref() {
    var links = document.querySelectorAll('a');
    var i;
    for (i = 0; i < links.length; i++) {
      var text = (links[i].textContent || '').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '').toLowerCase();
      if (text !== 'privacy policy' && text !== 'privacy') continue;
      var href = links[i].getAttribute('href') || '';
      if (!href || href === '#' || href.indexOf('javascript:') === 0) continue;
      return href;
    }
    return '';
  }

  function setSwitch(on) {
    analyticsSwitch.setAttribute('aria-checked', on ? 'true' : 'false');
    analyticsState.textContent = on ? 'On' : 'Off';
  }

  function switchIsOn() {
    return analyticsSwitch.getAttribute('aria-checked') === 'true';
  }

  function syncSwitchFromRecord() {
    setSwitch(!!(activeRecord && activeRecord.analytics));
  }

  function syncPageOffset() {
    if (!banner || banner.hidden) {
      document.body.style.paddingBottom = '';
      return;
    }
    var rect = banner.getBoundingClientRect();
    var overlap = Math.max(0, window.innerHeight - rect.top);
    document.body.style.paddingBottom = Math.ceil(overlap) + 'px';
  }

  function focusWithoutScroll(node) {
    if (!node || typeof node.focus !== 'function') return;
    try {
      node.focus({ preventScroll: true });
    } catch (err) {
      node.focus();
    }
  }

  function showBanner(view, moveFocus) {
    var prefs = view === 'preferences';
    banner.hidden = false;
    choicePanel.hidden = prefs;
    prefsPanel.hidden = !prefs;
    banner.setAttribute('aria-labelledby', prefs ? 'cookie-prefs-title' : 'cookie-choice-title');
    banner.setAttribute('aria-describedby', prefs ? 'cookie-prefs-text' : 'cookie-banner-text');
    if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'true');
    if (prefs) syncSwitchFromRecord();
    syncPageOffset();
    if (moveFocus) focusWithoutScroll(banner);
  }

  function hideBanner() {
    banner.hidden = true;
    choicePanel.hidden = false;
    prefsPanel.hidden = true;
    if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'false');
    syncPageOffset();
    if (settingsBtn && banner.contains(document.activeElement)) focusWithoutScroll(settingsBtn);
  }

  function makeButton(className, text) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    return button;
  }

  function buildBanner() {
    banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.tabIndex = -1;
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'cookie-choice-title');
    banner.hidden = true;

    choicePanel = document.createElement('div');
    choicePanel.className = 'cookie-banner__panel';

    choiceTitle = document.createElement('h2');
    choiceTitle.id = 'cookie-choice-title';
    choiceTitle.className = 'cookie-banner__title';
    choiceTitle.textContent = 'Cookies on this site';

    var choiceText = document.createElement('p');
    choiceText.className = 'cookie-banner__text';
    choiceText.id = 'cookie-banner-text';
    choiceText.textContent = 'We use optional analytics cookies to understand how our site is used.';
    var policyHref = privacyHref();
    if (policyHref) {
      choiceText.appendChild(document.createTextNode(' See our '));
      var policyLink = document.createElement('a');
      policyLink.href = policyHref;
      policyLink.textContent = 'privacy policy';
      choiceText.appendChild(policyLink);
      choiceText.appendChild(document.createTextNode('.'));
    }

    var acceptBtn = makeButton('cookie-banner__btn cookie-banner__accept', 'Accept all');
    var rejectBtn = makeButton('cookie-banner__btn cookie-banner__reject', 'Reject all');
    var manageBtn = makeButton('cookie-banner__btn cookie-banner__manage', 'Manage preferences');
    acceptBtn.addEventListener('click', function () { persist(true); });
    rejectBtn.addEventListener('click', function () { persist(false); });
    manageBtn.addEventListener('click', function () { showBanner('preferences', true); });

    var choiceActions = document.createElement('div');
    choiceActions.className = 'cookie-banner__choices';
    choiceActions.appendChild(acceptBtn);
    choiceActions.appendChild(rejectBtn);
    choiceActions.appendChild(manageBtn);

    choicePanel.appendChild(choiceTitle);
    choicePanel.appendChild(choiceText);
    choicePanel.appendChild(choiceActions);

    prefsPanel = document.createElement('div');
    prefsPanel.className = 'cookie-banner__panel';
    prefsPanel.hidden = true;

    prefsTitle = document.createElement('h2');
    prefsTitle.id = 'cookie-prefs-title';
    prefsTitle.className = 'cookie-banner__title';
    prefsTitle.textContent = 'Cookie preferences';

    var prefsText = document.createElement('p');
    prefsText.className = 'cookie-banner__text';
    prefsText.id = 'cookie-prefs-text';
    prefsText.textContent = 'Strictly necessary storage is always on. Analytics cookies are optional.';

    function preferenceRow(name, description, control, state) {
      var row = document.createElement('div');
      row.className = 'cookie-pref';
      var copy = document.createElement('div');
      var nameEl = document.createElement('p');
      nameEl.className = 'cookie-pref__name';
      nameEl.textContent = name;
      var descEl = document.createElement('p');
      descEl.className = 'cookie-pref__desc';
      descEl.textContent = description;
      copy.appendChild(nameEl);
      copy.appendChild(descEl);
      var side = document.createElement('div');
      side.className = 'cookie-pref__side';
      side.appendChild(state);
      side.appendChild(control);
      row.appendChild(copy);
      row.appendChild(side);
      return row;
    }

    var necessaryState = document.createElement('span');
    necessaryState.className = 'cookie-switch-state';
    necessaryState.textContent = 'On';
    var necessarySwitch = document.createElement('span');
    necessarySwitch.className = 'cookie-switch is-locked';
    necessarySwitch.setAttribute('role', 'switch');
    necessarySwitch.setAttribute('aria-checked', 'true');
    necessarySwitch.setAttribute('aria-disabled', 'true');
    necessarySwitch.setAttribute('aria-label', 'Strictly necessary, always on');

    analyticsState = document.createElement('span');
    analyticsState.className = 'cookie-switch-state';
    analyticsState.id = 'cookie-analytics-state';
    analyticsState.textContent = 'Off';
    analyticsSwitch = document.createElement('button');
    analyticsSwitch.type = 'button';
    analyticsSwitch.className = 'cookie-switch';
    analyticsSwitch.id = 'cookie-analytics-switch';
    analyticsSwitch.setAttribute('role', 'switch');
    analyticsSwitch.setAttribute('aria-checked', 'false');
    analyticsSwitch.setAttribute('aria-describedby', 'cookie-analytics-state');
    analyticsSwitch.setAttribute('aria-label', 'Analytics cookies');
    analyticsSwitch.addEventListener('click', function () { setSwitch(!switchIsOn()); });

    var saveBtn = makeButton('cookie-banner__btn cookie-banner__save', 'Save preferences');
    var prefsAccept = makeButton('cookie-banner__btn cookie-banner__accept', 'Accept all');
    var prefsReject = makeButton('cookie-banner__btn cookie-banner__reject', 'Reject all');
    var backBtn = makeButton('cookie-banner__btn cookie-banner__back', 'Back');
    saveBtn.addEventListener('click', function () { persist(switchIsOn()); });
    prefsAccept.addEventListener('click', function () { persist(true); });
    prefsReject.addEventListener('click', function () { persist(false); });
    backBtn.addEventListener('click', function () { showBanner('choice', true); });

    var prefsActions = document.createElement('div');
    prefsActions.className = 'cookie-banner__choices';
    prefsActions.appendChild(prefsAccept);
    prefsActions.appendChild(prefsReject);
    prefsActions.appendChild(saveBtn);
    prefsActions.appendChild(backBtn);

    prefsPanel.appendChild(prefsTitle);
    prefsPanel.appendChild(prefsText);
    prefsPanel.appendChild(preferenceRow(
      'Strictly necessary',
      'Always on. Remembers this choice on this browser.',
      necessarySwitch,
      necessaryState
    ));
    prefsPanel.appendChild(preferenceRow(
      'Analytics',
      'Helps us understand how the site is used. Off until you opt in.',
      analyticsSwitch,
      analyticsState
    ));
    prefsPanel.appendChild(prefsActions);

    banner.appendChild(choicePanel);
    banner.appendChild(prefsPanel);
    banner.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (!prefsPanel.hidden) {
        event.stopPropagation();
        showBanner('choice', true);
      }
    });

    document.body.insertBefore(banner, document.body.firstChild);
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(syncPageOffset).observe(banner);
    }
    window.addEventListener('resize', syncPageOffset);
  }

  function mountSettingsLink() {
    if (document.getElementById('cookie-settings-link')) {
      return document.getElementById('cookie-settings-link');
    }
    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'cookie-settings-link';
    button.className = 'cookie-settings';
    button.textContent = 'Cookie settings';
    button.setAttribute('aria-controls', 'cookie-banner');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', function () {
      showBanner('preferences', true);
    });

    var footer = document.querySelector('footer.site-footer') || document.querySelector('footer');
    var company = null;
    if (footer) {
      var cols = footer.querySelectorAll('.footer-col');
      var i;
      for (i = 0; i < cols.length; i++) {
        var label = cols[i].querySelector('strong');
        if (label && /company/i.test(label.textContent || '')) {
          company = cols[i];
          break;
        }
      }
    }
    if (company) company.appendChild(button);
    else if (footer && footer.querySelector('.footer-links')) footer.querySelector('.footer-links').appendChild(button);
    else if (footer) footer.appendChild(button);
    else document.body.appendChild(button);
    return button;
  }

  activeRecord = readStoredConsent();
  settingsBtn = mountSettingsLink();
  buildBanner();

  if (activeRecord && activeRecord.analytics) {
    analyticsAllowed = true;
    loadAnalytics();
  } else {
    stopAnalytics();
    if (!activeRecord) showBanner('choice', true);
  }
})();
