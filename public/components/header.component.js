class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
            <div>CABECERA</div>
        `;
  }
}

customElements.define("header-component", HeaderComponent);
