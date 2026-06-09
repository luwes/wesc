//#region .wesc/scripts/tests/fixtures/blog/nav-menu.js
var NavMenu = class extends HTMLElement {
  connectedCallback() {
    const burger = this.querySelector('.nav__burger');
    const list = this.querySelector('.nav__list');
    burger?.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      if (list) list.hidden = open;
    });
  }
};
customElements.define('nav-menu', NavMenu);
//#endregion
//#region .wesc/scripts/tests/fixtures/blog/site-header.js
var SiteHeader = class extends HTMLElement {
  connectedCallback() {
    const header = this.querySelector('.masthead');
    let last = 0;
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        header?.classList.toggle('masthead--hidden', y > last && y > 120);
        last = y;
      },
      { passive: true },
    );
  }
};
customElements.define('site-header', SiteHeader);
//#endregion
//#region .wesc/scripts/tests/fixtures/blog/w-layout.js
var WLayout = class extends HTMLElement {
  connectedCallback() {
    this.dataset.enhanced = 'true';
  }
};
customElements.define('w-layout', WLayout);
const root = document.documentElement;
const stored = localStorage.getItem('theme');
if (stored) root.dataset.theme = stored;
document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-theme-toggle]')) return;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
});
//#endregion
//#region .wesc/scripts/tests/fixtures/blog/newsletter-box.js
var NewsletterBox = class extends HTMLElement {
  connectedCallback() {
    const form = this.querySelector('form');
    const status = this.querySelector('.newsletter__status');
    const success = this.querySelector('#newsletter-success');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!new FormData(form).get('email')) return;
      if (success && status) {
        status.hidden = false;
        status.replaceChildren(success.content.cloneNode(true));
      }
      form.reset();
    });
  }
};
customElements.define('newsletter-box', NewsletterBox);
//#endregion
//#region .wesc/scripts/tests/fixtures/blog/side-bar.js
var SideBar = class extends HTMLElement {};
customElements.define('side-bar', SideBar);
//#endregion
//#region .wesc/scripts/tests/fixtures/blog/blog-post.js
var BlogPost = class extends HTMLElement {
  static get observedAttributes() {
    return ['featured'];
  }
  connectedCallback() {
    this.shadowRoot?.querySelector('.post__share')?.addEventListener('click', async () => {
      const href = this.querySelector('a')?.getAttribute('href') ?? '/';
      const url = new URL(href, location.origin);
      if (navigator.share)
        await navigator.share({
          url: url.href,
          title: this.dataset.title,
        });
      else await navigator.clipboard?.writeText(url.href);
    });
  }
};
customElements.define('blog-post', BlogPost);
//#endregion
