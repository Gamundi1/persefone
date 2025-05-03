import { eventService } from "../../services/event.service.js";

export class LineUpComponent extends HTMLElement {
  template = () => `
  <div class="team-selector">
    <img id="team1-img" class="team-img selected" src="${this.team1Img}" width='50' alt="Equipo 1">
    <img id="team2-img" class="team-img" src="${this.team2Img}" width='50' alt="Equipo 2">
    <div class="team-selected"></div>
  </div>
      <formation-component></formation-component>
    `;

  style = () => `
    <style>
    .team-selector {
      display: flex;
      position: relative;
      justify-content: space-around;
      height: 50px;
      width: 100%;
      transition: all 0.3s ease-in-out;
      padding-bottom: 10px;
      padding-top: 10px;

      .team-img:hover {
        cursor: pointer;
        filter: drop-shadow(0 0 5px #fff);
        position: relative
      }

      .team-selected {
        position: absolute;
        width: 60px;
        height: 60px;
        border-radius: 10px;
        border: 1px solid red;
        top: 0;
        left: 0;
        transition: left 0.3s ease;
      }
    }
        }
    </style>
  `;

  team1Img = "../assets/manchesterUnited.png";
  team2Img = "../assets/interMilan.svg";
  formationComponent = null;
  match = 0;
  team = 0;

  moveSelection = (event) => {
    const selectedImg = event.target;
    this.updateSelector(selectedImg);
    this.team = selectedImg.id === "team1-img" ? 0 : 1;
    this.formationComponent.setAttribute(
      "lineupInfo",
      JSON.stringify({ match: this.match, team: this.team })
    );
  };

  updateSelector = (selectedImg) => {
    const selector = this.shadow.querySelector(".team-selected");

    const imgRect = selectedImg.getBoundingClientRect();
    const containerRect = this.shadow
      .querySelector(".team-selector")
      .getBoundingClientRect();

    const top =
      imgRect.top -
      containerRect.top +
      imgRect.height / 2 -
      selector.offsetHeight / 2;
    const left =
      imgRect.left -
      containerRect.left +
      imgRect.width / 2 -
      selector.offsetWidth / 2;

    selector.style.top = `${top}px`;
    selector.style.left = `${left}px`;
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.createSocket();
  }

  createSocket() {
    this._socket = eventService.getSocket();
    this._socket.on("update-video", (videoData) => {
      this.team1Img = videoData.team1Url;
      this.team2Img = videoData.team2Url;
      this.match = videoData.id - 1;
      this.render();
    });
  }

  render() {
    this.shadow.innerHTML = `
    ${this.style()}
    ${this.template()}
    `;

    requestAnimationFrame(() => {
      this.formationComponent = this.shadow.querySelector(
        "formation-component"
      );
      this.formationComponent.setAttribute(
        "lineupInfo",
        JSON.stringify({ match: this.match, team: this.team })
      );
      const teamImages = this.shadow.querySelectorAll(".team-img");
      teamImages.forEach((img) => {
        img.addEventListener("click", this.moveSelection);
      });
      this.updateSelector(teamImages[0]);
    });
  }
}
