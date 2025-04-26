import { eventService } from "../services/event.service.js";

export class PollComponent extends HTMLElement {
  template = () => `
      <section>
          <header>¿Quién ganará?</header>
          <main>
            <img id="team1-img" src="${this.team1Img}" width='60' alt="Equipo 1">
            <div class="poll">
              <div class="vote-option left-side"></div>
            </div>
            <img id="team2-img" src="${this.team2Img}" width='60' alt="Equipo 2">
          </main>
      </section>
  `;

  style = () => `
      <style>
          section {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 30px;
            background: linear-gradient(90deg,rgb(224, 92, 92),rgb(163, 28, 89));
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
            align-items: center;
            height: 100%;

            @media (min-width: 560px) {
              border-radius: 5px;
            }

            header {
              font-size: 20px;
              font-family: 'Calibri', sans-serif;
              font-weight: bold;
              color: white;
            }
              
            main {
              display: flex;
              justify-content: space-between;
              width: 100%;
              align-items: center;

              .poll {
                border-radius: 20px;
                width: 300px;
                display: flex;
                height: 15px;
                background-color: rgba(0, 0, 0, 0.61);

                .vote-option {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: black;
                }

                .left-side {
                  background: linear-gradient(90deg, #ef4444, #f97316);
                  width: calc(100% * ${this.team1Votes / this.totalVotes});
                  border-radius: 20px;
                }
              }
            }
          }
      </style>
  `;

  totalVotes = 0;
  team1Votes = 0;
  team2Votes = 0;
  team1Img = "../assets/manchesterUnited.png";
  team2Img = "../assets/interMilan.svg";
  userVoted = false;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.team1Img = "../assets/manchesterUnited.png";
    this.team2Img = "../assets/interMilan.svg";
  }

  connectedCallback() {
    this.render();
    this._socket = eventService.getSocket();
    this._socket.on("initial-values", (votes) => {
      this.team1Votes = votes[0];
      this.team2Votes = votes[1];
      this.totalVotes = votes[0] + votes[1];
      this.render();
    });
    this._socket.on("update-votes", (votes) => {
      this.team1Votes = votes[0];
      this.team2Votes = votes[1];
      this.totalVotes++;
      this.render();
    });
  }

  set teamImages(teamImages) {
    this.team1Img = teamImages[0];
    this.team2Img = teamImages[1];
    this.resetFields();
    this.render();
  }

  resetFields() {
    this.totalVotes = 0;
    this.team1Votes = 0;
    this.team2Votes = 0;
  }

  render() {
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}    
        `;

    this.shadow.querySelector("#team1-img").addEventListener("click", () => {
      this.onUserVote(0);
    });
    this.shadow.querySelector("#team2-img").addEventListener("click", () => {
      this.onUserVote(1);
    });
  }

  async onUserVote(team) {
    if (!this.userVoted) {
      this.userVoted = true;
      this._socket.emit("user-vote", team);
    }
  }
}
