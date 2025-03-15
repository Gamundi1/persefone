import { BestMomentsComponent } from "./components/best-moments.component.js";
import { CornerComponent } from "./components/corner.component.js";
import { FooterComponent } from "./components/footer.component.js";
import { GoalsComponent } from "./components/goals.component.js";
import { HeaderComponent } from "./components/header.component.js";
import { PollComponent } from "./components/poll.component.js";
import { StatsComponent } from "./components/stats.component.js";
import { VideoCarrouselComponent } from "./components/video-carrousel.component.js";
import { VideoComponent } from "./components/video.component.js";

const { Subject } = rxjs;

const subject = new Subject();

customElements.define("best-moments-component", BestMomentsComponent);
customElements.define("corner-component", CornerComponent);
customElements.define("footer-component", FooterComponent);
customElements.define("goals-component", GoalsComponent);
customElements.define("header-component", HeaderComponent);
customElements.define("poll-component", PollComponent);
customElements.define("stats-component", StatsComponent);
customElements.define("video-carrousel-component", VideoCarrouselComponent);
customElements.define("video-component", VideoComponent);

const videoCarrouselComponent = document.querySelector(
  "video-carrousel-component"
);
videoCarrouselComponent.subject = subject;

const goalsComponent = document.querySelector("goals-component");
goalsComponent.subject = subject;

const statsComponent = document.querySelector("stats-component");
statsComponent.subject = subject;

const cornerComponent = document.querySelector("corner-component");
cornerComponent.subject = subject;

const pollComponent = document.querySelector("poll-component");

videoCarrouselComponent.addEventListener("videoChange", (event) => {
  goalsComponent.teamImages = [event.detail.team1Url, event.detail.team2Url];
  statsComponent.teamImages = [event.detail.team1Url, event.detail.team2Url];
  pollComponent.teamImages = [event.detail.team1Url, event.detail.team2Url];
});
