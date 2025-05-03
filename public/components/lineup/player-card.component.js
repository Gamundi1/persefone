export class PlayerCardComponent extends HTMLElement {
  template = () => `
      <button class="player-card">
    º>

</button>
      `;

  style = () => `
      <style>
        .player-card {
          position: relative;
          width: 50px;
          height: 50px;
          cursor: pointer;
          border: none;
          border-radius: 100%;
          background: linear-gradient(150deg, ${this.playerInfo.color}, #000);
          color: white;
          font-size: 18px;
          font-weight: 600;
        }
      </style>

    `;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  playerInfo;

  render() {
    this.playerInfo = JSON.parse(this.getAttribute("playerInfo"));
    this.shadow.innerHTML = `
              ${this.style()}
              ${this.template()}
            `;

    const button = this.shadow.querySelector("button");
    button.innerText = `${this.playerInfo.playerNumber}`;

    button.addEventListener("click", () => {
      this.shadow.querySelector(".player-card").classList.add("selected");
      fetch("/player-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerNumber: this.playerInfo.playerNumber,
          team: this.playerInfo.team,
        }),
      }).then((response) => {
        response.json().then((data) => {
          this.dispatchEvent(
            new CustomEvent("player-data-loaded", {
              detail: data,
              bubbles: true,
              composed: true,
            })
          );
        });
      });
    });
  }
}
