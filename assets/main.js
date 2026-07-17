/* Scriptum AI shared behaviour */

/* Product dropdown: click support (hover handled in CSS) */
document.querySelectorAll('.nav-drop-btn').forEach(function(btn){
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    btn.closest('.nav-drop').classList.toggle('open');
  });
});
document.addEventListener('click', function(){
  document.querySelectorAll('.nav-drop.open').forEach(function(d){ d.classList.remove('open'); });
});

/* Scroll reveal */
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

/* Hero: clause-to-knowledge loop */
(function(){
  var card = document.getElementById('clauseCard');
  if(!card) return;
  var status = document.getElementById('ccStatus');
  var kCard = document.getElementById('knowledgeCard');
  var kNum = document.getElementById('kcCount');
  var count = 1284;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  kNum.textContent = count.toLocaleString();
  if(reduced){ card.classList.add('play','approved'); status.textContent = 'Approved'; return; }

  function loop(){
    card.classList.remove('play','approved');
    status.textContent = 'Amendment received';
    setTimeout(function(){
      card.classList.add('play');
      status.textContent = 'Reviewing';
    }, 900);
    setTimeout(function(){
      card.classList.add('approved');
      status.textContent = 'Approved';
    }, 2600);
    setTimeout(function(){
      kCard.classList.add('tick');
      count += 1;
      kNum.textContent = count.toLocaleString();
      setTimeout(function(){ kCard.classList.remove('tick'); }, 1300);
    }, 3100);
    setTimeout(loop, 6200);
  }
  loop();
})();

/* Demo form */
function submitDemo(){
  var f = document.getElementById('demo-fname').value;
  var e = document.getElementById('demo-email').value;
  if(!f || !e){ alert('Please fill in at least your name and email.'); return; }
  document.getElementById('demo-success').classList.add('visible');
  document.querySelector('.demo-form .btn-primary').style.display = 'none';
}

/* Contact form */
function submitContact(){
  var n = document.getElementById('c-name').value;
  var e = document.getElementById('c-email').value;
  if(!n || !e){ alert('Please fill in your name and email.'); return; }
  document.getElementById('contact-success').classList.add('visible');
  document.querySelector('.contact-form-card .btn-primary').style.display = 'none';
}
/* ==========================================================
   APPEND THIS TO THE END OF assets/main.js
   Builds a mobile menu from the existing nav links so that
   Product, Resources and every other link stay reachable on
   small screens.
   ========================================================== */
(function(){
  try{
    var nav = document.querySelector('nav');
    if(!nav) return;
    var links = nav.querySelectorAll('.nav-links a');
    if(!links.length) return;

    var burger = document.createElement('button');
    burger.className = 'nav-hamburger';
    burger.setAttribute('aria-label','Open menu');
    burger.innerHTML = '<span></span>';

    var panel = document.createElement('div');
    panel.className = 'mobile-menu';
    links.forEach(function(a){
      var c = a.cloneNode(true);
      c.classList.remove('btn-primary');
      panel.appendChild(c);
    });

    nav.appendChild(burger);
    nav.parentNode.insertBefore(panel, nav.nextSibling);

    burger.addEventListener('click', function(){ panel.classList.toggle('open'); });
    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ panel.classList.remove('open'); });
    });
  }catch(e){ /* desktop nav unaffected */ }
})();
