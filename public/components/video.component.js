export class VideoComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  get videoSrc() {
    return this.getAttribute("videoSrc");
  }

  set videoSrc(value) {
    this.setAttribute("videoSrc", value);
  }

  get mediaSrc() {
    return this.getAttribute("mediaSrc");
  }

  set mediaSrc(value) {
    this.setAttribute("mediaSrc", value);
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
              <video src=${this.videoSrc} controls>
                <track src="../media/${this.mediaSrc}-data.vtt" kind="metadata"></track>
                <track src="../media/${this.mediaSrc}-subtitle.vtt" kind="subtitle"></track>
              </video>
          `;
    this.video = this.shadow.querySelector("video track");
    const track = this.video.track;
    if (track) {
      track.mode = "hidden";
      track.addEventListener("cuechange", () => {
        const cue = track.activeCues[0]?.text;
        console.log(cue);
        if (cue) {
          this._subject.next(JSON.parse(cue));
        }
      });
    }
  }
}
