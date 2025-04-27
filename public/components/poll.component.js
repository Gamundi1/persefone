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
            padding: 0 20px;
            background: linear-gradient(90deg,rgb(224, 92, 92),rgb(163, 28, 89));
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
            align-items: center;
            height: 100%;

            @media (min-width: 560px) {
              border-radius: 5px;
            }

            header {
              font-size: 20px;
              font-weight: bold;
              color: white;
            }
              
            main {
              display: flex;
              justify-content: space-between;
              width: 100%;
              align-items: center;

              img:hover {
                cursor: pointer;
                transform: scale(1.1);
                transition: transform 0.2s ease-in-out;
              }

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
  videoId = 1;
  team1Img = "../assets/manchesterUnited.png";
  team2Img = "../assets/interMilan.svg";
  userVoted = [false, false];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
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

    this._socket.on("update-video", (videoData, votes) => {
      this.updateVotes(votes);
      this.team1Img = videoData.team1Url;
      this.team2Img = videoData.team2Url;
      this.videoId = videoData.id;
      this.render();
    });
  }

  updateVotes(votes) {
    this.team1Votes = votes[0];
    this.team2Votes = votes[1];
    this.totalVotes = votes[0] + votes[1];
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
    if (!this.userVoted[this.videoId - 1]) {
      this.userVoted = true;
      this._socket.emit("user-vote", team, this.videoId - 1);
    }
  }
}
