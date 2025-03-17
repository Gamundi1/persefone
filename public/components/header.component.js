export class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
            <style>
              div {
                display: flex;
                justify-content: center;
                align-items: center;
              }
              h1 {
                color: white;
                margin: 0;
              }
            </style>
            <div> <h1>Los mejores partidos de fútbol Online 🏟️ </h1></div>
        `;
  }
}
