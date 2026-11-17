(() => {
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll('[data-set-theme]')];
  const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const getOverride = () => {
    try { const value=window.localStorage.getItem('stenvera-theme'); return value==='light'||value==='dark'?value:null; }
    catch { return null; }
  };
  const syncButtons = () => {
    buttons.forEach(button => {
      const active = button.dataset.setTheme === root.dataset.theme;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('active', active);
    });
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'dark' ? '#061320' : '#f7fbff');
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    root.dataset.theme=button.dataset.setTheme;
    try { window.localStorage.setItem('stenvera-theme',button.dataset.setTheme); } catch { /* private mode */ }
    syncButtons();
  }));
  themeQuery.addEventListener?.('change', event => {
    if (!getOverride()) { root.dataset.theme=event.matches?'dark':'light'; syncButtons(); }
  });
  syncButtons();
  document.querySelector('#year')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
  document.querySelectorAll('.lang-link').forEach(link => link.addEventListener('click', event => {
    const target=new URL(link.href);
    if (target.pathname===window.location.pathname) return;
    if (window.location.hash) { event.preventDefault(); window.location.href=target.pathname+window.location.hash; }
  }));
  const links=[...document.querySelectorAll('.nav-item')];
  const sections=[...document.querySelectorAll('#top,#about,#expertise,#projects,#homelab,#contact')];
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries => {
      const visible=entries.filter(item=>item.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible) return;
      links.forEach(a=>a.classList.toggle('current',a.getAttribute('href')==='#'+visible.target.id));
    },{rootMargin:'-15% 0px -58% 0px',threshold:[0,.25,.5,1]});
    sections.forEach(section=>observer.observe(section));
  }
})();
