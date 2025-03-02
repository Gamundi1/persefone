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

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    // Estados iniciales del marcador
    this.team1Img = "../assets/manchesterUnited.png"; // URL de la imagen del equipo 1
    this.team2Img = "../assets/interMilan.svg"; // URL de la imagen del equipo 2
    this.imagenfondo = "../assets/fondocampo.jpg"; // URL de la imagen de fondo
    this.score1 = 0;
    this.score2 = 0;
  }

  async connectedCallback() {
    this.render();
  }

  set subject(value) {
    this._subject = value;
    this._subject.subscribe((data) => {
      if (data.evento === "gol") {
        this.updateScore(data.equipo);
      }
    });
  }

  // Método para actualizar los goles desde el backend
  updateScore(team) {
    if (team === 1) {
      this.score1++;
      this.shadow.querySelector("#score1").textContent = this.score1;
    } else if (team === 2) {
      this.score2++;
      this.shadow.querySelector("#score2").textContent = this.score2;
    }
    this.render();
  }

  // Método para actualizar las imágenes de los equipos
  updateImages(img1, img2) {
    this.team1Img = img1;
    this.team2Img = img2;

    this.shadow.querySelector("#team1-img").src = this.team1Img;
    this.shadow.querySelector("#team2-img").src = this.team2Img;
  }

  render() {
    // Agregar el HTML de la estructura del marcador dentro del Shadow DOM
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}    
        `;
  }
}
