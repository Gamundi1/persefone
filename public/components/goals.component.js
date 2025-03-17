const { filter } = rxjs;

export class GoalsComponent extends HTMLElement {
  template = () => `
    <section class="scoreboard-container">
      <div class="scoreboard">
        <div class="team">
          <img id="team1-img" src="${this.team1Img}" alt="Equipo 1">
          <div class="score" id="score1">${this.score1}</div>
        </div>

        <div class="vs">VS</div>

        <div class="team">
          <img id="team2-img" src="${this.team2Img}" alt="Equipo 2">
          <div class="score" id="score2">${this.score2}</div>
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
        height: 100%;
        font-family: Arial, sans-serif;
        background: #222;
        color: white;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 10px;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
      }

      .scoreboard {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 100%;
          max-width: 600px;
          padding: 10px;
          flex-grow: 1;
          background: url('${this.imagenfondo}') no-repeat center center;
          background-size: cover;
      }

      .team {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
      }

      .team img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin-bottom: 5px;
          background: transparent;
      }

      .team img {
          width: 70px; /* Ajusta el tamaño de la imagen del equipo 1 */
          height: 70px; /* Ajusta el tamaño de la imagen del equipo 1 */
      }

      .score {
          font-size: 40px;
          font-weight: bold;
      }

      .vs {
          font-size: 30px;
          font-weight: bold;
          flex: 0.3;
          text-align: center;
      }
    </style>
  `;

  score1 = 0;
  score2 = 0;
  team1Img = "../assets/manchesterUnited.png";
  team2Img = "../assets/interMilan.svg";
  imagenfondo = "../assets/fondocampo.jpg";

  set teamImages(teamImages) {
    this.team1Img = teamImages[0];
    this.team2Img = teamImages[1];
    this.resetFields();
    this.render();
  }

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
  }

  set subject(value) {
    this._subject = value;
    this._subject
      .pipe(filter((data) => data.evento === "gol"))
      .subscribe((filteredData) => {
        this.updateScore(filteredData.equipo);
      });
  }

  // Método para actualizar los goles desde el backend
  updateScore(team) {
    if (team === 1) {
      this.score1++;
    } else if (team === 2) {
      this.score2++;
    }
    this.render();
  }

  render() {
    // Agregar el HTML de la estructura del marcador dentro del Shadow DOM
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}    
        `;
  }
}
