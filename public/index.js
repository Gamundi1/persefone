import { BestMomentsComponent } from "./components/best-moments.component.js";
import { ChangeComponent } from "./components/change.component.js";
import { FooterComponent } from "./components/footer.component.js";
import { GoalsComponent } from "./components/goals.component.js";
import { HeaderComponent } from "./components/header.component.js";
import { PollComponent } from "./components/poll.component.js";
import { StatsComponent } from "./components/stats.component.js";
import { VideoComponent } from "./components/video.component.js";

const subject = new rxjs.Subject();

customElements.define("best-moments-component", BestMomentsComponent);
customElements.define("change-component", ChangeComponent);
customElements.define("footer-component", FooterComponent);
customElements.define("goals-component", GoalsComponent);
customElements.define("header-component", HeaderComponent);
customElements.define("poll-component", PollComponent);
customElements.define("stats-component", StatsComponent);
customElements.define("video-component", VideoComponent);

const videoComponent = document.querySelector("video-component");
videoComponent.subject = subject;

const goalsComponent = document.querySelector("goals-component");
goalsComponent.subject = subject;
