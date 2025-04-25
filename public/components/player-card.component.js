export class PlayerCardComponent extends HTMLElement {
  template = () => `
      <button class="player-card">
     <svg id="camiseta" width="100" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="sombra" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.15"/>
    </filter>
    <style>
      .costura {
        stroke-dasharray: 3, 3;
        stroke: #888;
        stroke-width: 0.8;
        fill: none;
      }
    </style>
  </defs>
  <path d="M50,20 
           Q40,55 40,85 
           L40,160 
           Q40,170 50,170 
           L150,170 
           Q160,170 160,160 
           L160,85 
           Q160,55 150,20 
           L120,20 
           Q115,35 100,35 
           Q85,35 80,20 
           Z" 
        fill=${this.playerInfo.color} stroke="#111" stroke-width="1.5" filter="url(#sombra)"/>

  <path d="M80,20 Q85,35 100,35 Q115,35 120,20" fill="#bbb" />
  <path d="M82,20 Q87,32 100,32 Q113,32 118,20" fill="#888" opacity="0.7"/>

  <path d="M40,85 L10,70 Q5,60 10,50 L40,40 Z" fill="#e0e0e0" stroke="#111" stroke-width="1.5"/>
  <path d="M40,65 L10,55 Q5,50 10,45 L40,35 Z" fill="#bdbdbd" opacity="0.6"/>

  <path d="M160,85 L190,70 Q195,60 190,50 L160,40 Z" fill="#e0e0e0" stroke="#111" stroke-width="1.5"/>
  <path d="M160,65 L190,55 Q195,50 190,45 L160,35 Z" fill="#bdbdbd" opacity="0.6"/>

  <path d="M50,20 Q45,60 45,90" class="costura"/>
  <path d="M150,20 Q155,60 155,90" class="costura"/>
  <path d="M50,170 Q50,160 100,160 Q150,160 150,170" class="costura"/>

  <text id="numero-jugador" x="100" y="125" font-size="38" text-anchor="middle" fill="#111" font-family="Arial Black, sans-serif">10</text>
</svg>

</button>
      `;

  style = () => `
      <style>
        .player-card {
          position: relative;
          width: 50px;
          height: 70px;
          cursor: pointer;
          border: none;

          svg {
            position: absolute;
            top: -10px;
            left: -25px;
          }

        &.selected {
            svg {
              color: #f00;
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

  playerInfo;

  render() {
    this.playerInfo = JSON.parse(this.getAttribute("playerInfo"));
    this.shadow.innerHTML = `
              ${this.style()}
              ${this.template()}
            `;
    this.shadow.querySelector("#numero-jugador").textContent =
    this.playerInfo.playerNumber;
    this.shadow.querySelector("button").addEventListener("click", () => {
      this.shadow.querySelector(".player-card").classList.add("selected");
      fetch("/player-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerNumber: this.playerInfo.playerNumber,
          team: this.playerInfo.team,
        }),
      }).then((response) => {
        response.json().then((data) => {
          this.dispatchEvent(
            new CustomEvent("player-data-loaded", {
              detail: data,
              bubbles: true,
              composed: true,
            })
          );
        });
      });
    });
  }
}
