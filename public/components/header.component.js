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
                background-color: #ccc;
              }
              h1 {
                margin: 0;
                text-transform: uppercase;
                font-family: 'Arial';
              }
            </style>
            <div> <h1>Los mejores partidos de fútbol Online 🏟️ </h1></div>
        `;
  }
}
