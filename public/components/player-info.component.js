export class PlayerInfoComponent extends HTMLElement {
  template = () => `
    <section>
        <header><h3>Cerrar</h3></header>
        <main>
            <div class="player-info">
                <p><strong>Nombre:</strong></p><p>${this.playerInfo.nombre}</p>
                <p class="age"><strong>Edad: </strong>${this.playerInfo.edad} años</p>
            </div>
            <p><strong>Posición: </strong>${this.playerInfo.posicion}</p>
            <p><strong>Altura: </strong>${this.playerInfo.altura}</p>
            <p><strong>Descripción: </strong>${this.playerInfo.descripcion}</p>
        </main>
    </section>
  `;
  style = () => `
    <style>
        section {
            header {
                width: 100%;
                display: flex; 
                justify-content: flex-end;

                h3 {
                    cursor: pointer;
                    color: #f00;
                    margin: 0;
                    font-family: Calibri;
                    margin: 10px 20px;
                }
            }
            main {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 30px;
                font-size: 1.2em;
                font-family: Calibri;
    
                .player-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;
    
                    p {
                        margin: 10px 0;
                        padding: 0;
                    }
    
                    .age {
                        grid-column: 2 / 3;
                        grid-row: 1 / 3;
                        justify-self: center;
                    }
                }
            }
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

  get playerInfo() {
    const value = this.getAttribute("playerinfo");
    try {
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error parsing playerInfo:", error);
      return null;
    }
  }

  set playerInfo(value) {
    this.setAttribute("playerinfo", value);
  }

  render() {
    this.shadow.innerHTML = `
                ${this.style()}
                ${this.template()}    
            `;
    this.shadow.querySelector("header h3").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("info-closed", {
            detail: null,
            bubbles: true,
            composed: true,
        })
      )
    });
  }
}
