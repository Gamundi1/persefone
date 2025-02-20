class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
            <div>PIE DE PAGINA</div>
        `;
  }
}

customElements.define("footer-component", FooterComponent);
