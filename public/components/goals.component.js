const { filter } = rxjs;
import { eventService } from "../services/event.service.js";

export class GoalsComponent extends HTMLElement {
  template = () => `
    <section class="scoreboard-container">
      <div class="scoreboard">
        <div class="team">
          <img id="team1-img" src="${this.team1Img}" alt="Equipo 1">
          </div>

        <div class="score-container">   
          <div class="score" id="score1">${this.score1}</div>
          <div class="vs">VS</div>
          <div class="score" id="score2">${this.score2}</div>
        </div>

        <div class="team">
          <img id="team2-img" src="${this.team2Img}" alt="Equipo 2">
        </div>
      </div>
    </section>
  `;

  style = () => `
    <style>
      .scoreboard-container {
        display: flex;  
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 140px;
        background: linear-gradient(90deg,#312e81,#7e22ce);
        color: white;
        padding: 10px;
        box-sizing: border-box;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);

        @media (min-width: 560px) {
          border-radius: 5px;
        }
      }

      .scoreboard {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          max-width: 600px;
          padding: 10px;
          flex-grow: 1;
          background-size: cover;
      }

      .team {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
      }

      .team img {
          width: 50px;
          height: 50px;
          object-fit: contain;
          margin-bottom: 5px;
          background: transparent;

          @media (min-width: 560px) {
            width: 80px;
            height: 80px;
          }
      }

      .score-container {
        margin: 0 25px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 2em;
        font-weight: bold;

        @media (min-width: 560px) {
          margin: 0 50px;
          font-size: 3em;
        }
        
        .score {
          margin: 0 15px;
          color: rgb(250, 204, 21);
          }
          
          .vs {
            flex: 0.3;
            text-align: center;
            }
        }
    </style>
  `;

  score1 = 0;
  score2 = 0;
  team1Img = "../assets/manchesterUnited.png";
  team2Img = "../assets/interMilan.svg";

  resetFields() {
    this.score1 = 0;
    this.score2 = 0;
  }

  connectedCallback() {
    this.render();
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this._subject = eventService.subject
      .pipe(filter((data) => data.evento === "gol"))
      .subscribe((filteredData) => {
        this.updateScore(filteredData.equipo);
      });
    this._socket = eventService.getSocket();
    this._socket.on("update-video", (videoData) => {
      this.team1Img = videoData.team1Url;
      this.team2Img = videoData.team2Url;
      this.resetFields();
      this.render();
    });
  }

  updateScore(team) {
    if (team === 1) {
      this.score1++;
    } else if (team === 2) {
      this.score2++;
    }
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}    
        `;
  }
}
