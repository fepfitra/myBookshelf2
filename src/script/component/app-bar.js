class AppBar extends HTMLElement {
  connectedCallback(){
    this.render();
  }

  render(){
    this.innerHTML = `
      <style>
        @import url 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css';
      </style>
      <span class="navbar-brand mb-0 h1">myBookshelf</span>
    `;
  }
}

customElements.define("app-bar", AppBar);
