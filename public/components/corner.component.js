export class CornerComponent extends HTMLElement {
  template = () => `
    <section>
      <h1>Corner</h1>
    </section>
  `;

  style = () => `
    <style>
      section {
        display: flex;
        justify-content: center;

        h1 {
          color: white;
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

  set subject(value) {
    this._subject = value;
    this._subject.subscribe((data) => {
      console.log(data);
    });
  }


  render() {
    this.shadow.innerHTML = `
        ${this.style()}
        ${this.template()}    
        `;
  }
}
