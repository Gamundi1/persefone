import { eventService } from "../services/event.service.js";

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

  get videoId() {
    return this.getAttribute("videoId");
  }

  set videoId(value) {
    this.setAttribute("videoId", value);
  }

  set subject(value) {
    this._subject = value;
  }

  async render() {
    this.shadow.innerHTML = `
        <style>

            .video-container {
                position: relative;
            }

            .video-controls {
              display: flex;
              justify-content: flex-end;
              width: 100%;
              position: absolute;
              bottom: 10px;

            }

            video {
                width: 100%;
                height: 100%;
                @media (min-width: 560px) {
                  border-radius: 5px;
                  }
                }
        </style>
            <div class="video-container">
              <video autoplay>
                <source src=${this.videoSrc}></source>
                <track src="../media/${this.mediaSrc}-data.vtt" kind="metadata"></track>
                <track src="../media/${this.mediaSrc}-subtitle.vtt" kind="captions" srcLang='es' default label='Español'></track>
              </video>
              <div class="video-controls">
                <button class="fullscreen"></button>
                <input type="range" class="volume" min="0" max="1" step="0.05" value="1">
              </div>
            </div>
          `;

    let time = await fetch(`/video?videoId=${this.videoId - 1}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        videoId: this.videoId,
      },
    }).then((response) => {
      if (response.status === 421) {
        return 0;
      }
      return response.json().then((data) => data.videoCurrentTime);
    });

    const video = this.shadow.querySelector("video");
    const controls = this.shadow.querySelector(".video-controls");
    controls.querySelector(".fullscreen").addEventListener("click", () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });

    controls.querySelector(".volume").addEventListener("input", (e) => {
      video.volume = e.target.value;
    });

    video.currentTime = time;

    const trackElement = this.shadow.querySelector("video track").track;

    if (trackElement) {
      trackElement.mode = "hidden";
      trackElement.addEventListener("cuechange", () => {
        const cue = trackElement.activeCues[0]?.text;
        if (cue) {
          eventService.send(JSON.parse(cue));
        }
      });

      video.addEventListener("seeked", () => {
        const activeCues = Array.from(trackElement.cues).filter((cue) => {
          return cue.startTime <= video.currentTime;
        });

        if (activeCues.length > 0) {
          activeCues.forEach((cue) => {
            eventService.send(JSON.parse(cue.text));
          });
        }
      });
    }
  }
}
