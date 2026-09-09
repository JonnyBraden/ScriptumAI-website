/* Scriptum AI | Interactive product wireframes
   Each wireframe is a .wf element with a data-wf name. This file
   registers one init function per name, snapshots the markup so a
   "Replay" button can restore it, and wires the sample behaviour.
   All data is sample data; nothing here talks to a server. */
(function(){
  var reg = {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function wait(ms){ return reduced ? 0 : ms; }
  function $(root, sel){ return root.querySelector(sel); }
  function $$(root, sel){ return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  var ICO = {
    check:'<svg class="ico" viewBox="0 0 24 24"><path d="M5 12.5l4 4 10-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock:'<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    spark:'<svg class="ico" viewBox="0 0 24 24"><path d="M12 3l1.9 5.4L19 10l-5.1 1.6L12 17l-1.9-5.4L5 10l5.1-1.6z" fill="currentColor"/></svg>',
    msg:'<svg class="ico" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    x:'<svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    lock:'<svg class="ico" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    replay:'<svg class="ico" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 4v5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  function note(cls, ico, text){ return '<div class="wf-note '+(cls||'')+'">'+(ICO[ico]||'')+esc(text)+'</div>'; }
  function spinner(text){ return '<div class="wf-note"><span class="wf-spin"></span>'+esc(text)+'</div>'; }

  /* ---------------- DRAFT ---------------- */

  reg['draft-levels'] = function(w){
    var doc = $(w,'.wf-doc'), pane = $(w,'.wf-pane');
    var docs = {
      clause:'<div class="h">9. Limitation of liability</div><p>9.1 Nothing in this Agreement limits liability for death, personal injury or fraud.</p><div class="sel" id="dl-target">9.2 <span class="ghost">Subject to clause 9.1, the Supplier\u2019s total liability... [cursor here]</span></div><p class="ghost">9.3 ...</p>',
      template:'<div class="h">Subscription Agreement</div><p>THIS AGREEMENT is made between <b id="tp-co">[Company]</b> and <b id="tp-inv">[Investor]</b>.</p><p>1.1 The Investor shall subscribe for <b id="tp-shares">[number]</b> Series A Shares for an aggregate subscription price of <b id="tp-amt">[amount]</b>.</p><p class="ghost">1.2 Completion shall take place on ...</p>',
      full:'<div class="h">Share Purchase Agreement</div><p class="ghost" id="fd-body">Blank document. Structure and first-pass drafting will appear here.</p>'
    };
    var panes = {
      clause:'<div class="wf-lab">SELECTED CLAUSE</div><div class="wf-card wash"><b>9.2 Liability cap</b><div style="font-size:12px;color:var(--wf-ink2)">Commercial services agreement, acting for the Supplier</div></div><div class="wf-actions"><button class="wf-btn" id="dl-suggest">'+ICO.spark+'Suggest from precedent bank</button></div><div id="dl-out"></div>',
      template:'<div class="wf-lab">DEAL CONTEXT</div><div class="wf-row"><span style="width:70px;color:var(--wf-ink3)">Company</span><input class="wf-input" value="Larne Robotics Limited"></div><div class="wf-row"><span style="width:70px;color:var(--wf-ink3)">Investor</span><input class="wf-input" value="Causeway Ventures LP"></div><div class="wf-row"><span style="width:70px;color:var(--wf-ink3)">Shares</span><input class="wf-input" value="120,000"></div><div class="wf-row"><span style="width:70px;color:var(--wf-ink3)">Amount</span><input class="wf-input" value="\u00a31,500,000"></div><div class="wf-actions"><button class="wf-btn" id="tp-go">Populate template</button></div><div id="tp-out"></div>',
      full:'<div class="wf-lab">MATTER BRIEF</div><textarea rows="4">Sale of 100% of the shares in Mourne Dairy Limited. Acting for the buyer. Locked box, \u00a34.2m consideration, 18 month warranty period, cap at 50% of price.</textarea><div class="wf-actions"><button class="wf-btn" id="fd-go">'+ICO.spark+'Generate first draft</button></div><div id="fd-out"></div>'
    };
    function show(k){
      $$(w,'.wf-tabs .wf-act').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.k===k); });
      doc.innerHTML = docs[k]; pane.querySelector('#dl-body').innerHTML = panes[k];
      if(k==='clause') wireClause(); if(k==='template') wireTemplate(); if(k==='full') wireFull();
    }
    function wireClause(){
      $(w,'#dl-suggest').addEventListener('click', function(){
        this.disabled = true; var out=$(w,'#dl-out'); out.innerHTML = spinner('Reading 14 matters where your firm acted for a supplier');
        setTimeout(function(){
          out.innerHTML = '<div class="wf-card wf-fade"><div class="wf-head"><span class="wf-pill navy">firm-preferred wording</span><span class="wf-meta">used in 11 of 14 matters</span></div><div class="wf-tc">Subject to clause 9.1, the Supplier\u2019s total aggregate liability arising under or in connection with this Agreement in any Contract Year shall not exceed 125% of the Charges paid or payable in that Contract Year.</div><div class="wf-actions"><button class="wf-btn sm" id="dl-insert">Insert into document</button><button class="wf-act sm" id="dl-alt">Show the 100% fallback</button></div></div>';
          $(w,'#dl-insert').addEventListener('click', function(){
            $(w,'#dl-target').innerHTML = '9.2 Subject to clause 9.1, the Supplier\u2019s total aggregate liability arising under or in connection with this Agreement in any Contract Year shall not exceed <span class="wf-ins">125% of the Charges paid or payable in that Contract Year</span>.';
            out.innerHTML = note('green','check','Inserted as a tracked change. It stays a proposal until you accept it in Word.');
          });
          $(w,'#dl-alt').addEventListener('click', function(){
            $(w,'#dl-alt').outerHTML = '<span class="wf-pill amber">fallback: 100% of the Charges, agreed in 3 matters where the customer held out</span>';
          });
        }, wait(1100));
      });
    }
    function wireTemplate(){
      $(w,'#tp-go').addEventListener('click', function(){
        var v = $$(w,'#dl-body .wf-input').map(function(i){ return i.value; });
        $(w,'#tp-co').textContent = v[0]; $(w,'#tp-inv').textContent = v[1]; $(w,'#tp-shares').textContent = v[2]; $(w,'#tp-amt').textContent = v[3];
        $$(w,'.wf-doc b').forEach(function(b){ b.className='wf-ins'; });
        $(w,'#tp-out').innerHTML = note('green','check','4 fields populated across 23 places in the document. Defined terms kept consistent.');
      });
    }
    function wireFull(){
      $(w,'#fd-go').addEventListener('click', function(){
        this.disabled = true; var out=$(w,'#fd-out'); out.innerHTML = '<div class="wf-prog"><i></i></div>'+spinner('Structuring to your SPA template, buyer-side');
        setTimeout(function(){ $(w,'.wf-prog i').style.width='100%'; }, 50);
        var heads = ['1. Definitions and interpretation','2. Sale and purchase','3. Consideration (locked box)','4. Completion','5. Warranties','6. Limitations on claims','7. Restrictive covenants','8. Tax covenant'];
        var body = $(w,'#fd-body'); body.className=''; body.innerHTML='';
        heads.forEach(function(h,i){ setTimeout(function(){ body.appendChild(el('p','wf-fade', '<b>'+esc(h)+'</b>' + (i===5 ? ' <span class="wf-ins">Claims to be notified within 18 months; cap at 50% of the Consideration.</span>' : ''))); }, wait(300+i*160)); });
        setTimeout(function(){ out.innerHTML = note('green','check','First draft ready for review. 8 sections, drafted from your buyer-side precedents.'); }, wait(1800));
      });
    }
    $$(w,'.wf-tabs .wf-act').forEach(function(b){ b.addEventListener('click', function(){ show(b.dataset.k); }); });
    show('clause');
  };

  reg['draft-question'] = function(w){
    var out = $(w,'#dq-out'), send = $(w,'#dq-send'), input = $(w,'#dq-input');
    send.addEventListener('click', function(){
      var q = input.value.trim(); if(!q) return;
      send.disabled = true; input.disabled = true;
      out.innerHTML = '<div class="wf-card wash wf-fade"><div class="wf-head"><span class="wf-pill">question on 8.2</span><span class="wf-meta">you, just now</span></div><div style="margin-top:6px">'+esc(q)+'</div>'+note('amber','clock','Sent to the client through the portal')+'</div>';
      setTimeout(function(){
        out.innerHTML += '<div class="wf-card wf-fade"><div class="wf-head"><span class="wf-pill green">client reply</span><span class="wf-meta">R. Doherty, Mourne Dairy</span></div><div style="margin-top:6px">150%, matching the MSA we signed last year.</div>'+spinner('Preparing a suggested amendment from the reply')+'</div>';
      }, wait(1400));
      setTimeout(function(){
        $(w,'.wf-spin').parentNode.remove();
        out.innerHTML += '<div class="wf-card wf-fade" id="dq-amend"><div class="wf-head"><span class="wf-pill navy">suggested amendment</span><span class="wf-meta">awaiting your approval</span></div><div class="wf-tc"><div class="wf-lab">TRACKED CHANGES</div>...shall not exceed <span class="wf-del">[100% / 150%]</span> <span class="wf-ins">150%</span> of the Charges paid or payable in the preceding 12 months.</div><div class="wf-actions"><button class="wf-btn green sm" id="dq-ok">'+ICO.check+'Approve</button><button class="wf-act sm red" id="dq-no">Reject</button></div></div>';
        $(w,'#dq-ok').addEventListener('click', function(){
          $(w,'#dq-cap').innerHTML = '<span class="wf-ins">150%</span>';
          $(w,'#dq-amend').className='wf-card done';
          $(w,'#dq-amend .wf-actions').outerHTML = note('green','check','Approved and inserted. The question, the reply and your decision are logged against clause 8.2.');
        });
        $(w,'#dq-no').addEventListener('click', function(){
          $(w,'#dq-amend').className='wf-card rej';
          $(w,'#dq-amend .wf-actions').outerHTML = note('','x','Rejected. The document is unchanged; the client reply stays on the record.');
        });
      }, wait(2900));
    });
  };

  reg['draft-review'] = function(w){
    var items = $$(w,'.wf-card[data-item]'), done = 0, log = [];
    function tally(){
      $(w,'#dr-status').textContent = done + ' of ' + items.length + ' amendments reviewed';
      if(done === items.length){
        $(w,'#dr-status').innerHTML = '<span style="color:var(--wf-green);font-weight:600">All reviewed. Ready to release.</span>';
        var t = el('div','wf-card wash wf-fade','<div class="wf-lab">AUDIT TRAIL</div>' + log.map(function(l){ return '<div style="font-size:12px;margin-top:3px">'+l+'</div>'; }).join(''));
        $(w,'#dr-list').appendChild(t);
      }
    }
    items.forEach(function(card){
      var name = card.dataset.item, acts = $(card,'.wf-actions'), inl = $(card,'.wf-inline');
      function finish(cls, ico, text, logline){
        card.className = 'wf-card ' + cls; acts.remove(); if(inl) inl.remove();
        card.appendChild(el('div','', note(cls==='done'?'green':'', ico, text)));
        log.push(logline); done++; tally();
      }
      $(acts,'[data-a=approve]').addEventListener('click', function(){ finish('done','check','Approved', esc(name)+': approved by S. Doherty (partner)'); });
      $(acts,'[data-a=reject]').addEventListener('click', function(){ inl.classList.add('show'); inl.dataset.mode='reject'; $(inl,'input').placeholder='Why? e.g. keep the 12 month period'; $(inl,'input').focus(); });
      $(acts,'[data-a=counter]').addEventListener('click', function(){ inl.classList.add('show'); inl.dataset.mode='counter'; $(inl,'input').placeholder='Your wording, e.g. 18 months'; $(inl,'input').focus(); });
      $(inl,'button').addEventListener('click', function(){
        var v = $(inl,'input').value.trim() || '(no note)';
        if(inl.dataset.mode==='reject') finish('rej','x','Rejected with note: '+v, esc(name)+': rejected, note "'+esc(v)+'"');
        else finish('hold','msg','Countered: '+v+'. Sent back to A. Murray.', esc(name)+': countered, "'+esc(v)+'"');
      });
    });
    tally();
  };

  reg['draft-loop'] = function(w){
    var out = $(w,'#kl-out'), n = 7;
    function counter(){ $(w,'#kl-n').textContent = n; }
    counter();
    $(w,'#kl-accept').addEventListener('click', function(){ commit('12 months', false); });
    $(w,'#kl-edit').addEventListener('click', function(){
      $(w,'#kl-choices').classList.add('show');
    });
    $$(w,'#kl-choices .wf-act').forEach(function(b){ b.addEventListener('click', function(){ commit(b.dataset.v, true); }); });
    function commit(v, edited){
      $(w,'#kl-sugg').className = 'wf-card done';
      $(w,'#kl-sugg .wf-actions').remove(); $(w,'#kl-choices').remove();
      $(w,'#kl-val').innerHTML = edited ? '<span class="wf-del">12 months</span> <span class="wf-ins">'+esc(v)+'</span>' : '12 months';
      $(w,'#kl-sugg').appendChild(el('div','', note('green','check', edited ? 'Approved with your edit.' : 'Approved as drafted.')));
      n++; counter();
      $(w,'#kl-pulse').classList.add('wf-fade');
      out.innerHTML = '<div class="wf-card wash wf-fade"><div class="wf-lab">CAPTURED TO THE FIRM\u2019S KNOWLEDGE LAYER</div><div style="font-size:12.5px;margin-top:4px">Restrictive covenant, non-compete period, seller-side, SPA</div><div style="font-size:12.5px;margin-top:2px">Firm position now <b>'+esc(v)+'</b>' + (edited ? ' (was leaning 12 months from 7 earlier matters)' : ' (confirmed across 8 matters)') + '</div></div>'
        + '<div class="wf-card wf-fade" style="margin-top:8px"><div class="wf-head"><span class="wf-pill navy">next matter</span><span class="wf-meta">SPA, acting for the seller</span></div><div class="wf-tc">The Seller shall not for a period of <span class="wf-ins">'+esc(v)+'</span> from Completion carry on any business which competes with the Business.</div>'+note('','spark','Suggestion already reflects the decision you just made.')+'</div>';
    }
  };

  /* ---------------- COLLABORATE ---------------- */

  reg['collab-workspace'] = function(w){
    var docs = [
      {n:'Internal notes and risk memo', vis:['firm'], tag:'internal only'},
      {n:'SPA v3 (working draft)', vis:['firm'], tag:'in progress'},
      {n:'SPA v2 (shared with client)', vis:['firm','client'], tag:'client review'},
      {n:'SPA v1 (released to opposing counsel)', vis:['firm','client','oc'], tag:'released'},
      {n:'Disclosure letter (working)', vis:['firm'], tag:'in progress'}
    ];
    var label = {firm:'Braden LLP', client:'Mourne Dairy (client)', oc:'Orchard Law (opposing counsel)'};
    function render(who){
      $$(w,'#cw-view .wf-act').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.v===who); });
      var vis = docs.filter(function(d){ return d.vis.indexOf(who)>-1; });
      $(w,'#cw-docs').innerHTML = docs.map(function(d){
        var can = d.vis.indexOf(who)>-1;
        return '<div class="wf-row'+(can?'':' dim')+'"><span class="grow">'+esc(d.n)+'</span><span class="wf-pill '+(can?(d.tag==='released'?'green':'navy'):'')+'">'+(can?esc(d.tag):'hidden')+'</span></div>';
      }).join('');
      $(w,'#cw-status').textContent = label[who] + ' sees ' + vis.length + ' of ' + docs.length + ' documents on this matter.';
    }
    $$(w,'#cw-view .wf-act').forEach(function(b){ b.addEventListener('click', function(){ render(b.dataset.v); }); });
    $$(w,'select').forEach(function(s){ s.addEventListener('change', function(){
      $(w,'#cw-role-note').innerHTML = note('green','check', s.dataset.who+' is now a '+s.value+' on this matter. Applies to this matter only.');
    }); });
    render('firm');
  };

  reg['collab-approval'] = function(w){
    var steps = $$(w,'.wf-step'), i = 0, btn = $(w,'#ap-next'), rel = $(w,'#ap-release'), log = $(w,'#ap-log');
    var labels = ['Approve as associate and pass up','Approve as partner'];
    var people = ['A. Murray (associate)','S. Doherty (partner)'];
    function set(k, cls, txt){ steps[k].className = 'wf-step' + (cls?' '+cls:''); $(steps[k],'.st').textContent = txt; }
    function paint(){
      set(0,'ok','drafted');
      set(1, i>=1?'ok':'now', i>=1?'approved':'reviewing');
      set(2, i>=2?'ok':(i===1?'now':''), i>=2?'approved':(i===1?'reviewing':'waiting'));
      set(3, i>=2?'now':'lock', i>=2?'unlocked':'locked until approved');
      btn.textContent = labels[Math.min(i,1)];
      btn.style.display = i>=2 ? 'none' : '';
      rel.disabled = i<2;
    }
    btn.addEventListener('click', function(){
      log.appendChild(el('div','wf-fade','<span class="wf-pill green">'+ICO.check+'</span> 12 amendments approved by '+people[i]+', '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})));
      i++; paint();
    });
    rel.addEventListener('click', function(){
      rel.disabled = true; rel.textContent = 'Released';
      set(3,'ok','released');
      log.appendChild(el('div','wf-fade','<span class="wf-pill green">'+ICO.check+'</span> SPA v2 released to Orchard Law by S. Doherty. Internal notes withheld.'));
    });
    paint();
  };

  reg['collab-client'] = function(w){
    var send = $(w,'#cc-send'), input = $(w,'#cc-input'), out = $(w,'#cc-out');
    send.addEventListener('click', function(){
      var v = input.value.trim(); if(!v) return; send.disabled = true; input.disabled = true;
      out.innerHTML = '<div class="wf-card wash wf-fade"><div class="wf-head"><span class="wf-pill">client comment on 4.1</span><span class="wf-meta">R. Doherty</span></div><div style="margin-top:6px">'+esc(v)+'</div>'+spinner('Turning the comment into a proposed amendment')+'</div>';
      setTimeout(function(){
        out.innerHTML = out.innerHTML.replace(/<div class="wf-note">[\s\S]*?<\/div>/, '');
        out.innerHTML += '<div class="wf-card wf-fade" id="cc-am"><div class="wf-head"><span class="wf-pill navy">proposed amendment</span><span class="wf-meta">for your approval</span></div><div class="wf-tc"><div class="wf-lab">TRACKED CHANGES</div>4.1 The Customer shall pay each invoice within <span class="wf-del">30</span> <span class="wf-ins">60</span> days of the date of the invoice.</div><div class="wf-actions"><button class="wf-btn green sm" id="cc-ok">'+ICO.check+'Approve</button><button class="wf-act sm red" id="cc-no">Reject</button></div></div>';
        $(w,'#cc-ok').addEventListener('click', function(){ $(w,'#cc-am').className='wf-card done'; $(w,'#cc-am .wf-actions').outerHTML = note('green','check','Approved. Client sees the change against clause 4.1, with your note.'); });
        $(w,'#cc-no').addEventListener('click', function(){ $(w,'#cc-am').className='wf-card rej'; $(w,'#cc-am .wf-actions').outerHTML = note('','x','Rejected. The client comment is kept on the record with your reason.'); });
      }, wait(1500));
    });
    $(w,'#cc-export').addEventListener('click', function(){
      this.outerHTML = '<div class="wf-card wash wf-fade"><div class="wf-lab">EMAIL EXPORT (PREVIEW)</div><table><tr><th>Clause</th><th>Change</th><th>Status</th></tr><tr><td>4.1</td><td>30 to 60 day payment terms</td><td>Awaiting approval</td></tr><tr><td>7.3</td><td>Cap raised to 125% of Charges</td><td>Approved</td></tr><tr><td>11</td><td>Assignment consent not to be unreasonably withheld</td><td>Approved</td></tr></table>'+note('','check','Pasted into an email for clients who prefer it that way.')+'</div>';
    });
  };

  reg['collab-isolation'] = function(w){
    var firm = 'a', out = $(w,'#iso-out');
    var data = {a:{name:'Braden LLP', matters:['Project Ash (SPA)','Causeway Series A','Belfast HQ lease']}, b:{name:'Orchard Law', matters:['Project Ash (buyer side)','Strand Retail acquisition']}};
    $$(w,'#iso-firm .wf-act').forEach(function(b){ b.addEventListener('click', function(){ firm = b.dataset.f; $$(w,'#iso-firm .wf-act').forEach(function(x){ x.setAttribute('aria-pressed', x===b); }); out.innerHTML=''; }); });
    $(w,'#iso-list').addEventListener('click', function(){
      var d = data[firm];
      out.innerHTML = '<div class="wf-card wash wf-fade"><div class="wf-lab">RESULT FOR '+esc(d.name.toUpperCase())+'</div>' + d.matters.map(function(m){ return '<div class="wf-row" style="margin-top:6px"><span class="grow">'+esc(m)+'</span><span class="wf-pill green">'+ICO.lock+'yours</span></div>'; }).join('') + note('','lock', d.matters.length+' rows. Only rows tagged to '+d.name+' exist from this session\u2019s point of view.')+'</div>';
    });
    $(w,'#iso-cross').addEventListener('click', function(){
      var other = firm==='a' ? data.b : data.a;
      out.innerHTML = '<div class="wf-card wf-fade" style="border-color:var(--wf-amber)"><div class="wf-lab">OPEN "'+esc(other.matters[0].toUpperCase())+'" AS '+esc(data[firm].name.toUpperCase())+'</div><div class="wf-row" style="margin-top:6px"><span class="grow">0 rows returned</span><span class="wf-pill amber">'+ICO.lock+'row-level security</span></div>'+note('amber','lock','Both firms are on Project Ash, one on each side. Neither can see the other\u2019s workspace, notes or drafts. The database returns nothing, not "access denied".')+'</div>';
    });
  };

  /* ---------------- NEGOTIATE ---------------- */

  reg['neg-redline'] = function(w){
    var amends = [
      {c:'6.2',k:'substantive',t:'Warranty claim period reduced from <span class="wf-del">18 months</span> to <span class="wf-ins">12 months</span>'},
      {c:'6.4',k:'substantive',t:'Cap on claims reduced to <span class="wf-ins">30% of the Consideration</span>'},
      {c:'9.1',k:'substantive',t:'Non-compete period cut to <span class="wf-del">24</span> <span class="wf-ins">12</span> months'},
      {c:'1.1',k:'drafting',t:'"Business Day" definition now references Belfast rather than London'},
      {c:'5.3',k:'drafting',t:'Knowledge qualifier added: "so far as the Sellers are aware"'},
      {c:'12.2',k:'drafting',t:'Notice clause: email notices now permitted'},
      {c:'Sch 4',k:'typographical',t:'Cross-reference corrected from 6.3 to 6.4'},
      {c:'2.1',k:'typographical',t:'"Purchaser" changed to "Buyer" for consistency'}
    ];
    var counts = {substantive:3, drafting:9, typographical:5};
    var filter = 'all';
    function list(){
      $(w,'#rl-list').innerHTML = amends.filter(function(a){ return filter==='all'||a.k===filter; }).map(function(a){
        return '<div class="wf-row"><span class="wf-pill">'+esc(a.c)+'</span><span class="grow">'+a.t+'</span><span class="wf-pill '+(a.k==='substantive'?'amber':'')+'">'+a.k+'</span></div>';
      }).join('') + (filter==='all' ? '<div class="wf-status" style="margin-top:8px">Showing 8 of 17. Full list in the platform.</div>' : '');
    }
    $(w,'#rl-upload').addEventListener('click', function(){
      this.disabled = true;
      var out = $(w,'#rl-out');
      out.innerHTML = '<div class="wf-prog"><i></i></div>'+spinner('Comparing SPA_v4_OrchardLaw.docx against your v3');
      setTimeout(function(){ $(w,'.wf-prog i').style.width='100%'; }, 50);
      setTimeout(function(){
        out.innerHTML = '<div class="wf-fade"><div class="wf-head" style="margin-bottom:8px"><span class="name">17 amendments detected</span><span class="wf-meta">turn 4, received today</span></div><div class="wf-tabs" id="rl-f"><button class="wf-act sm" data-k="all" aria-pressed="true">All 17</button><button class="wf-act sm" data-k="substantive">Substantive 3</button><button class="wf-act sm" data-k="drafting">Drafting 9</button><button class="wf-act sm" data-k="typographical">Typographical 5</button></div><div id="rl-list"></div><div class="wf-card wash" style="margin-top:10px"><div class="wf-lab">SUMMARY FOR THE CLIENT (DRAFT)</div><div style="font-size:12.5px">Orchard Law has moved on three points that matter: they want the warranty period down to 12 months, the cap down to 30%, and a shorter non-compete. Everything else is tidy-up. We recommend holding on the cap and trading on the period.</div><div class="wf-actions"><button class="wf-btn sm" id="rl-send">Review and send to client</button></div></div></div>';
        list();
        $$(w,'#rl-f .wf-act').forEach(function(b){ b.addEventListener('click', function(){ filter=b.dataset.k; $$(w,'#rl-f .wf-act').forEach(function(x){ x.setAttribute('aria-pressed', x===b); }); list(); }); });
        $(w,'#rl-send').addEventListener('click', function(){ this.outerHTML = '<span class="wf-pill green">'+ICO.check+'Sent to R. Doherty after your review</span>'; });
      }, wait(1700));
    });
  };

  reg['neg-review'] = function(w){
    var items = [
      {c:'6.2 Time limits', before:'notified in writing within 18 months of Completion', after:'notified in writing within 12 months of Completion', counter:'15 months of Completion'},
      {c:'6.4 Cap on claims', before:'shall not exceed 50% of the Consideration', after:'shall not exceed 30% of the Consideration', counter:'40% of the Consideration'},
      {c:'9.1 Non-compete', before:'for a period of 24 months from Completion', after:'for a period of 12 months from Completion', counter:'18 months from Completion'}
    ];
    var i = 0, log = [];
    function render(){
      var host = $(w,'#nr-host');
      if(i >= items.length){
        host.innerHTML = '<div class="wf-card done wf-fade"><b>All three substantive amendments reviewed.</b><div style="font-size:12px;margin-top:4px">Counterproposals go to your partner for approval before anything is released.</div></div><div class="wf-card wash" style="margin-top:8px"><div class="wf-lab">NEGOTIATION HISTORY, TURN 4</div>'+log.map(function(l){ return '<div style="font-size:12px;margin-top:3px">'+l+'</div>'; }).join('')+'</div>';
        return;
      }
      var it = items[i];
      host.innerHTML = '<div class="wf-card wf-fade"><div class="wf-head"><span class="wf-pill">'+esc(it.c)+'</span><span class="wf-meta">amendment '+(i+1)+' of 3, from Orchard Law</span></div><div class="wf-tc"><div class="wf-lab">BEFORE (YOUR V3)</div>'+esc(it.before)+'</div><div class="wf-tc" style="margin-top:6px"><div class="wf-lab">AFTER (THEIR V4)</div><span class="wf-ins">'+esc(it.after)+'</span></div><div class="wf-actions"><button class="wf-act sm green" data-a="approve">'+ICO.check+'Approve</button><button class="wf-act sm red" data-a="reject">Reject</button><button class="wf-act sm" data-a="counter">Counter</button></div><div class="wf-inline" id="nr-inl"><input type="text" value="'+esc(it.counter)+'" aria-label="Counterproposal"><input type="text" placeholder="Reason, for the record" aria-label="Reason" style="flex:1.2"><button class="wf-btn sm">Send up for approval</button></div></div>';
      $(host,'[data-a=approve]').addEventListener('click', function(){ log.push(esc(it.c)+': accepted their wording'); i++; render(); });
      $(host,'[data-a=reject]').addEventListener('click', function(){ log.push(esc(it.c)+': rejected, holding at "'+esc(it.before)+'"'); i++; render(); });
      $(host,'[data-a=counter]').addEventListener('click', function(){ $(host,'#nr-inl').classList.add('show'); $$(host,'#nr-inl input')[1].focus(); });
      $(host,'#nr-inl button').addEventListener('click', function(){
        var v = $$(host,'#nr-inl input'); log.push(esc(it.c)+': countered with "'+esc(v[0].value)+'"'+(v[1].value?' ('+esc(v[1].value)+')':'')); i++; render();
      });
      $(w,'#nr-status').textContent = 'Decision '+(i+1)+' of 3';
    }
    render();
  };

  reg['neg-issues'] = function(w){
    var states = ['open, ours','open, theirs','agreed'];
    var cls = {'open, ours':'amber','open, theirs':'','agreed':'green'};
    $$(w,'[data-st]').forEach(function(p){
      p.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); p.click(); } });
      p.addEventListener('click', function(){
        var k = (states.indexOf(p.dataset.st)+1) % states.length; p.dataset.st = states[k]; p.className = 'wf-pill '+cls[states[k]]; p.textContent = states[k];
        count();
      });
    });
    function count(){
      var open = $$(w,'[data-st]').filter(function(p){ return p.dataset.st!=='agreed'; }).length;
      $(w,'#is-count').textContent = open+' open points, '+($$(w,'[data-st]').length-open)+' agreed';
    }
    count();
    $(w,'#is-gen').addEventListener('click', function(){
      this.disabled = true; var out = $(w,'#is-out');
      out.innerHTML = spinner('Drafting a client update from the issues list');
      setTimeout(function(){
        var rows = $$(w,'tbody tr').map(function(tr){ return {n:tr.cells[0].textContent, s:tr.cells[1].textContent, st:$(tr,'[data-st]').dataset.st}; });
        var txt = 'Dear Ruth,\n\nA short update following turn 4 from Orchard Law.\n\n' + rows.map(function(r){ return '\u2022 '+r.n+': '+(r.st==='agreed'?'agreed.':(r.st==='open, ours'?'open, we owe the next move. Our recommendation: '+r.s.toLowerCase()+'.':'open, with the other side.')); }).join('\n') + '\n\nHappy to talk any of these through before we respond.\n\nKind regards\nSarah';
        out.innerHTML = '<div class="wf-fade"><textarea rows="9" id="is-txt"></textarea>'+note('amber','clock','Draft. A lawyer edits and approves this before the client sees it.')+'<div class="wf-actions"><button class="wf-btn sm" id="is-send">Approve and send</button></div></div>';
        $(w,'#is-txt').value = txt;
        $(w,'#is-send').addEventListener('click', function(){ this.outerHTML = '<span class="wf-pill green">'+ICO.check+'Sent to the client, logged on the matter</span>'; });
      }, wait(1300));
    });
  };

  reg['neg-record'] = function(w){
    var matters = [
      {m:'Strand Retail', cp:'Orchard Law', y:'2024', open:100, ask:200, agreed:125, rounds:3, doc:'Services agreement'},
      {m:'Larne Robotics', cp:'Hillcrest & Co', y:'2024', open:100, ask:150, agreed:150, rounds:2, doc:'Framework agreement'},
      {m:'Mourne Dairy', cp:'Orchard Law', y:'2025', open:100, ask:200, agreed:125, rounds:4, doc:'Supply agreement'},
      {m:'Causeway Tech', cp:'Dunmore LLP', y:'2025', open:100, ask:150, agreed:100, rounds:5, doc:'SaaS agreement'},
      {m:'Belfast Fibre', cp:'Hillcrest & Co', y:'2026', open:125, ask:175, agreed:150, rounds:2, doc:'Services agreement'},
      {m:'Glenarm Foods', cp:'Orchard Law', y:'2026', open:125, ask:200, agreed:125, rounds:3, doc:'Supply agreement', live:true}
    ];
    var cp = 'all';
    function render(){
      var rows = matters.filter(function(x){ return cp==='all'||x.cp===cp; });
      $(w,'#rec-bars').innerHTML = rows.map(function(x,k){
        return '<div class="wf-bar-col" data-k="'+k+'" role="button" tabindex="0"><span class="l" style="color:var(--wf-ink)">'+x.agreed+'%</span><div class="b'+(x.live?' open':'')+'" style="height:'+(x.agreed/200*80)+'%"></div><span class="l">'+esc(x.m.split(' ')[0])+'</span></div>';
      }).join('');
      var agreed = rows.filter(function(x){ return !x.live; }).map(function(x){ return x.agreed; });
      var lo = Math.min.apply(null,agreed), hi = Math.max.apply(null,agreed);
      $(w,'#rec-sum').innerHTML = 'Liability cap as a percentage of annual charges, acting for the supplier. '+(cp==='all'?'Across all counterparties':'Against '+esc(cp))+', your firm has '+(lo===hi?'landed at <b>'+lo+'%</b> every time.':'landed between <b>'+lo+'%</b> and <b>'+hi+'%</b>.') + (cp==='Orchard Law' ? ' Orchard Law has opened at 200% every time and settled at 125% every time.' : '');
      $$(w,'.wf-bar-col').forEach(function(col){
        function pick(){
          $$(w,'.wf-bar-col').forEach(function(c){ c.classList.remove('on'); }); col.classList.add('on');
          var x = rows[+col.dataset.k];
          $(w,'#rec-detail').innerHTML = '<div class="wf-card wash wf-fade"><div class="wf-head"><span class="name">'+esc(x.m)+'</span><span class="wf-pill">'+esc(x.doc)+'</span><span class="wf-meta">'+esc(x.cp)+', '+x.y+'</span></div><table style="margin-top:6px"><tr><td>Our opening position</td><td><b>'+x.open+'%</b></td></tr><tr><td>Their opening ask</td><td><b>'+x.ask+'%</b></td></tr><tr><td>'+(x.live?'Current position (live matter)':'Agreed')+'</td><td><b>'+x.agreed+'%</b> after '+x.rounds+' rounds</td></tr></table>'+(x.live?note('amber','clock','Still open. Based on the record, expect to settle here.'):'')+'</div>';
        }
        col.addEventListener('click', pick);
        col.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pick(); } });
      });
      $(w,'#rec-detail').innerHTML = '<div class="wf-status">Select a matter to see how the position moved.</div>';
    }
    $(w,'#rec-cp').addEventListener('change', function(){ cp = this.value; render(); });
    render();
  };


  /* ---------------- CLAUSE LIBRARY ---------------- */

  reg['lib-capture'] = function(w){
    var found = [
      {ref:'5.2', t:'Warranty claims: time limits', conf:'high', txt:'...within 24 months of the date of this Agreement...'},
      {ref:'5.4', t:'Warranty claims: cap', conf:'high', txt:'...shall not exceed 100% of the Subscription Price...'},
      {ref:'8.1', t:'Investor costs', conf:'high', txt:'...up to a maximum aggregate amount of \u00a320,000...'},
      {ref:'Sch 5, 12', t:'Litigation warranty: knowledge qualifier', conf:'medium', txt:'So far as the Founders are aware, there is no litigation...'},
      {ref:'11.3', t:'Unmapped', conf:'low', txt:'The Company shall maintain key person insurance...'}
    ];
    $(w,'#lc-go').addEventListener('click', function(){
      this.disabled = true; var out = $(w,'#lc-out');
      out.innerHTML = '<div class="wf-prog"><i></i></div>'+spinner('Parsing 61 clauses and matching against the firm taxonomy');
      setTimeout(function(){ $(w,'.wf-prog i').style.width='100%'; }, 50);
      setTimeout(function(){
        out.innerHTML = '<div class="wf-fade"><div class="wf-head" style="margin-bottom:8px"><span class="name">61 clauses parsed, 58 mapped</span><span class="wf-meta">3 for you to confirm</span></div>' + found.map(function(f,i){
          var pill = f.conf==='high' ? '<span class="wf-pill green">mapped</span>' : (f.conf==='medium' ? '<span class="wf-pill amber">confirm</span>' : '<span class="wf-pill red">unmapped</span>');
          var ctl = f.conf==='high' ? '' : '<div class="wf-actions" style="margin-top:6px"><select data-i="'+i+'" aria-label="Clause type"><option'+(f.conf==='medium'?' selected':'')+'>'+esc(f.t)+'</option><option>Key person insurance</option><option>Information rights</option><option>Ignore this clause</option></select><button class="wf-act sm green" data-i="'+i+'">Confirm</button></div>';
          return '<div class="wf-card" data-i="'+i+'"><div class="wf-head"><span class="wf-pill">'+esc(f.ref)+'</span><span class="name">'+esc(f.t)+'</span>'+pill+'</div><div style="font-size:12px;color:var(--wf-ink2);margin-top:4px">'+esc(f.txt)+'</div>'+ctl+'</div>';
        }).join('') + '<div class="wf-status">Showing 5 of 61. Confirmations are captured as taxonomy training for the next document.</div></div>';
        $$(w,'.wf-act[data-i]').forEach(function(b){ b.addEventListener('click', function(){
          var card = b.closest('.wf-card'), v = $(card,'select').value;
          $(card,'.wf-actions').remove(); $(card,'.wf-pill:last-of-type').outerHTML = '<span class="wf-pill green">mapped</span>';
          $(card,'.name').textContent = v; card.className = 'wf-card done';
        }); });
      }, wait(1600));
    });
  };

  reg['lib-search'] = function(w){
    var hits = {
      drag:[{t:'Drag-along, 66% of Shares in issue with a price floor', m:'Causeway Series A, agreed with Orchard Law', s:'firm-preferred, 3 matters'},{t:'Drag-along, 66% no floor', m:'Strand Retail growth round', s:'fallback'}],
      cap:[{t:'Cap at 100% of the Subscription Price, fundamentals uncapped', m:'Causeway Series A', s:'agreed with Orchard Law twice'},{t:'Cap at 75% of the Subscription Price', m:'Glenarm Seed Round', s:'best result, Hillcrest & Co'}],
      costs:[{t:'Investor costs capped at \u00a320,000, payable on Completion', m:'Causeway Series A', s:'firm landing point'},{t:'Investor costs capped at \u00a310,000', m:'Glenarm Seed Round', s:'best result'}]
    };
    function run(){
      var q = $(w,'#ls-q').value.toLowerCase(), key = q.indexOf('drag')>-1?'drag':(q.indexOf('cap')>-1?'cap':(q.indexOf('cost')>-1||q.indexOf('fee')>-1?'costs':null));
      var out = $(w,'#ls-out');
      if(!key){ out.innerHTML = '<div class="wf-status">Try "drag along", "cap" or "investor costs" in this preview.</div>'; return; }
      out.innerHTML = hits[key].map(function(h,i){ return '<div class="wf-card wf-fade"><div class="wf-head"><span class="name" style="font-size:12.5px">'+esc(h.t)+'</span><span class="wf-pill '+(i===0?'navy':'')+'">'+esc(h.s)+'</span></div><div style="font-size:11.5px;color:var(--wf-ink3);margin-top:3px">'+esc(h.m)+'</div><div class="wf-actions" style="margin-top:6px"><button class="wf-btn sm ls-ins">Insert as tracked change</button><button class="wf-act sm">Open history</button></div></div>'; }).join('');
      $$(w,'.ls-ins').forEach(function(b){ b.addEventListener('click', function(){ b.closest('.wf-card').className='wf-card done'; b.closest('.wf-actions').outerHTML = note('green','check','Inserted at the cursor with its provenance in a comment.'); $(w,'#ls-doc').innerHTML = '<span class="wf-ins">'+esc(hits[key][0].t)+' wording inserted here, with source matter noted.</span>'; }); });
    }
    $(w,'#ls-go').addEventListener('click', run);
    $(w,'#ls-q').addEventListener('keydown', function(e){ if(e.key==='Enter') run(); });
  };

  /* ---------------- boot ---------------- */
  function boot(w){
    var name = w.dataset.wf, fn = reg[name]; if(!fn) return;
    if(!w.dataset.snap) w.dataset.snap = w.innerHTML;
    var r = $(w,'.wf-reset'); if(r){ r.innerHTML = ICO.replay+'Replay'; r.addEventListener('click', function(){ w.innerHTML = w.dataset.snap; boot(w); }); }
    try { fn(w); } catch(e){ if(window.console) console.warn('wireframe', name, e); }
  }
  document.querySelectorAll('.wf[data-wf]').forEach(boot);
})();
