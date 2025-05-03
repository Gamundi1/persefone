import { navigationService } from "../../services/navigation.service.js";
import { eventService } from "../../services/event.service.js";
import { i18nService } from "../../services/i18n.service.js";

export class HeaderComponent extends HTMLElement {
  template = () => `
    <header>
      <div class="logo-container">
        <img src="../assets/throphy.svg"/>
        <span>Football Viewer</span>
      </div>
      <button class="create-room">${i18nService.translate("header.CREATE_ROOM")}</button>
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
        margin: 0 auto;
        display: flex;
        padding: 0 10px;
        align-items: center;
        justify-content: space-between;

        @media (min-width: 560px) {
          max-width: 80%;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: bold;
          color: white;
          
          @media (min-width: 560px) { 
            font-size: 25px;
          }

          span {
            background: linear-gradient(90deg, #facc15, #f97316);
            background-clip: text;
            color: transparent;
          }
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
        .room-id {
          font-size: 18px;
          font-weight: bold;
          color: white;
          margin-left: 10px;
        }
          </style>
  `;

  role;
  roomId;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this._socket = eventService.getSocket();
    this._socket.on("complete-connection", () => {
      navigationService.redirectToUrl(this.role, this.roomId);
    })
  }

  connectedCallback() {
    this.render();

    this.shadow.querySelector(".create-room").addEventListener("click", () => {
      this._socket.emit("create-room", { roomId: this.generateRandomRoomId() });
      this.showRoomId();
      this.role = "host";
    });

    this.shadow.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.roomId = this.shadow.querySelector(".join-room").value;
      this._socket.emit("join-room", {
        roomId: this.roomId,
      });
      this.role = "guest";
    });
  }

  showRoomId = () => {
    const roomIdElement = document.createElement("span");
    roomIdElement.classList.add("room-id");
    roomIdElement.innerText = `${i18nService.translate("header.ROOM_ID")}: ${this.roomId}`;
    this.shadow.querySelector("header").appendChild(roomIdElement);
    this.shadow.querySelector(".create-room").classList.add("hide");
  };

  render() {
    this.shadow.innerHTML = `
            ${this.styles()}
            ${this.template()}
        `;
  }

  generateRandomRoomId = () => {
    this.roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return this.roomId;
  };
}
