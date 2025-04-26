import { BestMomentsComponent } from "./components/best-moments.component.js";
import { CornerComponent } from "./components/corner.component.js";
import { FooterComponent } from "./components/footer.component.js";
import { GoalsComponent } from "./components/goals.component.js";
import { HeaderComponent } from "./components/header.component.js";
import { PollComponent } from "./components/poll.component.js";
import { StatsComponent } from "./components/stats.component.js";
import { VideoCarrouselComponent } from "./components/video-carrousel.component.js";
import { VideoComponent } from "./components/video.component.js";
import { LineUpComponent } from "./components/lineup.component.js";
import { PlayerCardComponent } from "./components/player-card.component.js";
import { FormationComponent } from "./components/formation.component.js";
import { PlayerInfoComponent } from "./components/player-info.component.js";
import { eventService } from "./services/event.service.js";
import { navigationService } from "./services/navigation.service.js";

const { Subject } = rxjs;
let socket = io();

const subject = new Subject();

const roomId = navigationService.getRoomIdFromUrl();

eventService.setSubject(subject);
eventService.setSocket(socket);

customElements.define("best-moments-component", BestMomentsComponent);
customElements.define("corner-component", CornerComponent);
customElements.define("footer-component", FooterComponent);
customElements.define("goals-component", GoalsComponent);
customElements.define("header-component", HeaderComponent);
customElements.define("poll-component", PollComponent);
customElements.define("stats-component", StatsComponent);
customElements.define("video-carrousel-component", VideoCarrouselComponent);
customElements.define("video-component", VideoComponent);
customElements.define("lineup-component", LineUpComponent);
customElements.define("player-card-component", PlayerCardComponent);
customElements.define("formation-component", FormationComponent);
customElements.define("player-info-component", PlayerInfoComponent);

const videoCarrouselComponent = document.querySelector(
  "video-carrousel-component"
);

eventService.setRoomId(roomId);

const headerComponent = document.querySelector("header-component");
headerComponent.socket = socket;

// TODO: Llevar esta lógica al servicio de eventos
const goalsComponent = document.querySelector("goals-component");
const statsComponent = document.querySelector("stats-component");
const pollComponent = document.querySelector("poll-component");
const cornerComponent = document.querySelector("corner-component");

if (videoCarrouselComponent) {
  videoCarrouselComponent.addEventListener("videoChange", (event) => {
    goalsComponent.teamImages = [event.detail.team1Url, event.detail.team2Url];
    statsComponent.teamImages = [event.detail.team1Url, event.detail.team2Url];
    pollComponent.teamImages = [event.detail.team1Url, event.detail.team2Url];
    cornerComponent.resetCorners();
  });
}
