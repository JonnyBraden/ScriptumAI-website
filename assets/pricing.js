/* Scriptum AI plan prices by jurisdiction.
   Edit this object to change a price, currency symbol or tax note.
   The Firm plan stays "Custom" on every jurisdiction.
   pricing.html shows the UK amounts for visitors without JavaScript;
   this script replaces the Starter and Pro figures, and the toggle labels. */
(function () {
  'use strict';

  var JURISDICTIONS = {
    uk: {
      label: 'UK',
      symbol: '£',
      starter: 79,
      pro: 119,
      note: 'Prices exclude VAT. Billed monthly.'
    },
    ie: {
      label: 'Ireland',
      symbol: '€',
      starter: 95,
      pro: 139,
      note: 'Prices exclude VAT. Billed monthly.'
    },
    us: {
      label: 'USA',
      symbol: '$',
      starter: 105,
      pro: 159,
      note: 'Prices exclude applicable taxes. Billed monthly.'
    },
    ca: {
      label: 'Canada',
      symbol: 'C$',
      starter: 149,
      pro: 225,
      note: 'Prices exclude applicable taxes. Billed monthly.'
    }
  };

  var STORAGE_KEY = 'scriptum-jurisdiction';

  /* Canonical IANA zones, plus legacy aliases some browsers still report. */
  var US_TIMEZONES = {
    'America/New_York': 1,
    'America/Detroit': 1,
    'America/Kentucky/Louisville': 1,
    'America/Louisville': 1,
    'America/Kentucky/Monticello': 1,
    'America/Indiana/Indianapolis': 1,
    'America/Indianapolis': 1,
    'America/Fort_Wayne': 1,
    'America/Knox_IN': 1,
    'America/Shiprock': 1,
    'US/East-Indiana': 1,
    'US/Michigan': 1,
    'US/Indiana-Starke': 1,
    'America/Indiana/Vincennes': 1,
    'America/Indiana/Winamac': 1,
    'America/Indiana/Marengo': 1,
    'America/Indiana/Petersburg': 1,
    'America/Indiana/Vevay': 1,
    'America/Chicago': 1,
    'America/Indiana/Tell_City': 1,
    'America/Indiana/Knox': 1,
    'America/Menominee': 1,
    'America/North_Dakota/Center': 1,
    'America/North_Dakota/New_Salem': 1,
    'America/North_Dakota/Beulah': 1,
    'America/Denver': 1,
    'America/Boise': 1,
    'America/Phoenix': 1,
    'America/Los_Angeles': 1,
    'America/Anchorage': 1,
    'America/Juneau': 1,
    'America/Sitka': 1,
    'America/Metlakatla': 1,
    'America/Yakutat': 1,
    'America/Nome': 1,
    'America/Adak': 1,
    'Pacific/Honolulu': 1,
    'America/Puerto_Rico': 1,
    'America/St_Thomas': 1,
    'America/Virgin': 1,
    'Pacific/Guam': 1,
    'Pacific/Saipan': 1,
    'Pacific/Pago_Pago': 1,
    'US/Eastern': 1,
    'US/Central': 1,
    'US/Mountain': 1,
    'US/Pacific': 1,
    'US/Alaska': 1,
    'US/Aleutian': 1,
    'US/Hawaii': 1
  };

  var CANADA_TIMEZONES = {
    'America/St_Johns': 1,
    'America/Halifax': 1,
    'America/Glace_Bay': 1,
    'America/Moncton': 1,
    'America/Goose_Bay': 1,
    'America/Blanc-Sablon': 1,
    'America/Toronto': 1,
    'America/Iqaluit': 1,
    'America/Atikokan': 1,
    'America/Winnipeg': 1,
    'America/Resolute': 1,
    'America/Rankin_Inlet': 1,
    'America/Regina': 1,
    'America/Swift_Current': 1,
    'America/Edmonton': 1,
    'America/Cambridge_Bay': 1,
    'America/Yellowknife': 1,
    'America/Inuvik': 1,
    'America/Creston': 1,
    'America/Dawson_Creek': 1,
    'America/Fort_Nelson': 1,
    'America/Whitehorse': 1,
    'America/Dawson': 1,
    'America/Vancouver': 1,
    'America/Rainy_River': 1,
    'America/Thunder_Bay': 1,
    'America/Nipigon': 1,
    'America/Pangnirtung': 1,
    'America/Coral_Harbour': 1,
    'America/Montreal': 1,
    'Canada/Newfoundland': 1,
    'Canada/Atlantic': 1,
    'Canada/Eastern': 1,
    'Canada/Central': 1,
    'Canada/Saskatchewan': 1,
    'Canada/Mountain': 1,
    'Canada/Pacific': 1,
    'Canada/Yukon': 1
  };

  function formatPrice(entry, amount) {
    return entry.symbol + String(amount);
  }

  function localeTags() {
    var tags = [];
    if (navigator.languages && navigator.languages.length) {
      for (var i = 0; i < navigator.languages.length; i++) tags.push(navigator.languages[i]);
    } else if (navigator.language) {
      tags.push(navigator.language);
    }
    return tags;
  }

  /* en-IE, en-US, en-CA and en-GB, including the same region on another
     language (for example fr-CA). The first matching tag wins, so a
     preferred en-GB stays on the UK even if en-US is also listed. */
  function jurisdictionFromTag(tag) {
    var normalised = String(tag || '').toLowerCase().replace(/_/g, '-');
    var match = normalised.match(/-(ie|us|ca|gb)(?:-|$)/);
    if (!match) return null;
    if (match[1] === 'ie') return 'ie';
    if (match[1] === 'us') return 'us';
    if (match[1] === 'ca') return 'ca';
    if (match[1] === 'gb') return 'uk';
    return null;
  }

  function jurisdictionFromLocales() {
    var tags = localeTags();
    for (var i = 0; i < tags.length; i++) {
      var id = jurisdictionFromTag(tags[i]);
      if (id) return id;
    }
    return null;
  }

  function jurisdictionFromTimezone() {
    var tz = '';
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (e) {
      return null;
    }
    if (tz === 'Europe/Dublin' || tz === 'Eire') return 'ie';
    if (CANADA_TIMEZONES[tz]) return 'ca';
    if (US_TIMEZONES[tz] || tz.indexOf('America/Indiana/') === 0 || tz.indexOf('America/Kentucky/') === 0 || tz.indexOf('America/North_Dakota/') === 0) return 'us';
    return null;
  }

  function readSaved() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      if (value && JURISDICTIONS[value]) return value;
    } catch (e) {}
    return null;
  }

  function remember(id) {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (e) {}
  }

  function applyJurisdiction(id, announce) {
    var entry = JURISDICTIONS[id];
    if (!entry) return;
    Object.keys(JURISDICTIONS).forEach(function (key) {
      var label = document.querySelector('label[for="jur-' + key + '"] .jur-label');
      if (label) label.textContent = JURISDICTIONS[key].label + ' ' + JURISDICTIONS[key].symbol;
    });
    var starter = document.querySelector('[data-plan="starter"]');
    var pro = document.querySelector('[data-plan="pro"]');
    var note = document.getElementById('price-note');
    if (starter) starter.textContent = formatPrice(entry, entry.starter);
    if (pro) pro.textContent = formatPrice(entry, entry.pro);
    if (note) note.textContent = entry.note;
    if (announce) {
      var status = document.getElementById('price-status');
      if (status) {
        status.textContent = 'Showing ' + entry.label + ' prices. Starter ' + formatPrice(entry, entry.starter) + ', Pro ' + formatPrice(entry, entry.pro) + ' per user per month. ' + entry.note;
      }
    }
  }

  var group = document.querySelector('.jurisdiction');
  if (!group) return;

  var initial = readSaved() || jurisdictionFromLocales() || jurisdictionFromTimezone() || 'uk';
  var selected = document.getElementById('jur-' + initial);
  if (selected) selected.checked = true;
  applyJurisdiction(initial, false);

  group.querySelectorAll('input[name="jurisdiction"]').forEach(function (input) {
    input.addEventListener('change', function () {
      if (!input.checked || !JURISDICTIONS[input.value]) return;
      applyJurisdiction(input.value, true);
      remember(input.value);
    });
  });
})();
