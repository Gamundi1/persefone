import { eventService } from "../../services/event.service.js";

export class VideoComponent extends HTMLElement {
  template = () => `
  <div class="video-container">
    <video autoplay controls>
        <track src="../media/${this.mediaSrc}-data.vtt" kind="metadata"></track>
        <track src="../media/${this.mediaSrc}-subtitle.vtt" kind="captions" srcLang='es' default label='Español'></track>
    </video>
  </div>
`;

  style = () => `
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
`;

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

  get deferred() {
    return this.getAttribute("deferred");
  }

  set deferred(value) {
    this.setAttribute("deferred", value);
  }

  get mediaSrc() {
    return this.getAttribute("mediaSrc");
  }

  set quality(value) {
    this.setAttribute("quality", value);
  }

  get quality() {
    return this.getAttribute("quality");
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

  async render() {
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}
          `;
    const video = this.shadow.querySelector("video");

    if (this.deferred === "false") {
      this.seekVideoPosition(video);
    }

    this.createVideoElement(video);

    const trackElement = this.shadow.querySelector("video track").track;

    if (trackElement) {
      trackElement.mode = "hidden";
      trackElement.addEventListener("cuechange", () => {
        const cue = trackElement.activeCues[0]?.text;
        if (cue) {
          eventService.send(JSON.parse(cue));
        }
      });

      video.addEventListener("canplaythrough", () => {
        const activeCues = Array.from(trackElement.cues).filter((cue) => {
          return cue.startTime <= video.currentTime;
        });

        if (activeCues.length > 0) {
          activeCues.forEach((cue) => {
            eventService.send(JSON.parse(cue.text));
          });
        }

        document.querySelector("html").classList.remove("block-scroll");
      });
    }
  }

  createVideoElement(video) {
    let player;
    if (this.deferred === "true") {
      player = new Hls();
      player.on(Hls.Events.MANIFEST_PARSED, function () {});
      player.loadSource(`${this.videoSrc}`);
      player.attachMedia(video);
    } else if (Hls.isSupported()) {
      player = new Hls();
      player.on(Hls.Events.MANIFEST_PARSED, () => {
        player.currentLevel = parseInt(this.quality, 10);
      });
      player.loadSource(`${this.videoSrc}/manifest.m3u8`);
      player.attachMedia(video);
    } else {
      player = dashjs.MediaPlayer().create();
      if (this.quality !== "-1") {
        dashPlayer.updateSettings({
          streaming: { abr: { autoSwitchBitrate: { video: false } } },
        });
        dashPlayer.setQualityFor("video", parseInt(this.quality, 10));
      }
      player.initialize(video, `${this.videoSrc}/manifest.mpd`, true);
    }
  }

  async seekVideoPosition(video) {
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
    video.currentTime = time;
  }
}
