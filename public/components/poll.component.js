class PollComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
            <div>ENCUESTA</div>
        `;
  }
}

customElements.define("poll-component", PollComponent);
