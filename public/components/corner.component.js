import { eventService } from "../services/event.service.js";

const { filter } = rxjs;

export class CornerComponent extends HTMLElement {
  template = () => `
    <section>
      <header>Corners</header>
      <main class="corner-container"></main>
    </section>
  `;

  style = () => `
    <style>
      section {
        display: flex;
        color: white;
        align-items: center;
        background: linear-gradient(90deg,rgb(87, 114, 204),rgb(54, 95, 150));
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
        flex-direction: column;
        width: 100%;
        height: 100%;
        
        @media (min-width: 560px) {
          border-radius: 5px;
        }

        header {
            margin-top: 10px;
            font-size: 25px;
            font-weight: bold;
            color: white;
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
    this._subject = eventService.subject
      .pipe(filter((data) => data.evento === "Corner"))
      .subscribe((filteredData) => {
        this.corners.push(filteredData);
        this.render();
      });
    this._socket = eventService.getSocket();
    this._socket.on("update-video", () => {
      this.resetCorners();
      this.render();
    })
  }

  corners = [];

  connectedCallback() {
    this.render();
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
