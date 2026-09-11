/* Scriptum AI | Clause library explorer (product page preview)
   Three levels: clause type, captured instances, version history.
   All content is sample data generated from templates so that
   version chains read like real negotiations. Nothing is live. */
(function(){
  var root = document.getElementById('clx'); if(!root) return;
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  var ICO = {
    back:'<svg class="ico" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copy:'<svg class="ico" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 15V6a2 2 0 012-2h9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check:'<svg class="ico" viewBox="0 0 24 24"><path d="M5 12.5l4 4 10-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------- templates ---------- */
  var T = {
    time_limits: function(p){ return 'No Claim shall be brought unless the Investors have given '+(p.written?'written notice':'notice in writing')+' of the Claim to the Company within '+p.months+' months of the date of this Agreement'+(p.tax?' (or, in the case of a Claim under the Tax Warranties, within '+p.tax+' months)':'')+', setting out reasonable details of the Claim'+(p.estimate?' and a good faith estimate of the amount claimed':'')+'.'; },
    cap: function(p){ return 'The aggregate liability of the '+p.party+' in respect of all Claims shall not exceed '+(p.pct? p.pct+'% of the Subscription Price paid by the Investors' : 'the Subscription Price paid by the Investors')+(p.fundamental?', save that no cap shall apply to a Claim under the Fundamental Warranties':'')+'.'; },
    drag: function(p){ return 'If holders of not less than '+p.pct+'% of the '+p.cls+' (the "Dragging Shareholders") wish to transfer all of their Shares to a bona fide third party purchaser, the Dragging Shareholders may require all other Shareholders to sell their Shares on the same terms'+(p.floor?', provided that the price per Share is not less than \u00a3'+p.floor:'')+'.'; },
    tag: function(p){ return 'No transfer of Shares that would result in a person acquiring a Controlling Interest shall be made unless the proposed transferee has made an offer to all other Shareholders to acquire '+(p.all?'all of their Shares':'a proportionate number of their Shares')+' at the same price per Share and on terms no less favourable, open for acceptance for not less than '+p.days+' days.'; },
    costs: function(p){ return 'The Company shall pay '+(p.when==='completion'?'on the date of Completion':'within '+p.within+' Business Days after Completion')+' the reasonable legal'+(p.dd?', accounting and due diligence':'')+' fees of the '+(p.lead?'Lead Investor':'Investors')+(p.cap?' up to a maximum aggregate amount of \u00a3'+p.cap:'')+' plus VAT and disbursements.'; },
    knowledge: function(p){ return (p.q ? 'So far as the '+(p.who||'Founders')+' are aware, ' : '')+'there is no litigation, arbitration or administrative proceeding pending or threatened against the Company'+(p.material?' which is material to the Business':'')+', and there are no facts or circumstances likely to give rise to any such proceeding.'; },
    noncompete: function(p){ return 'Each Founder undertakes that for so long as they hold Shares'+(p.tail?' and for a period of '+p.tail+' months thereafter':'')+' they shall not '+(p.direct?'directly or indirectly ':'')+'carry on or be engaged in any business which competes with the Business'+(p.area?' within '+p.area:'')+'.'; },
    preemption: function(p){ return 'The Company shall not issue any New Securities unless it has first offered them to '+(p.all?'each Shareholder':'the Investors')+' in proportion to their existing holdings on the same terms, such offer to remain open for '+p.days+' days'+(p.oversub?', with any securities not taken up to be offered to those Shareholders who applied for their full entitlement':'')+'.'; }
  };

  var TYPES = [
    {slug:'time_limits', name:'Warranty claims: time limits', area:'Venture and growth', concept:'Limitations on claims', desc:'How long the investors have to notify a warranty claim.'},
    {slug:'cap', name:'Warranty claims: cap', area:'Venture and growth', concept:'Limitations on claims', desc:'Ceiling on the founders\u2019 or company\u2019s liability for claims.'},
    {slug:'knowledge', name:'Litigation warranty: knowledge qualifier', area:'Venture and growth', concept:'Warranties', desc:'Whether the litigation warranty is given absolutely or only so far as the founders are aware.'},
    {slug:'costs', name:'Investor costs', area:'Venture and growth', concept:'Costs', desc:'Who pays the investors\u2019 fees, when, and up to what amount.'},
    {slug:'drag', name:'Drag-along', area:'Venture and growth', concept:'Share transfers', desc:'Threshold at which majority holders can force a sale.'},
    {slug:'tag', name:'Tag-along', area:'Venture and growth', concept:'Share transfers', desc:'Minority right to join a sale to a new controller.'},
    {slug:'preemption', name:'Pre-emption on new issues', area:'Venture and growth', concept:'Share issues', desc:'Right of first refusal on new shares.'},
    {slug:'noncompete', name:'Founder non-compete', area:'Venture and growth', concept:'Restrictive covenants', desc:'Scope and tail of the founders\u2019 non-compete.'}
  ];

  /* Each instance: matter, client, side we acted for, doc, counterparty, and a
     chain of rounds. Each round is [dir, params, note]. The last round is the agreed form. */
  var I = {
    time_limits: [
      {m:'Causeway Series A', c:'Larne Robotics Limited', side:'Company', doc:'Subscription Agreement', cp:'Orchard Law', d:'2026-06-18', by:'S. Doherty', ch:[
        ['internal',{months:18,written:1},'Opening position from the firm precedent.'],
        ['incoming',{months:36,written:1,tax:84,estimate:1},'Orchard opened long, with a separate tax period.'],
        ['released',{months:24,written:1,tax:60},'Client would accept 24 with the tax tail cut to five years.'],
        ['incoming',{months:24,written:1,tax:72,estimate:1},'They held on estimates and split on tax.'],
        ['released',{months:24,written:1,tax:72},'Agreed. Estimates dropped as a trade for the tax period.']]},
      {m:'Glenarm Seed Round', c:'Glenarm Foods Limited', side:'Company', doc:'Subscription Agreement', cp:'Hillcrest & Co', d:'2026-03-04', by:'A. Murray', ch:[
        ['internal',{months:18,written:1},'Firm precedent.'],
        ['incoming',{months:24,written:0,estimate:1},''],
        ['released',{months:24,written:1},'Accepted 24 months, tidied wording.']]},
      {m:'Belfast Fibre Series B', c:'Causeway Ventures LP', side:'Investor', doc:'Subscription Agreement', cp:'Dunmore LLP', d:'2025-11-20', by:'S. Doherty', ch:[
        ['internal',{months:36,written:1,tax:84,estimate:1},'Investor-side opening: three years, seven on tax.'],
        ['incoming',{months:18,written:1},'Dunmore cut everything.'],
        ['released',{months:30,written:1,tax:72},''],
        ['incoming',{months:24,written:1,tax:72},'Client instructed us to accept 24 to keep the round moving.']]},
      {m:'Strand Retail growth round', c:'Strand Retail Group', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Orchard Law', d:'2025-05-09', by:'C. Kelly', ch:[
        ['internal',{months:18,written:1},''],
        ['incoming',{months:36,written:1,estimate:1},''],
        ['released',{months:24,written:1},'Same landing as every Orchard matter: 24 months.']]}
    ],
    cap: [
      {m:'Causeway Series A', c:'Larne Robotics Limited', side:'Company', doc:'Subscription Agreement', cp:'Orchard Law', d:'2026-06-18', by:'S. Doherty', ch:[
        ['internal',{party:'Founders',pct:50},'Founders exposed to half the round only.'],
        ['incoming',{party:'Founders and the Company',fundamental:1},'Full subscription price, no cap on fundamentals.'],
        ['released',{party:'Founders',pct:100},'Conceded 100% but kept fundamentals inside the cap.'],
        ['incoming',{party:'Founders',pct:100,fundamental:1},'They held on fundamentals. Client accepted.']]},
      {m:'Belfast Fibre Series B', c:'Causeway Ventures LP', side:'Investor', doc:'Subscription Agreement', cp:'Dunmore LLP', d:'2025-11-20', by:'S. Doherty', ch:[
        ['internal',{party:'Company and the Founders',fundamental:1},''],
        ['incoming',{party:'Company',pct:50},''],
        ['released',{party:'Company and the Founders',pct:100,fundamental:1},'Agreed at the full price with fundamentals uncapped.']]},
      {m:'Glenarm Seed Round', c:'Glenarm Foods Limited', side:'Company', doc:'Subscription Agreement', cp:'Hillcrest & Co', d:'2026-03-04', by:'A. Murray', ch:[
        ['internal',{party:'Founders',pct:50},''],
        ['incoming',{party:'Founders',pct:100},''],
        ['released',{party:'Founders',pct:75},'Hillcrest accepted 75%. Worth trying again.']]}
    ],
    knowledge: [
      {m:'Causeway Series A', c:'Larne Robotics Limited', side:'Company', doc:'Subscription Agreement', cp:'Orchard Law', d:'2026-06-18', by:'A. Murray', ch:[
        ['internal',{q:1,material:1},'Qualified and material, as always for the company side.'],
        ['incoming',{q:0,material:0},'Orchard stripped both qualifiers across Schedule 5.'],
        ['released',{q:1,material:1,who:'Founders'},'Held. Explained that founders cannot warrant what they do not know.'],
        ['incoming',{q:1,material:0},'They accepted knowledge, struck materiality. Agreed.']]},
      {m:'Strand Retail growth round', c:'Strand Retail Group', side:'Company', doc:'Subscription Agreement', cp:'Orchard Law', d:'2025-05-09', by:'C. Kelly', ch:[
        ['internal',{q:1,material:1},''],
        ['incoming',{q:0,material:0},'Same Orchard move as Causeway.'],
        ['released',{q:1,material:0},'Went straight to the known landing point.']]},
      {m:'Belfast Fibre Series B', c:'Causeway Ventures LP', side:'Investor', doc:'Subscription Agreement', cp:'Dunmore LLP', d:'2025-11-20', by:'S. Doherty', ch:[
        ['internal',{q:0,material:0},'Investor side: absolute warranty.'],
        ['incoming',{q:1,material:1,who:'Warrantors'},''],
        ['released',{q:1,material:0,who:'Warrantors'},'Accepted knowledge, refused materiality.']]},
      {m:'Mourne Dairy investment', c:'Mourne Dairy Limited', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Hillcrest & Co', d:'2024-09-12', by:'S. Doherty', ch:[
        ['internal',{q:1,material:1},''],
        ['released',{q:1,material:1},'Hillcrest did not touch it.']]}
    ],
    costs: [
      {m:'Causeway Series A', c:'Larne Robotics Limited', side:'Company', doc:'Subscription Agreement', cp:'Orchard Law', d:'2026-06-18', by:'S. Doherty', ch:[
        ['internal',{when:'after',within:10,lead:1,cap:'10,000'},'Capped and payable after completion.'],
        ['incoming',{when:'completion',lead:0,dd:1},'Uncapped, all investors, on completion.'],
        ['released',{when:'completion',lead:1,dd:1,cap:'15,000'},'Moved on timing and scope, held the cap.'],
        ['incoming',{when:'completion',lead:1,dd:1,cap:'20,000'},'Agreed at \u00a320,000. Two separate points: scope and quantum.']]},
      {m:'Glenarm Seed Round', c:'Glenarm Foods Limited', side:'Company', doc:'Subscription Agreement', cp:'Hillcrest & Co', d:'2026-03-04', by:'A. Murray', ch:[
        ['internal',{when:'after',within:5,lead:1,cap:'7,500'},''],
        ['incoming',{when:'completion',lead:1,cap:'12,500'},''],
        ['released',{when:'completion',lead:1,cap:'10,000'},'Split the difference.']]},
      {m:'Belfast Fibre Series B', c:'Causeway Ventures LP', side:'Investor', doc:'Subscription Agreement', cp:'Dunmore LLP', d:'2025-11-20', by:'C. Kelly', ch:[
        ['internal',{when:'completion',lead:0,dd:1},'Investor side: uncapped.'],
        ['incoming',{when:'after',within:10,lead:1,cap:'15,000'},''],
        ['released',{when:'completion',lead:0,dd:1,cap:'40,000'},'Agreed with a high cap covering all investors.']]}
    ],
    drag: [
      {m:'Causeway Series A', c:'Larne Robotics Limited', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Orchard Law', d:'2026-06-18', by:'S. Doherty', ch:[
        ['internal',{pct:75,cls:'Shares in issue'},'Founder-protective threshold.'],
        ['incoming',{pct:50,cls:'Series A Shares'},'Investor-only drag at a simple majority.'],
        ['released',{pct:66,cls:'Shares in issue',floor:'2.40'},'Two-thirds of all shares with a price floor.'],
        ['incoming',{pct:66,cls:'Shares in issue',floor:'2.40'},'Agreed.']]},
      {m:'Strand Retail growth round', c:'Strand Retail Group', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Orchard Law', d:'2025-05-09', by:'C. Kelly', ch:[
        ['internal',{pct:75,cls:'Shares in issue'},''],
        ['incoming',{pct:50,cls:'Series A Shares'},''],
        ['released',{pct:66,cls:'Shares in issue'},'No floor this time; client did not want one.']]},
      {m:'Mourne Dairy investment', c:'Mourne Dairy Limited', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Hillcrest & Co', d:'2024-09-12', by:'S. Doherty', ch:[
        ['internal',{pct:75,cls:'Shares in issue'},''],
        ['incoming',{pct:60,cls:'Shares in issue'},''],
        ['released',{pct:66,cls:'Shares in issue'},'']]}
    ],
    tag: [
      {m:'Causeway Series A', c:'Larne Robotics Limited', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Orchard Law', d:'2026-06-18', by:'A. Murray', ch:[
        ['internal',{all:1,days:21},''],
        ['incoming',{all:0,days:10},'Pro rata tag only, ten days.'],
        ['released',{all:1,days:15},'Held on a full tag, moved on timing.'],
        ['incoming',{all:1,days:15},'Agreed.']]},
      {m:'Belfast Fibre Series B', c:'Causeway Ventures LP', side:'Investor', doc:'Shareholders\u2019 Agreement', cp:'Dunmore LLP', d:'2025-11-20', by:'S. Doherty', ch:[
        ['internal',{all:1,days:20},''],
        ['released',{all:1,days:20},'Not contested.']]}
    ],
    preemption: [
      {m:'Causeway Series A', c:'Larne Robotics Limited', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Orchard Law', d:'2026-06-18', by:'C. Kelly', ch:[
        ['internal',{all:1,days:15},'Open to every shareholder.'],
        ['incoming',{all:0,days:20,oversub:1},'Investors only, with an oversubscription round.'],
        ['released',{all:1,days:15,oversub:1},'Everyone in, oversubscription accepted.'],
        ['incoming',{all:1,days:20,oversub:1},'Agreed at 20 days.']]},
      {m:'Glenarm Seed Round', c:'Glenarm Foods Limited', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Hillcrest & Co', d:'2026-03-04', by:'A. Murray', ch:[
        ['internal',{all:1,days:15},''],
        ['incoming',{all:1,days:20},''],
        ['released',{all:1,days:20},'']]},
      {m:'Strand Retail growth round', c:'Strand Retail Group', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Orchard Law', d:'2025-05-09', by:'S. Doherty', ch:[
        ['internal',{all:1,days:15},''],
        ['incoming',{all:0,days:20,oversub:1},''],
        ['released',{all:1,days:20,oversub:1},'Same shape as Causeway a year later.']]}
    ],
    noncompete: [
      {m:'Causeway Series A', c:'Larne Robotics Limited', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Orchard Law', d:'2026-06-18', by:'S. Doherty', ch:[
        ['internal',{tail:6,direct:0},'Short tail, no "indirectly".'],
        ['incoming',{tail:24,direct:1,area:'the United Kingdom and the Republic of Ireland'},'Two years, both islands.'],
        ['released',{tail:12,direct:1},'Traded "indirectly" for a shorter tail and no territory.'],
        ['incoming',{tail:12,direct:1,area:'Northern Ireland'},'Agreed with NI only as territory.']]},
      {m:'Mourne Dairy investment', c:'Mourne Dairy Limited', side:'Company', doc:'Shareholders\u2019 Agreement', cp:'Hillcrest & Co', d:'2024-09-12', by:'A. Murray', ch:[
        ['internal',{tail:6,direct:0},''],
        ['incoming',{tail:12,direct:1},''],
        ['released',{tail:12,direct:1},'Accepted.']]},
      {m:'Belfast Fibre Series B', c:'Causeway Ventures LP', side:'Investor', doc:'Shareholders\u2019 Agreement', cp:'Dunmore LLP', d:'2025-11-20', by:'S. Doherty', ch:[
        ['internal',{tail:24,direct:1,area:'the United Kingdom and the Republic of Ireland'},'Investor side opening.'],
        ['incoming',{tail:9,direct:0},''],
        ['released',{tail:18,direct:1,area:'the United Kingdom'},''],
        ['incoming',{tail:12,direct:1,area:'the United Kingdom'},'Client accepted 12 with UK territory.']]}
    ]
  };

  /* Expand chains into version objects with real text and dates. */
  var AUTHORS_CP = {'Orchard Law':'M. Quinn','Hillcrest & Co':'E. Hart','Dunmore LLP':'P. Lynch'};
  function addDays(d, n){ var x = new Date(d); x.setDate(x.getDate()+n); return x.toISOString().slice(0,10); }
  var DATA = {};
  TYPES.forEach(function(t){
    DATA[t.slug] = I[t.slug].map(function(inst, k){
      var start = addDays(inst.d, -inst.ch.length*9);
      var versions = inst.ch.map(function(r, i){
        var dir = r[0], last = i===inst.ch.length-1;
        return {round:i+1, dir:dir, party: dir==='incoming'?'counterparty':'firm', date: addDays(start, i*9), author: dir==='incoming'? AUTHORS_CP[inst.cp] : inst.by, text: T[t.slug](r[1]), note:r[2], agreed:last};
      });
      return {id:t.slug+'-'+k, matter:inst.m, client:inst.c, side:inst.side, doc:inst.doc, cp:inst.cp, date:inst.d, rounds:versions.length, agreed:versions[versions.length-1].text, note:inst.ch[inst.ch.length-1][2], versions:versions};
    });
  });

  /* ---------- word diff (LCS) ---------- */
  function tokens(s){ return s.match(/\S+|\s+/g) || []; }
  function diff(a, b){
    var A = tokens(a).filter(function(x){ return x.trim(); }), B = tokens(b).filter(function(x){ return x.trim(); });
    var n=A.length, m=B.length, L=[]; for(var i=0;i<=n;i++){ L[i]=new Array(m+1).fill(0); }
    for(i=n-1;i>=0;i--) for(var j=m-1;j>=0;j--) L[i][j] = A[i]===B[j] ? L[i+1][j+1]+1 : Math.max(L[i+1][j], L[i][j+1]);
    var out=[]; i=0; var j=0;
    while(i<n && j<m){
      if(A[i]===B[j]){ out.push(['=',A[i]]); i++; j++; }
      else if(L[i+1][j] >= L[i][j+1]){ out.push(['-',A[i]]); i++; }
      else { out.push(['+',B[j]]); j++; }
    }
    while(i<n) out.push(['-',A[i++]]); while(j<m) out.push(['+',B[j++]]);
    /* merge runs */
    var merged=[]; out.forEach(function(t){ var l=merged[merged.length-1]; if(l && l[0]===t[0]) l[1]+=' '+t[1]; else merged.push([t[0],t[1]]); });
    return merged.map(function(t){ var w=esc(t[1]); return t[0]==='='?w:(t[0]==='-'?'<span class="clx-del">'+w+'</span>':'<span class="clx-ins">'+w+'</span>'); }).join(' ');
  }

  /* ---------- state and rendering ---------- */
  var state = {level:1, slug:null, inst:null, sort:'newest', side:'all', doc:'all', cp:'all', clean:false};
  var list = root.querySelector('#clx-list'), panel = root.querySelector('#clx-panel');
  var DIRLABEL = {internal:'Internal draft', released:'Released to counterparty', incoming:'Received from counterparty'};
  function fmt(d){ var x=new Date(d); return x.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }

  function renderList(){
    var groups = {};
    TYPES.forEach(function(t){ (groups[t.concept] = groups[t.concept] || []).push(t); });
    list.innerHTML = '<div class="clx-area">Venture and growth</div>' + Object.keys(groups).map(function(g){
      return '<div class="clx-group">'+esc(g)+'</div>' + groups[g].map(function(t){
        return '<button type="button" class="clx-row'+(state.slug===t.slug?' on':'')+'" data-slug="'+t.slug+'"><span class="n">'+esc(t.name)+'</span><span class="c">'+DATA[t.slug].length+'</span></button>';
      }).join('');
    }).join('');
    list.querySelectorAll('.clx-row').forEach(function(b){ b.addEventListener('click', function(){ state.slug=b.dataset.slug; state.level=2; state.inst=null; render(); }); });
  }

  function renderHome(){
    var total = TYPES.reduce(function(a,t){ return a+DATA[t.slug].length; },0);
    panel.innerHTML = '<div class="clx-empty"><div class="clx-big">'+total+'</div><div>captured clauses across '+TYPES.length+' clause types</div><p>Choose a clause type on the left. Every instance shows the wording your firm agreed, who it was agreed with, and how it got there.</p></div>';
  }

  function renderInstances(){
    var t = TYPES.filter(function(x){ return x.slug===state.slug; })[0];
    var rows = DATA[state.slug].slice();
    var sides = uniq(rows.map(function(r){ return r.side; })), docs = uniq(rows.map(function(r){ return r.doc; })), cps = uniq(rows.map(function(r){ return r.cp; }));
    rows = rows.filter(function(r){ return (state.side==='all'||r.side===state.side) && (state.doc==='all'||r.doc===state.doc) && (state.cp==='all'||r.cp===state.cp); });
    rows.sort({newest:function(a,b){ return b.date<a.date?-1:1; }, oldest:function(a,b){ return a.date<b.date?-1:1; }, rounds:function(a,b){ return b.rounds-a.rounds; }, client:function(a,b){ return a.client<b.client?-1:1; }}[state.sort]);
    function sel(id, label, opts, cur){ return '<label class="clx-f">'+label+' <select id="'+id+'"><option value="all">All</option>'+opts.map(function(o){ return '<option'+(cur===o?' selected':'')+'>'+esc(o)+'</option>'; }).join('')+'</select></label>'; }
    panel.innerHTML = '<div class="clx-ph"><div><div class="clx-title">'+esc(t.name)+'</div><div class="clx-sub">'+esc(t.desc)+'</div></div><button type="button" class="clx-act" id="clx-copyall">'+ICO.copy+'Copy all shown</button></div>'
      + '<div class="clx-filters">'
      + '<label class="clx-f">Sort <select id="clx-sort"><option value="newest"'+(state.sort==='newest'?' selected':'')+'>Newest first</option><option value="oldest"'+(state.sort==='oldest'?' selected':'')+'>Oldest first</option><option value="rounds"'+(state.sort==='rounds'?' selected':'')+'>Most rounds</option><option value="client"'+(state.sort==='client'?' selected':'')+'>Client A to Z</option></select></label>'
      + sel('clx-side','Acting for',sides,state.side) + sel('clx-doc','Document',docs,state.doc) + sel('clx-cp','Counterparty',cps,state.cp)
      + '<span class="clx-count">'+rows.length+' of '+DATA[state.slug].length+'</span></div>'
      + '<div class="clx-inst-list">' + (rows.length ? rows.map(function(r){
        return '<div class="clx-inst'+(r.rounds>1?' clickable':'')+'" data-id="'+r.id+'"'+(r.rounds>1?' role="button" tabindex="0"':'')+'>'
          + '<div class="clx-ih"><span class="clx-m">'+esc(r.matter)+'</span><span class="clx-pill">'+esc(r.doc)+'</span><span class="clx-pill '+(r.side==='Investor'?'navy':'')+'">for the '+esc(r.side)+'</span><span class="clx-meta">'+esc(r.cp)+', '+fmt(r.date)+'</span></div>'
          + '<div class="clx-text">'+esc(r.agreed)+'</div>'
          + (r.note ? '<div class="clx-note">'+esc(r.note)+'</div>' : '')
          + '<div class="clx-if"><span class="clx-rounds">'+(r.rounds>1 ? 'View '+r.rounds+' rounds in this matter' : 'Agreed in one round')+'</span><button type="button" class="clx-act sm clx-copy" data-id="'+r.id+'">'+ICO.copy+'Copy</button></div></div>';
      }).join('') : '<div class="clx-empty"><p>No captured clauses match those filters. Clear one to widen the view.</p></div>') + '</div>';
    ['sort','side','doc','cp'].forEach(function(k){ panel.querySelector('#clx-'+k).addEventListener('change', function(){ state[k]=this.value; renderInstances(); }); });
    panel.querySelectorAll('.clx-inst.clickable').forEach(function(card){
      function open(){ state.inst = card.dataset.id; state.level=3; render(); }
      card.addEventListener('click', function(e){ if(e.target.closest('.clx-copy')) return; open(); });
      card.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
    });
    panel.querySelectorAll('.clx-copy').forEach(function(b){ b.addEventListener('click', function(){ var r=find(b.dataset.id); copy(b, r.agreed+'\n\n['+r.matter+', '+r.doc+', acting for the '+r.side+', agreed with '+r.cp+' on '+fmt(r.date)+']'); }); });
    panel.querySelector('#clx-copyall').addEventListener('click', function(){ copy(this, rows.map(function(r){ return r.agreed+'\n['+r.matter+', '+r.doc+', '+fmt(r.date)+']'; }).join('\n\n')); });
  }

  function renderHistory(){
    var r = find(state.inst), t = TYPES.filter(function(x){ return x.slug===state.slug; })[0];
    panel.innerHTML = '<div class="clx-ph"><button type="button" class="clx-act" id="clx-back">'+ICO.back+'Back to '+esc(t.name)+'</button><div class="clx-hactions"><button type="button" class="clx-act" id="clx-clean" aria-pressed="'+state.clean+'">'+(state.clean?'Show changes':'Clean text')+'</button><button type="button" class="clx-act" id="clx-copyhist">'+ICO.copy+'Copy full history</button></div></div>'
      + '<div class="clx-hh"><div class="clx-title">'+esc(r.matter)+'</div><div class="clx-sub">'+esc(t.name)+' in the '+esc(r.doc)+', acting for the '+esc(r.side)+' against '+esc(r.cp)+'. '+r.rounds+' rounds.</div></div>'
      + '<div class="clx-tl">' + r.versions.map(function(v, i){
        var body = (i===0 || state.clean) ? esc(v.text) : diff(r.versions[i-1].text, v.text);
        var cls = v.agreed ? 'agreed' : v.dir;
        return '<div class="clx-v '+cls+'"><div class="clx-vh"><span class="clx-dot"></span><span class="clx-vr">Round '+v.round+'</span><span class="clx-vd">'+(v.agreed ? 'Agreed form' : DIRLABEL[v.dir])+'</span><span class="clx-meta">'+esc(v.author)+', '+fmt(v.date)+'</span></div>'
          + '<div class="clx-text">'+body+'</div>'
          + (v.note ? '<div class="clx-note">'+esc(v.note)+'</div>' : '')
          + '<div class="clx-if"><button type="button" class="clx-act sm clx-copyv" data-i="'+i+'">'+ICO.copy+'Copy'+(v.agreed?' agreed text':'')+'</button></div></div>';
      }).join('') + '</div>';
    panel.querySelector('#clx-back').addEventListener('click', function(){ state.level=2; state.inst=null; render(); });
    panel.querySelector('#clx-clean').addEventListener('click', function(){ state.clean=!state.clean; renderHistory(); });
    panel.querySelectorAll('.clx-copyv').forEach(function(b){ b.addEventListener('click', function(){ var v=r.versions[+b.dataset.i]; copy(b, v.text+'\n\n[Round '+v.round+', '+(v.agreed?'agreed form':DIRLABEL[v.dir])+', '+v.author+', '+fmt(v.date)+']'); }); });
    panel.querySelector('#clx-copyhist').addEventListener('click', function(){ copy(this, r.matter+' / '+t.name+'\n\n'+r.versions.map(function(v){ return 'Round '+v.round+' ('+(v.agreed?'agreed':DIRLABEL[v.dir])+', '+v.author+', '+fmt(v.date)+')\n'+v.text+(v.note?'\nNote: '+v.note:''); }).join('\n\n')); });
    panel.scrollTop = 0;
  }

  function find(id){ for(var k in DATA){ for(var i=0;i<DATA[k].length;i++) if(DATA[k][i].id===id) return DATA[k][i]; } }
  function uniq(a){ return a.filter(function(x,i){ return a.indexOf(x)===i; }); }
  function copy(btn, text){
    function done(){ var old=btn.innerHTML; btn.innerHTML=ICO.check+'Copied'; btn.classList.add('ok'); setTimeout(function(){ btn.innerHTML=old; btn.classList.remove('ok'); }, 1500); }
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done, done); }
    else { var ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); done(); }
  }
  function render(){
    renderList();
    root.classList.toggle('clx-deep', state.level>1);
    if(state.level===1) renderHome(); else if(state.level===2) renderInstances(); else renderHistory();
  }
  root.querySelector('#clx-home').addEventListener('click', function(){ state.level=1; state.slug=null; state.inst=null; render(); });
  /* Small public API so the product page can drive the explorer from scroll position. */
  window.CLX = {
    home: function(){ state.level=1; state.slug=null; state.inst=null; render(); },
    type: function(slug){ if(!DATA[slug]) return; state.level=2; state.slug=slug; state.inst=null; render(); },
    history: function(id){ var r=find(id); if(!r) return; state.level=3; state.slug=id.split('-')[0]; state.inst=id; render(); }
  };
  render();
})();
