import { eventService } from "../../services/event.service.js";

export class VideoCarrouselComponent extends HTMLElement {
  template = () => `
    <section class='video-carrousel'>
      <i class="left fa-solid fa-circle-arrow-left fa-2xl"></i>
      <i class="right fa-solid fa-circle-arrow-right fa-2xl"></i>
      <select class="quality-select">
        <option value="720p">720p</option>
        <option value="1080p" selected>1080p</option>
        <option value="4k">4K</option>
      </select>
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

      .quality-select {
        --select-border-color: #fff;
        background-color: transparent;
        border: none;
        color: white;
        border-bottom: 2px solid var(--select-border-color);
        height: 30px;


        & option {
          background-color: #000;
          }
          
          &:focus {
            outline: none;
            --select-border-color: rgba(119, 0, 255, 0.7);      
        }
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

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.videos = [
      {
        id: 1,
        src: "../assets/partidoFutbol_1080p.mp4",
        team1Url: "../assets/manchesterUnited.png",
        team2Url: "../assets/interMilan.svg",
        media: "manchester_inter",
        shown: true,
      },
      {
        id: 2,
        src: "../assets/partidoFutbol2_1080p.mp4",
        team1Url: "../assets/francia.avif",
        team2Url: "../assets/argentina.jpg",
        media: "francia_argentina",
        shown: false,
      },
    ];

    this.render();
    this.nVideos = this.videos.length;
  }

  createVideo(video) {
    const videoComponent = document.createElement("video-component");
    console.log(video);
    videoComponent.setAttribute("videoSrc", video.src);
    videoComponent.setAttribute("mediaSrc", video.media);
    videoComponent.setAttribute("videoId", video.id);
    return videoComponent;
  }

  render() {
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}
    `;
    this.shadow
      .querySelector(".video-carrousel")
      .prepend(this.createVideo(this.videos[0]));
    this.shadow.querySelector(".left").addEventListener("click", () => {
      this.updateVideo();
    });
    this.shadow.querySelector(".right").addEventListener("click", () => {
      this.updateVideo();
    });
    this.shadow
      .querySelector(".quality-select")
      .addEventListener("change", (e) => {
        this.videos.forEach((video) => {
          video.src = video.src.replace(/720p|1080p|4k/, e.target.value);
        });
        document.querySelector("html").classList.add("block-scroll");
        this.shadow.querySelector("video-component").remove();
        this.shadow
          .querySelector(".video-carrousel")
          .prepend(this.createVideo(this.videos.find((video) => video.shown)));
      });
  }

  updateVideo() {
    document.querySelector("html").classList.add("block-scroll");
    const newVideo = this.videos.find((video) => !video.shown);
    this.videos[newVideo.id % this.nVideos].shown = false;
    this.videos[newVideo.id - 1].shown = true;
    this.shadow.querySelector("video-component").remove();
    this.shadow
      .querySelector(".video-carrousel")
      .prepend(this.createVideo(newVideo));
    eventService.changeVideo(newVideo);
  }
}
