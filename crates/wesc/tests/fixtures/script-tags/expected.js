//#region .wesc/scripts/counter.js
var WCounter = class extends HTMLElement {
  connectedCallback() {
    console.log('w-counter connected');
  }
};
customElements.define('w-counter', WCounter);
//#endregion
//#region .wesc/scripts/card.js
var WCard = class extends HTMLElement {
  connectedCallback() {
    console.log('w-card connected');
  }
};
customElements.define('w-card', WCard);
//#endregion
