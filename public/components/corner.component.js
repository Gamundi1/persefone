const { filter } = rxjs;

export class CornerComponent extends HTMLElement {
  template = () => `
    <section>
      <header><h1>Corners</h1></header>
      <main class="corner-container"></main>
    </section>
  `;

  style = () => `
    <style>
      section {
        display: flex;
        background-color: #EEE;
        align-items: center;
        flex-direction: column;
        box-shadow: 5px 5px 0px -1px rgba(68, 0, 255, 0.57);
        -webkit-box-shadow: 0px 0px 20px 0px rgba(225, 221, 119, 0.57);
        -moz-box-shadow: 5px 5px 0px -1px rgba(0, 98, 190, 0.57);
        width: 100%;
        height: 100%;

        header {
          height: 50px;
          line-height: 10px;
        }

        .corner-container {
          height: 98px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-wrap: wrap;

          div {
            display: flex;
            width: 100%;
            justify-content: space-around;
            align-items: center;

            img {
              width: 20px;
              height: 20px;
            }
          }

        }
      }
    </style>
  `;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  corners = [];

  connectedCallback() {
    this.render();
  }

  set subject(value) {
    this._subject = value;
    this._subject
      .pipe(filter((data) => data.evento === "Corner"))
      .subscribe((filteredData) => {
        this.corners.push(filteredData);
        this.render();
      });
  }

  render() {
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}    
        `;

    this.drawCorners();
  }

  resetCorners() {
    this.corners = [];
    this.render();
  }

  drawCorners() {
    const main = this.shadow.querySelector("main");
    this.corners.forEach((corner) => {
      const cornerElement = document.createElement("div");
      cornerElement.innerHTML = `
          <img src="../assets/corner.svg" alt=""/>
          <p class="corner-time">${corner.tiempo}</p>
          <p>${corner.equipo}</p>
      `;
      main.appendChild(cornerElement);
    });
  }
}
