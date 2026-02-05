(function(){
  const nav = document.querySelector('.site-nav');
  const menu = document.getElementById('menu');
  const toggle = document.querySelector('.nav-toggle');
  const menuLinks = document.querySelectorAll('.menu a');
  const sections = document.querySelectorAll('section');
  const indicator = document.querySelector('.indicator');
  const SCROLL_TRIGGER = 80;

  if(!nav || !menu) return;

  // Smooth scroll on nav updates
  function onScroll(){
    const scrolled = window.scrollY > SCROLL_TRIGGER;
    nav.classList.toggle('scrolled', scrolled);
  }

  // Mobile hamburger toggle
  if(toggle){
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
      toggle.classList.toggle('open');
    });
  }

  // Close menu on link click
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      if(toggle) toggle.setAttribute('aria-expanded','false');
      if(toggle) toggle.classList.remove('open');
    });
  });

  // Smooth indicator movement
  function moveIndicatorTo(link){
    if(!indicator || !link) return;
    const rect = link.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const left = rect.left - menuRect.left;
    const width = rect.width;
    indicator.style.width = width + 'px';
    indicator.style.transform = 'translateX(' + left + 'px)';
    indicator.classList.remove('hidden');
  }

  function hideIndicator(){
    if(!indicator) return;
    indicator.classList.add('hidden');
    indicator.style.width = '0';
  }

  // Smart section reveal with IntersectionObserver
  const observerOptions = {root:null, rootMargin:'-35% 0px -45% 0px', threshold:0};
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector('.menu a[href="#' + id + '"]');
      
      if(entry.isIntersecting){
        document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
        if(link){
          link.classList.add('active');
          moveIndicatorTo(link);
        }
        entry.target.classList.add('reveal');
      } else {
        entry.target.classList.remove('reveal');
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // Hover preview for menu items
  menuLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicatorTo(link));
    link.addEventListener('focus', () => moveIndicatorTo(link));
    link.addEventListener('mouseleave', () => {
      const active = document.querySelector('.menu a.active');
      if(active) moveIndicatorTo(active);
      else hideIndicator();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if(!menu.classList.contains('open')) return;
    if(menu.contains(e.target) || (toggle && toggle.contains(e.target))) return;
    menu.classList.remove('open');
    if(toggle) toggle.setAttribute('aria-expanded','false');
    if(toggle) toggle.classList.remove('open');
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && menu.classList.contains('open')){
      menu.classList.remove('open');
      if(toggle) toggle.setAttribute('aria-expanded','false');
      if(toggle) toggle.classList.remove('open');
    }
  });

  // Resize handling
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const active = document.querySelector('.menu a.active');
      if(active) moveIndicatorTo(active);
    }, 150);
  });

  // Initialize active state
  document.addEventListener('DOMContentLoaded', () => {
    const active = document.querySelector('.menu a.active') || document.querySelector('.menu a');
    if(active) moveIndicatorTo(active);
  });

  // Enhanced card reveal with stagger
  const cards = document.querySelectorAll('.card');
  if(cards.length > 0){
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if(entry.isIntersecting){
          setTimeout(() => {
            entry.target.classList.add('reveal');
          }, index * 140);
        }
      });
    }, {rootMargin: '-60px', threshold: 0.1});
    cards.forEach(card => cardObserver.observe(card));
  }

  // Menu hover effect
  menu.addEventListener('mouseenter', () => nav.classList.add('item-hover'));
  menu.addEventListener('mouseleave', () => nav.classList.remove('item-hover'));

  // Passive scroll listener for performance
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();
