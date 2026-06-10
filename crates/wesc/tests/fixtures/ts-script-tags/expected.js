//#region .wesc/scripts/counter.ts
var WCounter = class extends HTMLElement {
  state = { count: 0 };
  connectedCallback() {
    const label = `w-counter connected at ${this.state.count}`;
    console.log(label);
  }
};
customElements.define('w-counter', WCounter);
//#endregion
//#region .wesc/scripts/card.ts
var WCard = class extends HTMLElement {
  mode = 'on';
  connectedCallback() {
    console.log('w-card connected', this.mode);
  }
};
customElements.define('w-card', WCard);
//#endregion
