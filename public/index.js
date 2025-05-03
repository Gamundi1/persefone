import { i18nService } from "./services/i18n.service.js";
import { BestMomentsComponent } from "./components/best-moments.component.js";
import { CornerComponent } from "./components/corner.component.js";
import { FooterComponent } from "./components/shared/footer.component.js";
import { GoalsComponent } from "./components/goals.component.js";
import { HeaderComponent } from "./components/shared/header.component.js";
import { PollComponent } from "./components/poll.component.js";
import { StatsComponent } from "./components/stats.component.js";
import { VideoCarrouselComponent } from "./components/video/video-carrousel.component.js";
import { VideoComponent } from "./components/video/video.component.js";
import { LineUpComponent } from "./components/lineup/lineup.component.js";
import { PlayerCardComponent } from "./components/lineup/player-card.component.js";
import { FormationComponent } from "./components/lineup/formation.component.js";
import { PlayerInfoComponent } from "./components/lineup/player-info.component.js";
import { eventService } from "./services/event.service.js";
import { navigationService } from "./services/navigation.service.js";
import { LoaderComponent } from "./components/loader.component.js";

const { Subject } = rxjs;
let socket = io();

await i18nService.getLanguage();

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
customElements.define("loader-component", LoaderComponent);

eventService.setRoomId(roomId);
