export class LoaderComponent extends HTMLElement {
  template = () => `
        <section class="loader">
                <img src="../assets/ball.svg" alt="loading content">
                <h1>Cargando...</h1>
        </section>
  `;
  style = () => `
        <style>
            .loader {
                width: 100vw;
                height: 100vh;
                background-color:rgb(16, 110, 50);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                img {
                    width: 70px;
                    animation: spin 2s linear infinite;
                }

                @media (min-width: 560px) {
                    img {
                        width: 100px;
                    }
                }
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
  
  `;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}
        `;
  }
}
