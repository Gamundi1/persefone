export class VideoCarrouselComponent extends HTMLElement {
  template = () => `
    <section class='video-carrousel'>
      <video-component class='video' videoSrc='../assets/partidoFutbol.mp4' mediaSrc='manchester_inter'></video-component>
      <i class="left fa-solid fa-circle-arrow-left fa-2xl"></i>
      <i class="right fa-solid fa-circle-arrow-right fa-2xl"></i>
    </section>
    `;
  style = () => `
    <style>
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

      .video-carrousel {
        width: 100%;
        height: 100%;
        position: relative;
      }
      i {
      color: transparent;
        position: absolute;
        top: 50%;
        transition: color 0.3s;

        &:hover {
          cursor: pointer;
          color: #666;
          }
        }

      .left {
        left: 10px;
      }

      .right {
        right: 10px;
      }

      video-component:hover {
        ~ i {
          color: #000;
        }
      }
    </style>
  `;

  videos = [];
  nVideos = 0;
  
  set subject(value) {
    this._subject = value;
    this.shadow.querySelector("video-component").subject = this._subject;
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.videos = [
      {
        id: 1,
        src: "../assets/partidoFutbol_720.mp4",
        team1Url: "../assets/manchesterUnited.png",
        team2Url: "../assets/interMilan.svg",
        media: "manchester_inter",
        shown: true,
      },
      {
        id: 2,
        src: "../assets/partidoFutbol2.mp4",
        team1Url: "../assets/francia.avif",
        team2Url: "../assets/argentina.jpg",
        media: "francia_argentina",
        shown: false,
      },
    ];

    this.nVideos = this.videos.length;
  }

  createVideo(video) {
    const videoComponent = document.createElement("video-component");
    videoComponent.setAttribute("videoSrc", video.src);
    videoComponent.setAttribute("mediaSrc", video.media);
    videoComponent.subject = this._subject;
    return videoComponent;
  }

  render() {
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}
    `;
    this.shadow.querySelector(".left").addEventListener("click", () => {this.updateVideo()});
    this.shadow.querySelector(".right").addEventListener("click", () => {this.updateVideo()});
  }

  updateVideo() {
    const newVideo = this.videos.find((video) => !video.shown);
    this.videos[newVideo.id % this.nVideos].shown = false;
    this.videos[newVideo.id - 1].shown = true;
    this.shadow.querySelector("video-component").remove();
    this.shadow
      .querySelector(".video-carrousel")
      .prepend(this.createVideo(newVideo));
    this.shadow.dispatchEvent(
      new CustomEvent("videoChange", {
        detail: newVideo,
        bubbles: true,
        composed: true,
      })
    );
  }
}
