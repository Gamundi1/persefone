import { eventService } from "../../services/event.service.js";

export class VideoCarrouselComponent extends HTMLElement {
  template = () => `
    <section class='video-carrousel'>
      <select class="quality-select">
        <option value="720p">720p</option>
        <option value="1080p" selected>1080p</option>
        <option value="4k">4K</option>
      </select>
      <div class="video-selector">
        <button class="video-resume selected" id="1">
          <span class="video-resume__live-stream">En directo</span>
          <div class="video-resume__teams">
            <p>Manchester United</p><span>VS</span><p>Inter Milán</p></span>
          </div>
        </button>
        <button class="video-resume" id="2">
          <span class="video-resume__live-stream">En directo</span>
          <div class="video-resume__teams">
            <p>Francia</p><span>VS</span><p>Argentina</p></span>
          </div>
        </button>
        <button class="video-resume" id="3">
          <span class="video-resume__deferred">Diferido</span>
          <div class="video-resume__teams">
            <p>Manchester United</p><span>VS</span><p>Inter Milán</p></span>
          </div>
        </button>
      </div>
    </section>
    `;
  style = () => `
    <style>
      .video-carrousel {
        width: 100%;
        height: 100%;
        position: relative;
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

      .video-selector {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 150px;

        .video-resume {
          width: 33%;
          cursor: pointer;
          border-radius: 5px;
          border: none;
          display: flex;
          flex-direction: column;
          background-color: rgba(191, 134, 237, 0.54);
          transition: all 0.3s ease-in-out;

          &:hover:not(.selected) {
            background-color: rgba(191, 134, 237, 0.87);
          }

          .video-resume__live-stream {
            width: fit-content;
            margin: 10px 0 0 15px;
            color: white;
            position: relative;
            font-size: 14px;
            font-family: "Calibri", sans-serif;
            padding: 5px 10px 5px 20px;
            background-color: red;
            border-radius: 20px;
            font-weight: 600;

            &::before {
              content: "";
              position: absolute;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: white;
              left: 5px;
              top: 9px;
            }
          }

          .video-resume__deferred {
            width: fit-content;
            margin: 10px 0 0 15px;
            color: white;
            position: relative;
            font-size: 14px;
            font-family: "Calibri", sans-serif;
            padding: 5px 10px 5px 10px;
            background-color: rgb(80, 77, 82);
            border-radius: 20px;
            font-weight: 600;
          }


          .video-resume__teams {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            
              span, p {
              margin: 0;
                color: white;
                font-size: 20px;
                font-family: "Calibri", sans-serif;
                font-weight: 600;
              }

              span {
                color: rgba(255, 191, 0, 0.87);
              }
            }

          &.selected {
            border: 3px solid white;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            }
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
        src: "../assets/partidoFutbol2_out",
        team1Url: "../assets/manchesterUnited.png",
        team2Url: "../assets/interMilan.svg",
        media: "manchester_inter",
      },
      {
        id: 2,
        src: "../assets/partidoFutbol2_out",
        team1Url: "../assets/francia.avif",
        team2Url: "../assets/argentina.jpg",
        media: "francia_argentina",
      },
    ];

    this.render();
    this.nVideos = this.videos.length;
  }

  createVideo(video) {
    const videoComponent = document.createElement("video-component");
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

    this.shadow.querySelectorAll(".video-resume").forEach((button) => {
      button.addEventListener("click", (e) => {
        this.updateVideo(parseInt(button.id));
      });
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
          .prepend(this.createVideo(this.videos[0]));
      });
  }

  updateVideo(id) {
    document.querySelector("html").classList.add("block-scroll");
    const buttons = this.shadow.querySelectorAll(".video-resume")
    buttons.forEach((button) => {
      button.classList.remove("selected");
    });
    buttons[id - 1].classList.add("selected");
    const newVideo = this.videos.find((video) => video.id === id);
    this.shadow.querySelector("video-component").remove();
    this.shadow
      .querySelector(".video-carrousel")
      .prepend(this.createVideo(newVideo));
    eventService.changeVideo(newVideo);
  }
}
