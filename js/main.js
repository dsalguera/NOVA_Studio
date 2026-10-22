'use strict';
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
menuButton.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
const newsletterForm = document.querySelector('#newsletter-form');
newsletterForm.addEventListener('submit', event => {
  event.preventDefault();
  newsletterForm.querySelector('.form-feedback').textContent = 'Thanks! This is a visual demo; no message has been sent.';
  newsletterForm.reset();
});
document.querySelector('#footer-form').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('.footer-feedback').textContent = 'Demo only — no subscription was created.';
  event.currentTarget.reset();
});
document.querySelector('.play-button').addEventListener('click', () => {
  window.alert('NOVA Academy is a portfolio concept. A promotional video can be connected here later.');
});
const testimonials = [...document.querySelectorAll('.testimonial-grid article')];
let currentTestimonial = 0;
function highlightTestimonial(index) {
  currentTestimonial = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((item, i) => { item.style.opacity = i === currentTestimonial ? '1' : '.65'; });
}
document.querySelectorAll('.testimonial-arrows button').forEach((button, index) => {
  button.addEventListener('click', () => highlightTestimonial(currentTestimonial + (index === 0 ? -1 : 1)));
});

// Scroll entrance animations. Native IntersectionObserver, no libraries.
const motionTargets = document.querySelectorAll(
  '.hero-left, .hero-art, .hero-right, .stats-grid > div, .challenge h2, .section-heading, .course-card, .about-copy, .about-figure, .why-copy, .why-figure, .video-panel, .testimonials > h2, .testimonial-grid article, .newsletter-art, .newsletter-copy, .footer-grid > div'
);
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  motionTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${(i % 4) * 90}ms`);
  });
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -25px 0px' });
  motionTargets.forEach(el => revealObserver.observe(el));
}

// NOVA course discovery: filters and accessible details dialog.
const courseData = [
 {title:'UI/UX Design Fundamentals',level:'Beginner',duration:'8 weeks',description:'Explore design principles, wireframes, user flows and high-fidelity interfaces. Build a case study for your portfolio.'},
 {title:'Frontend Development',level:'Intermediate',duration:'12 weeks',description:'Practice semantic HTML, responsive CSS, JavaScript interactions and accessible user interfaces through hands-on projects.'},
 {title:'AI & Creative Technology',level:'All levels',duration:'6 weeks',description:'Learn practical ways to incorporate AI tools into research, ideation and creative production with responsible workflows.'},
 {title:'Motion Design Essentials',level:'Intermediate',duration:'10 weeks',description:'Develop timing, easing and storytelling skills for motion graphics and modern digital experiences.'}
];
const filterButtons=[...document.querySelectorAll('.filter-button')];
const courseCards=[...document.querySelectorAll('.course-card')];
filterButtons.forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.filter;
 filterButtons.forEach(item=>{const active=item===button;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active));});
 courseCards.forEach(card=>{card.hidden=filter!=='all'&&card.dataset.level!==filter;});
}));
const dialog=document.querySelector('#course-dialog');
let previousFocus=null;
document.querySelectorAll('.course-details').forEach(button=>button.addEventListener('click',()=>{
 const course=courseData[Number(button.dataset.course)];previousFocus=button;
 document.querySelector('#dialog-title').textContent=course.title;
 document.querySelector('#dialog-description').textContent=course.description;
 document.querySelector('#dialog-meta').textContent=`${course.level} · ${course.duration} · Self-paced online learning`;
 if(typeof dialog.showModal==='function')dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>previousFocus?.focus());
document.querySelector('#dialog-cta').addEventListener('click',()=>dialog.close());
// Animated counters, only once they enter the viewport.
const counters=[...document.querySelectorAll('.counter')];
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateCounter(element){
 if(reducedMotion)return;
 const target=Number(element.dataset.target),start=performance.now(),duration=1350;
 function tick(now){const progress=Math.min((now-start)/duration,1);const eased=1-Math.pow(1-progress,3);element.textContent=Math.round(target*eased).toLocaleString('en-US');if(progress<1)requestAnimationFrame(tick);}
 element.textContent='0';requestAnimationFrame(tick);
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animateCounter(entry.target);observer.unobserve(entry.target);}}),{threshold:.4});counters.forEach(el=>observer.observe(el));}
