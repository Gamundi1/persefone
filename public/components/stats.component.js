export class StatsComponent extends HTMLElement {
  template = () => `
    <section>
      <img class="team-img" src="${this.team1Img}" alt="Equipo 1">
      <table>
        <tbody>
          <tr>
            <td>${Math.round((this.teamPrecision[0].aciertos / this.teamPrecision[0].total) * 100) | 0}</td>
            <td class="stats-attribute">Precisión</td>
            <td>${Math.round((this.teamPrecision[1].aciertos / this.teamPrecision[1].total) * 100) | 0}</td>
          </tr>
          <tr>
            <td>${this.teamShots[0]}</td>
            <td class="stats-attribute">Tiros a puerta</td>
            <td>${this.teamShots[1]}</td>
          </tr>
          <tr>
            <td>${this.teamClearances[0]}</td>
            <td class="stats-attribute">Despejes</td>
            <td>${this.teamClearances[1]}</td>
          </tr>
        <tbody>
      </table>
      <img class="team-img" src="${this.team2Img}" alt="Equipo 1">
    </section>
  `;

  style = () => `
  <style>
    section {
      background-color: #EEE;
      display: flex;
      justify-content: space-around;
      box-shadow: 5px 5px 0px -1px rgba(68, 0, 255, 0.57);
      -webkit-box-shadow: 5px 5px 0px -1px rgba(0, 255, 106, 0.57);
      -moz-box-shadow: 5px 5px 0px -1px rgba(0, 98, 190, 0.57);
      align-items: center;
      width: 100%;
      height: 100%;

      .team-img {
        width: 80px;
        height: 80px;
      }

      table {
        width: 290px;
        height: 95%;
        border-collapse: collapse;
      }

      td {
        padding: 10px;
        text-align: center;
        border-bottom: 1px solid #000;
      }

      tr {
        height: 40px;
      }
    }
  </style>
  `;

  teamPrecision = [
    {
      total: 0,
      aciertos: 0,
    },
    {
      total: 0,
      aciertos: 0,
    },
  ];
  teamShots = [0, 0];
  teamClearances = [0, 0];
  team1Img = "../assets/manchesterUnited.png";
  team2Img = "../assets/interMilan.svg";

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  set teamImages(teamImages) {
    this.team1Img = teamImages[0];
    this.team2Img = teamImages[1];
    this.resetFields();
    this.render();
  }

  resetFields() {
    this.teamPrecision = [
      {
        total: 0,
        aciertos: 0,
      },
      {
        total: 0,
        aciertos: 0,
      },
    ];
    this.teamShots = [0, 0];
    this.teamClearances = [0, 0];
  }

  set subject(value) {
    this._subject = value;
    this._subject.subscribe((data) => {
      if (data.evento === "Pase" && data.Succes) {
        this.updatePrecision(data.Equipo - 1, data.Succes);
      } else if (data.evento === "Tiro" && data.Puerta) {
        this.teamShots[data.Equipo - 1]++;
        this.render();
      } else if (data.evento === "Despeje") {
        this.teamClearances[data.Equipo - 1]++;
        this.render();
      }
    });
  }

  updatePrecision(equipo, success) {
    this.teamPrecision[equipo].total++;
    if (success) {
      this.teamPrecision[equipo].aciertos++;
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
