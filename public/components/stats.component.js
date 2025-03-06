export class StatsComponent extends HTMLElement {
  template = () => `
    <section>
      <table>
        <tbody>
          <tr>
            <td>${Math.round((this.teamPrecision[0].aciertos / this.teamPrecision[0].total) * 100) | 0}</td>
            <td class="stats-attribute">Precisión</td>
            <td>${Math.round((this.teamPrecision[0].aciertos / this.teamPrecision[0].total) * 100) | 0}</td>
          </tr>
          <tr>
            <td>${this.teamShots[0]}</td>
            <td class="stats-attribute">Tiros a puerta</td>
            <td>${this.teamShots[1]}</td>
          </tr>
          <tr>
            <td>0</td>
            <td class="stats-attribute">Despejes</td>
            <td>0</td>
          </tr>
        <tbody>
      </table>
    </section>
  `;

  style = () => `
  <style>
    section {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;

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

      tbody tr::before {
        content:'';
        position: relative;
        top: 36px;
        left: 57px;
        display: inline-block;
        border: 5px solid;
        border-color: transparent transparent black transparent;
      }

      tbody tr::after {
        content:'';
        position: relative;
        top: 36px;
        right: 57px;
        display: inline-block;
        border: 5px solid;
        border-color: transparent transparent black transparent;
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

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  set subject(value) {
    this._subject = value;
    this._subject.subscribe((data) => {
      if (data.evento === "pase") {
        this.updatePrecision(data.equipo - 1, data.success);
      } else if (data.evento === "tiro") {
        this.teamShots[data.equipo - 1]++;
        this.render();
      } else if (data.evento === "despeje") {
        this.teamClearances[data.equipo - 1]++;
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
