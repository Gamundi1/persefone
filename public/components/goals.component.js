class GoalsComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
            <div>GOALS</div>
        `;
  }
}

customElements.define("goals-component", GoalsComponent);
