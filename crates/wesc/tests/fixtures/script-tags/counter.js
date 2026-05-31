
class WCounter extends HTMLElement {
  connectedCallback() {
    console.log('w-counter connected');
  }
}
customElements.define('w-counter', WCounter);
