/* ============================================================
   bsgthailand.org · Rome Calendar (liturgical day banner)
   Migrated from fsgthailand.org — owns the Sacred liturgical
   feed for the Province (R12: Sacred lives under Province).
   Self-injecting: append <script src="/assets/js/rome-cal.js">
   in <head> of each page; no further HTML changes required.
   Data: /data/rome_calendar_2026.json
   ============================================================ */

(function () {
  // ---- Inject CSS once ----
  var css = '' +
    '.rome-cal { background:#0d2640; font-family: system-ui,-apple-system,sans-serif; position:sticky; top:0; z-index:1001; }' +
    '.rome-cal .rc-container { max-width:1200px; margin:0 auto; }' +
    '.rome-cal .rc-inner { display:flex; align-items:stretch; min-height:48px; }' +
    '.rome-cal .rc-date { background:linear-gradient(135deg,#8b0000,#6d0000); color:#fff; padding:10px 22px; display:flex; align-items:center; gap:10px; flex-shrink:0; font-family:"Cinzel","Playfair Display",Georgia,serif; font-size:14px; font-weight:600; letter-spacing:1px; }' +
    '.rome-cal .rc-cross { font-size:18px; opacity:0.85; }' +
    '.rome-cal .rc-items { display:flex; align-items:center; gap:6px; padding:8px 20px; flex-wrap:wrap; flex:1; }' +
    '.rome-cal .rc-tag { display:inline-flex; align-items:center; gap:6px; font-size:11.5px; color:rgba(255,255,255,0.88); padding:4px 12px; background:rgba(255,255,255,0.07); border-radius:18px; border:1px solid rgba(255,255,255,0.1); white-space:nowrap; }' +
    '.rome-cal .rc-tag .rc-label { color:#c9a74e; font-weight:600; font-size:9.5px; text-transform:uppercase; letter-spacing:0.5px; }' +
    '@media (max-width:767px){ .rome-cal .rc-inner{ flex-direction:column; } .rome-cal .rc-date{ padding:10px 16px; font-size:13px; justify-content:center; } .rome-cal .rc-items{ padding:8px 14px; justify-content:center; } .rome-cal .rc-tag{ font-size:10.5px; padding:3px 9px; } }' +
    /* Adjust the site-nav so it stays visible below the calendar */
    '.site-nav { top: 48px !important; }' +
    '@media (max-width:767px){ .site-nav { top: auto !important; } }';
  var style = document.createElement('style');
  style.setAttribute('data-rome-cal', '');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // ---- Inject HTML at top of body ----
  function inject() {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var d = new Date();
    var dateText = months[d.getMonth()] + ' ' + d.getDate() + ' · ' + days[d.getDay()];

    var section = document.createElement('section');
    section.className = 'rome-cal';
    section.innerHTML =
      '<div class="rc-container">' +
        '<div class="rc-inner">' +
          '<div class="rc-date"><span class="rc-cross">✠</span><span id="rc-date">' + dateText + '</span></div>' +
          '<div class="rc-items" id="rc-items">' +
            '<span class="rc-tag"><span class="rc-label">Season</span> <span>—</span></span>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.insertBefore(section, document.body.firstChild);

    // Determine the JSON URL relative to site root so it works from sub-pages
    var jsonUrl = '/data/rome_calendar_2026.json';
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var key = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

    fetch(jsonUrl)
      .then(function (r) { return r.json(); })
      .then(function (cal) {
        var entry = cal[key];
        if (!entry) return;
        var container = document.getElementById('rc-items');
        var html = '<span class="rc-tag"><span class="rc-label">Season</span> ' + (entry.season || '—') + '</span>';
        if (entry.saints)   html += ' <span class="rc-tag"><span class="rc-label">Saints</span> ' + entry.saints + '</span>';
        if (entry.special)  html += ' <span class="rc-tag"><span class="rc-label">Special</span> ' + entry.special + '</span>';
        if (entry.deceased) html += ' <span class="rc-tag"><span class="rc-label">Deceased</span> ' + entry.deceased + '</span>';
        container.innerHTML = html;
      })
      .catch(function () { /* silent — banner still shows the date */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
