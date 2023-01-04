class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  set inputEvent(event) {
    this._clickEvent = event;
    this.render();
  }

  get value() {
    return this.shadowDOM.querySelector('#find').value;
  }

  render() {
    this.shadowDOM.innerHTML = `
      <style>
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      </style>
      <div class="flex-fill d-flex w-75 input-group">
        <input type="text" id="find" class="form-control" placeholder="Find a book">
      </div>
    `;

    this.shadowDOM.querySelector('#find').addEventListener('input', this._clickEvent);
  }
}

customElements.define('search-bar', SearchBar);
