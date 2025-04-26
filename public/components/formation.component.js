export class FormationComponent extends HTMLElement {
  template = () => `
        <section class="lineup">
          <div class="lineup-markings">
            <div class="penalty-area top"></div>
            <div class="penalty-area bottom"></div>
            <div class="halfway-line"></div>
            <div class="center-circle"></div>
          </div>
          <div class="lineup-container"></div>
          <div class="player-info"></div>
        </section>
      `;
  style = () => `
      <style>
          section {
                position: relative;
                width: 100%;
                height: 100%;
                min-height: 500px;
                background: linear-gradient(to bottom, #16a34a, #059669);
                border-radius: 0.5rem;
                overflow: hidden;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

              .field-markings {
                position: absolute;
                inset: 0;
              }

              .penalty-area {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                width: 33%;
                height: 10%;
                border-radius: 0 0 0.5rem 0.5rem;
                border: 2px solid rgba(255, 255, 255, 0.7);
                border-top: none;
              }

              .penalty-area.top {
                top: 0;
              }

              .penalty-area.bottom {
                bottom: 0;
                border-radius: 0.5rem 0.5rem 0 0;
                border-bottom: none;
                border-top: 2px solid rgba(255, 255, 255, 0.7);
              }

              .halfway-line {
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: rgba(255, 255, 255, 0.7);
              }

              .center-circle {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 6rem;
                height: 6rem;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.7);
              }
  
              .lineup-container {
                background: linear-gradient(#16a34a, #059669);
                display: grid;
                width: 100%;
                height: 100%;
                justify-items: center;
                align-items: center;
  
                .player-row {
                  justify-items: center;
                  display: grid;
                  width: 100%;
                }
  
                player-card-component {
                  width: min-content;
                }
              }

              .player-info:has(player-info-component) {
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.90);
                position: absolute;
              }
          }
      </style>
    `;

  alignment = [
    [
      {
        team: "Manchester United",
        color: "#DA291C",
        formation: [3, 4, 3, 1],
        players: [2, 18, 23, 10, 25, 8, 7, 11, 9, 17, 20],
      },
      {
        team: "interMilan",
        color: "#40E0D0",
        formation: [3, 3, 4, 1],
        players: [1, 15, 29, 4, 12, 7, 20, 31, 10, 11, 9],
      },
    ],
  ];

  match = 0;
  team = 0;

  get lineupInfo() {
    return this.getAttribute("lineupInfo");
  }

  set lineupInfo(val) {
    this.setAttribute("lineupinfo", val);
  }

  static get observedAttributes() {
    return ["lineupinfo"];
  }

  attributeChangedCallback(prop, oldValue, newValue) {
    if (oldValue) {
      const lineupInfo = JSON.parse(newValue);
      this.match = lineupInfo.match;
      this.team = lineupInfo.team;
      this.render();
    }
  }

  createFormation = () => {
    const container = this.shadow.querySelector(".lineup-container");
    const selectedTeam = this.alignment[this.match][this.team];
    let playerIndex = 0;
    const formation = selectedTeam.formation;
    container.style.gridTemplateRows = `repeat(${formation.length}, 1fr)`;

    formation.forEach((playersInRow) => {
      const row = document.createElement("div");
      row.classList.add("player-row");
      row.style.gridTemplateColumns = `repeat(${playersInRow}, 1fr)`;

      for (let i = 0; i < playersInRow; i++) {
        const playerCard = document.createElement("player-card-component");
        playerCard.addEventListener("player-data-loaded", (event) => {
          this.showPlayerInfo(event.detail);
        });
        playerCard.setAttribute(
          "playerInfo",
          JSON.stringify({
            playerNumber: selectedTeam.players[playerIndex],
            team: selectedTeam.team,
            color: selectedTeam.color,
          })
        );
        playerCard.textContent = selectedTeam.players[playerIndex];
        row.appendChild(playerCard);
        playerIndex++;
      }
      container.appendChild(row);
    });
  };

  showPlayerInfo = (playerInfo) => {
    const playerInfoContainer = this.shadow.querySelector(".player-info");
    const playerInfoComponent = document.createElement("player-info-component");
    playerInfoComponent.setAttribute("playerInfo", JSON.stringify(playerInfo));
    playerInfoComponent.addEventListener("info-closed", () => {
      console.log("info-closed event triggered");
      this.shadow.querySelector("player-info-component").remove();
    });
    playerInfoContainer.appendChild(playerInfoComponent);
  };

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
    this.createFormation();
  }
}
