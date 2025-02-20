class BestMomentsComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
            <div>MEJORES MOMENTOS</div>
        `;
  }
}

customElements.define("best-moments-component", BestMomentsComponent);
