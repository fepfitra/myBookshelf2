class AppBar extends HTMLElement {
  connectedCallback(){
    this.render();
  }

  render(){
    this.innerHTML = `
      <span class="navbar-brand mb-0 h1">myBookshelf</span>
    `;
  }
}

customElements.define("app-bar", AppBar);
