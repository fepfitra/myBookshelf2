class AppBar extends HTMLElement {
  constructor(){
    super();
    this.shadowDOM = this.attachShadow(({mode: 'open'}));
  }

  connectedCallback(){
    this.render();
  }

  render(){
    this.shadowDOM.innerHTML = `
      <style>
        @import url 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css';
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      </style>
      <span class="navbar-brand mb-0 h1">myBookshelf</span>
    `;
  }
}

customElements.define("app-bar", AppBar);
