// ============================================================
// ARKADIY'S MOBILE DETAILING — Site script
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile drawer ---------- */
  const drawer = document.querySelector('.mobile-drawer');
  const toggleBtn = document.querySelector('.nav-toggle');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const openDrawer = () => { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeDrawer = () => { drawer.classList.remove('open'); document.body.style.overflow = ''; };
  toggleBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Generate hero sparkles ---------- */
  const sparkleWrap = document.querySelector('.hero-sparkle');
  if (sparkleWrap) {
    const count = window.innerWidth < 600 ? 10 : 20;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      const size = Math.random() * 3 + 1.5;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.top = Math.random() * 90 + '%';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 4) + 's';
      s.style.animationDuration = (Math.random() * 2.5 + 2.5) + 's';
      sparkleWrap.appendChild(s);
    }
  }

  /* ---------- Pricing tabs (scroll to section) ---------- */
  const tabs = document.querySelectorAll('.pricing-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = document.querySelector(tab.dataset.target);
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.gallery-filter button');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lbClose = lightbox?.querySelector('.lightbox-close');
  const lbPrev = lightbox?.querySelector('.lightbox-prev');
  const lbNext = lightbox?.querySelector('.lightbox-next');
  let visibleImgs = [];
  let currentIdx = 0;

  const refreshVisible = () => {
    visibleImgs = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  };

  const openLightbox = (item) => {
    refreshVisible();
    currentIdx = visibleImgs.indexOf(item);
    showCurrent();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const showCurrent = () => {
    const img = visibleImgs[currentIdx]?.querySelector('img');
    if (img && lightboxImg) {
      lightboxImg.src = img.dataset.full || img.src;
      lightboxImg.alt = img.alt;
    }
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });
  lbClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lbPrev?.addEventListener('click', () => { currentIdx = (currentIdx - 1 + visibleImgs.length) % visibleImgs.length; showCurrent(); });
  lbNext?.addEventListener('click', () => { currentIdx = (currentIdx + 1) % visibleImgs.length; showCurrent(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev?.click();
    if (e.key === 'ArrowRight') lbNext?.click();
  });

  /* ---------- Contact form (mailto handoff, no backend) ---------- */
  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || '';
    const phone = data.get('phone') || '';
    const email = data.get('email') || '';
    const vehicle = data.get('vehicle') || '';
    const pkg = data.get('package') || '';
    const message = data.get('message') || '';

    const body = `Name: ${name}%0APhone: ${phone}%0AEmail: ${email}%0AVehicle: ${vehicle}%0APackage interested: ${pkg}%0A%0AMessage:%0A${message}`;
    const mailto = `mailto:hello@arkadiysmobiledetailing.com?subject=${encodeURIComponent('New booking request — ' + name)}&body=${body}`;

    window.location.href = mailto;

    form.style.display = 'none';
    document.querySelector('.form-success')?.classList.add('show');
  });

  /* ---------- Package CTA buttons fill the form ---------- */
  document.querySelectorAll('[data-package-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = document.querySelector('select[name="package"]');
      if (sel) sel.value = btn.dataset.packageSelect;
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a, .mobile-drawer nav a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + id ? 'var(--ice-white)' : '';
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-100px 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

});
