const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const toast=$('#toast');
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2500)}
function openModal(title,body,action='Got it'){ $('#modalTitle').textContent=title;$('#modalBody').textContent=body;$('#modalAction').innerHTML=action+' <span>↗</span>';$('#modalBackdrop').classList.add('open'); }
function closeModal(){$('#modalBackdrop').classList.remove('open')}
$('#modalClose').addEventListener('click',closeModal);
$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
$('#notifyBtn').addEventListener('click',()=>openModal('You’re all caught up ✦','No new trip alerts right now. Your next planned journey is Paris, France, from 26–28 July.','Lovely'));
$('#settingsBtn').addEventListener('click',()=>openModal('Your travel preferences','This demo profile is set to thoughtful, slow-paced trips with a balance of culture, local food, and time to wander.','Sounds good'));
$('#profileEdit').addEventListener('click',()=>openModal('Your travel story','Personalise this card with your own profile photo, favourite travel style, and milestones when you connect a profile service.','Got it'));
$('#tripOptions').addEventListener('click',()=>openModal('Paris trip options','Your next trip includes 3 saved stops, a two-night stay in Le Marais, and an estimated trip budget of €864.','Close details'));
$('#openTrip').addEventListener('click',()=>openModal('Paris, France 🇫🇷','26–28 July · 3 days · 2 travellers. Your starter plan: explore Montmartre, spend an afternoon at the Louvre, and leave time for a neighbourhood café and shopping.','Let’s go'));
$('#viewCalendar').addEventListener('click',()=>openModal('Journey calendar','Your 2026 calendar has Vienna in May, Paris in July, and a longer Bali escape planned from September. Select any trip card to view its details.','Close'));
$('#seeAllTrips').addEventListener('click',()=>openModal('Past & saved journeys','Your collection includes Japan, the Swiss Alps, the Amalfi Coast, and five more saved ideas. In a full product, this area would open a searchable trip library.','Explore'));
$('#yearToggle').addEventListener('click',()=>showToast('Showing your 2026 travel calendar ✦'));
$('#countryToggle').addEventListener('click',()=>openModal('Travel footprint','Your map currently highlights planned and visited places across Europe and Asia. This visual is a concept illustration rather than a live map service.','Got it'));

$$('.trip-pill').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.trip,btn.dataset.detail+' · Select “Plan a new trip” to customise your own itinerary.','Sounds good')));
$$('.memory-card').forEach(card=>card.addEventListener('click',()=>{
 $$('.memory-card').forEach(c=>c.classList.remove('active'));card.classList.add('active');
 const name=card.dataset.memory;showToast(`${name} memory selected ✦`);
 if(name==='Japan'){$('#memoryStack').style.setProperty('--memory-accent','#f3b5e4')}
}));
$('#shuffleMemory').addEventListener('click',()=>{
 const stack=$('#memoryStack');stack.classList.remove('shuffling');void stack.offsetWidth;stack.classList.add('shuffling');
 const cards=$$('.memory-card');cards.forEach((c,i)=>{c.style.transitionDelay=(i*.08)+'s';});
 setTimeout(()=>{cards.forEach(c=>c.style.transitionDelay='');stack.classList.remove('shuffling')},700);
 showToast('Your memory cards have been reshuffled ✦');
});
let zoom=1;const map=$('.map-art');
$('#zoomIn').addEventListener('click',()=>{zoom=Math.min(1.35,zoom+.1);map.style.transform=`scale(${zoom})`;showToast('Map zoomed in')});
$('#zoomOut').addEventListener('click',()=>{zoom=Math.max(.8,zoom-.1);map.style.transform=`scale(${zoom})`;showToast('Map zoomed out')});
$('#quickPlanForm').addEventListener('submit',e=>{
 e.preventDefault();const place=$('#destination').value.trim();if(!place)return;
 $('#formHint').textContent=`Your ${place} trip idea is ready to shape.`;
 openModal(`Let’s plan ${place} ✦`,`Your destination is set to ${place}. Next, choose your dates, budget, and travel style to build a more detailed itinerary.`,'Perfect');
});
$$('.quick-chips button').forEach(btn=>btn.addEventListener('click',()=>{$('#destination').value=btn.dataset.place;$('#formHint').textContent=`Nice choice — ${btn.dataset.place} is selected.`;showToast(`${btn.dataset.place} added to your trip idea ✦`)}));
$('#mobileMenu').addEventListener('click',()=>$('#navLinks').classList.toggle('open'));
$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{$$('.nav-links a').forEach(x=>x.classList.remove('active'));a.classList.add('active');$('#navLinks').classList.remove('open')}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(entry.isIntersecting){const el=entry.target;const siblings=[...el.parentElement.querySelectorAll(':scope > .reveal')];el.style.transitionDelay=(Math.max(0,siblings.indexOf(el))*.1)+'s';el.classList.add('visible');observer.unobserve(el)}
}),{threshold:.12,rootMargin:'0px 0px -25px 0px'});
$$('.reveal').forEach(el=>observer.observe(el));
const sections=$$('main section[id], article[id]');
const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const id=entry.target.id;const link=$(`.nav-links a[href="#${id}"]`);if(link){$$('.nav-links a').forEach(a=>a.classList.remove('active'));link.classList.add('active')}}}),{rootMargin:'-30% 0px -60% 0px'});
sections.forEach(s=>navObserver.observe(s));
const counters=$$('.map-stat strong, #miles');
const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const el=entry.target;const final=el.textContent;const numeric=Number(final.replace(/,/g,''));if(Number.isFinite(numeric)){let start=0;const duration=900;const startTime=performance.now();function tick(now){const p=Math.min(1,(now-startTime)/duration);const eased=1-Math.pow(1-p,3);el.textContent=Math.round(numeric*eased).toLocaleString('en-IN',{minimumIntegerDigits:final.length<=2?2:1});if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}countObserver.unobserve(el)}}),{threshold:.5});
counters.forEach(el=>countObserver.observe(el));


// Scroll-progress choreography: separate sections move at different rates as the page scrolls.
const parallaxLayers=[['.story-backdrop',.16],['.quote-image-layer',.22],['.closing-story-bg',.14]];
let scrollTick=false;
function updateScrollMotion(){
 const vh=window.innerHeight||800;
 parallaxLayers.forEach(([selector,speed])=>{$$(selector).forEach(el=>{const rect=el.parentElement.getBoundingClientRect();const progress=(vh-rect.top)/(vh+rect.height);const offset=(progress-.5)*rect.height*speed;el.style.transform=`translate3d(0,${offset.toFixed(1)}px,0) scale(1.08)`})});
 document.body.classList.toggle('is-scrolling',window.scrollY>20);
 scrollTick=false;
}
window.addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(updateScrollMotion);scrollTick=true}},{passive:true});
window.addEventListener('resize',updateScrollMotion);
updateScrollMotion();

// Interactive packing checklist with a live progress meter.
const packingChecks=$$('#packingChecklist input[type="checkbox"]');
function updatePacking(){
 const done=packingChecks.filter(x=>x.checked).length;
 $('#packingCount').textContent=`${done} / ${packingChecks.length} ready`;
 $('#packingProgressFill').style.width=(done/packingChecks.length*100)+'%';
 if(done===packingChecks.length)showToast('You’re ready for the beautiful unknown ✦');
}
packingChecks.forEach(input=>input.addEventListener('change',updatePacking));

// Destination feature cards seed the quick planner below.
$$('.feature-destination').forEach(btn=>btn.addEventListener('click',()=>{
 $('#destination').value=btn.dataset.featurePlace;
 $('#formHint').textContent=`${btn.dataset.featurePlace} selected — let's make it a real plan.`;
 $('#planner').scrollIntoView({behavior:'smooth',block:'center'});
 showToast(`${btn.dataset.featurePlace} added to your trip idea ✦`);
}));
