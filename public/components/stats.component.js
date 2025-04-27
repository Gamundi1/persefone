import { eventService } from "../services/event.service.js";

export class StatsComponent extends HTMLElement {
  template = () => `
    <section>
      <header>Estadísticas</header>
      <table>
        <thead>
          <th>${this.team1name}</th>
          <th>Estadística</th>
          <th>${this.team2name}</tr>
        </thead>

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
    </section>
  `;

  style = () => `
  <style>
    section {
      background: linear-gradient(90deg, #5b21b6, #7e22ce);
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;

      @media (min-width: 560px) {
        border-radius: 5px;
      }

      header {
          margin: 15px 0;
          font-size: 25px;
          font-weight: bold;
          color: white;
      }

      thead {
        border-bottom: 1px solid #fff3;
        th {
          color: white;
          font-size: 14px;
          font-weight: 600;
          height: 20px;
        }
      }


      .team-img {
        width: 80px;
        height: 80px;
      }

      table {
        width: 90%;
        border-collapse: collapse;
      }

      tbody {
        td {
          text-align: center;
          border-bottom: 1px solid #ffffff1a;
          font-weight: 600;
          color: white;
          font-size: 18px;
        }
  
        tr {
          height: 60px;
          .stats-attribute {
            font-weight: 700;
            color: rgb(205, 214, 255);
          }
        }
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
  team1name = "Man United";
  team2name = "Inter Milan";

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    this._subject = eventService.subject.subscribe((data) => {
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

    this._socket = eventService.getSocket();
    this._socket.on("update-video", () => {
      this.resetFields();
      this.render();
    })

  }

  connectedCallback() {
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
