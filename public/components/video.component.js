export class VideoComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  set subject(value) {
    this._subject = value;
  }

  render() {
    this.shadow.innerHTML = `
        <style>
            video {
                width: 100%;
                height: 100%;
                }
        </style>
              <video src="../assets/partidoFutbol.mp4" controls>
                <track src="../media/match-info.vtt" kind="metadata"></track>
              </video>
          `;
    this.video = this.shadow.querySelector("video track");
    const track = this.video.track;
    if (track) {
      track.mode = "hidden";
      track.addEventListener("cuechange", () => {
        const cue = track.activeCues[0];
        if (cue) {
          this._subject.next(JSON.parse(cue.text));
        }
      });
    }
  }
}
