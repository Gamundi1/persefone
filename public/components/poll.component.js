export class PollComponent extends HTMLElement {
  template = () => `
      <section>
          <header>¿Quién ganará?</header>
          <main>
            <img id="team1-img" src="${this.team1Img}" width='80' alt="Equipo 1">
            <div class="poll">
              <div class="vote-option left-side">${this.team1Votes > 0 ? `<p>${Number(100 * (this.team1Votes / this.totalVotes)).toFixed(0)}%</p>` : ""}</div>
              <div class="vote-option right-side">${this.team2Votes > 0 ? `<p>${Number(100 * (this.team2Votes / this.totalVotes)).toFixed(0)}%</p>` : ""}</div>
            </div>
            <img id="team2-img" src="${this.team2Img}" width='80' alt="Equipo 2">
          </main>
      </section>
  `;

  style = () => `
      <style>
          section {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            height: 100%;
            background: rgb(179,0,0);
            background: linear-gradient(90deg, rgba(179,0,0,1) 0%, rgba(110,53,53,1) 50%, rgba(255,255,255,1) 100%);
            header {
              font-size: 30px;
              font-family: 'Arial';
              font-weight: bold;
            }
            main {
              display: flex;
              justify-content: space-between;
              width: 100%;
              align-items: center;
              .poll {
                border-radius: 3px;
                border: 1px solid white;
                width: 300px;
                display: flex;
                height: 25px;
                background-color: var(--body-background-color);

                .vote-option {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: black;
                }

                .left-side {
                  background-color:rgb(211, 26, 26);
                  width: calc(100% * ${this.team1Votes / this.totalVotes});
                }

                .right-side {
                  background-color:rgb(252, 252, 252);
                  width: calc(100% * ${this.team2Votes / this.totalVotes});
                }
              }
            }
          }
      </style>
  `;

  totalVotes = 0;
  team1Votes = 0;
  team2Votes = 0;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.team1Img = "../assets/manchesterUnited.png";
    this.team2Img = "../assets/interMilan.svg";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}    
        `;

    this.shadow.querySelector("#team1-img").addEventListener("click", () => {
      this.onUserVote("team1");
    });
    this.shadow.querySelector("#team2-img").addEventListener("click", () => {
      this.onUserVote("team2");
    });
  }

  onUserVote(team) {
    this.totalVotes++;
    if (team === "team1") {
      this.team1Votes++;
    } else {
      this.team2Votes++;
    }
    this.render();
  }
}
