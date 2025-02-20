class StatsComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
            <div>ESTADISTICAS</div>
        `;
  }
}

customElements.define("stats-component", StatsComponent);
