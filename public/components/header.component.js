import { navigationService } from "../services/navigation.service.js";

export class HeaderComponent extends HTMLElement {
  template = () => `
    <header>
      <span>Football Viewer</span>
      <button class="create-room"> Crear una sala </button>
      <form>
        <label for="join">Id de sala</label>
        <input class="join-room" placeholder="Id de sala" id="join" />
      </form>
    </header>
  `;

  styles = () => `
    <style>
      header {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        @media (min-width: 560px) {
          padding: 0 50px;
        }

        .create-room {
          display: none;
          color: white;
          border: none;
          width: 160px;
          border-radius: 5px;
          font-weight: bold;
          height: 30px;
          background: linear-gradient(90deg, #22c55e, #059669);

          @media (min-width: 560px) {
            display: block;
          }

          &.hide {
            display: none;
          }
        }
        form {
          @media (min-width: 560px) {
            display: none;
          }
        }
        input {
          background-color: transparent;
          border: none;

          }
          </style>
  `;

  role;
  roomId;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  set socket(value) {
    this._socket = value;
    this._socket.on("complete-connection", () => {});
  }

  connectedCallback() {
    this.render();

    this.shadow.querySelector(".create-room").addEventListener("click", () => {
      fetch("/create-room", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        response.json().then((data) => {
          this.roomId = data.roomId;
          this.showRoomId();
          this.role = "host";
          navigationService.redirectToUrl(this.role, this.roomId);
        });
      });
    });

    this.shadow.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      fetch("/join-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: this.shadow.querySelector(".join-room").value,
        }),
      }).then((response) => {
        response.json().then((data) => {
          this.roomId = data.roomId;
          this.role = "guest";
          navigationService.redirectToUrl(this.role, this.roomId);
        });
      });
    });
  }

  showRoomId = () => {
    const roomIdElement = document.createElement("span");
    roomIdElement.classList.add("room-id");
    roomIdElement.innerText = `Id de sala: ${this.roomId}`;
    this.shadow.querySelector("header").appendChild(roomIdElement);
    this.shadow.querySelector(".create-room").classList.add("hide");
  };

  render() {
    this.shadow.innerHTML = `
            ${this.styles()}
            ${this.template()}
        `;
  }
}
