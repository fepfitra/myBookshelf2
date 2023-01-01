class SearchBar extends HTMLElement {
  connectedCallback(){
    this.render();
  }

  set inputEvent(event){
    this._clickEvent = event;
    this.render();
  }

  get value(){
    return this.querySelector('#find').value;
  }

  render(){
    this.innerHTML = `
      <style>
        @import url 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css';
      </style>
      <div class="flex-fill d-flex w-75 input-group">
        <input type="text" id="find" class="form-control" placeholder="Find a book">
      </div>
    `;

    this.querySelector('#find').addEventListener('input', this._clickEvent);
  }
}

customElements.define("search-bar", SearchBar);
