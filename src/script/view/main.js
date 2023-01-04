import '../component/search-bar';
import Swal from 'sweetalert2';

const baseurl = 'http://localhost:5000';

const main = () => {
  const getBook = (regex = '') => {
    const filter = new RegExp(regex, 'i');
    fetch(`${baseurl}/books`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) {
          Swal.fire({
            icon: 'error',
            text: responseJson.message,
          });
        } else {
          renderAllBooks(responseJson.data.books, filter);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          text: error,
        });
      });
  };

  const insertBook = (book) => {
    fetch(`${baseurl}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    }).then((response) => response.json())
      .then((responseJson) => {
        Swal.fire(responseJson.message);
        getBook();
      });
  };

  const updateBook = (book) => {
    fetch(`${baseurl}/books/${book.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    }).then((response) => response.json())
      .then((responseJson) => {
        Swal.fire(responseJson.message);
        getBook();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          text: error,
        });
      });
  };

  const removeBook = (bookId) => {
    fetch(`${baseurl}/books/${bookId}`, {
      method: 'DELETE',
    }).then((response) => response.json())
      .then((responseJson) => {
        // Swal.fire(responseJson.message);
        getBook();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          text: error,
        });
      });
  };

  const renderAllBooks = (bookArray, filter) => {
    const uncompletedBookList = document.getElementById('uncompleted-list');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completed-list');
    completedBookList.innerHTML = '';

    let completedCount = 0;

    for (const book of bookArray) {
    // bookArray.forEach((book) => {
      if (book.name.search(filter) === -1) continue;

      const title = book.isCompleted ? `<del>${book.name}</del>` : book.name;
      const isCompleted = book.isCompleted ? 'checked' : '';
      const bookElement = `
        <li class="list-group-item d-flex justify-content-between align-item-start" id="${book.id}">
          <input type="checkbox" class="form-check-input me-1 mt-3" ${isCompleted}>
          <div class="ms-2 me-auto">
            <div class="fw-bold">${title}</div>
            <span>${book.author}</span>
            <span> , </span>
            <span>${book.year}</span>
          </div>
          <div class="btn-group mt-1" role="group">
            <button class="btn btn-outline-primary">
              <svg width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"></path>
              </svg>
            </button>
            <button class="btn btn-outline-primary">
              <svg width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                <path d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"></path>
              </svg>
            </button>
          </div>
        </li>
      `;

      if (!book.isCompleted) {
        uncompletedBookList.innerHTML += bookElement;
      } else {
        completedBookList.innerHTML += bookElement;
        completedCount++;
      }
    }

    if (completedCount === 0) {
      document.getElementById('completed-container').classList.add('hide');
    } else {
      document.getElementById('completed-container').classList.remove('hide');
    }

    const li = document.querySelectorAll('li');

    li.forEach((list) => {
      const checkBox = list.childNodes[1];
      checkBox.addEventListener('change', () => {
        const index = bookArray.findIndex((book) => book.id === list.id);
        bookArray[index].isCompleted = checkBox.checked;
        updateBook(bookArray[index]);
      });

      const editButton = list.childNodes[5].childNodes[1];
      editButton.addEventListener('click', () => {
        const book = bookArray[bookArray.findIndex((item) => item.id === list.id)];
        document.getElementById('editTitle').value = book.name;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editYear').value = book.year;
        document.getElementById('editIsCompleted').checked = book.isCompleted;
        document.getElementById('editingId').value = book.id;

        document.getElementById('add-form').classList.add('hide');
        document.getElementById('edit-form').classList.remove('hide');
      });

      const deleteButton = list.childNodes[5].childNodes[3];
      deleteButton.addEventListener(('click'), () => {
        const index = bookArray.findIndex((book) => book.id === list.id);
        removeBook(bookArray[index].id);
        refresh();
      });
    });
  };

  const refresh = () => {
    document.getElementById('editingId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('isCompleted').checked = false;

    document.getElementById('editTitle').value = '';
    document.getElementById('editAuthor').value = '';
    document.getElementById('editYear').value = '';
    document.getElementById('editIsCompleted').checked = false;

    document.getElementById('edit-form').classList.add('hide');
    document.getElementById('add-form').classList.remove('hide');
  };

  document.addEventListener('DOMContentLoaded', () => {
    getBook();

    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', () => {
      const name = document.getElementById('title').value;
      const author = document.getElementById('author').value;
      const year = document.getElementById('year').value;
      const isCompleted = document.getElementById('isCompleted').checked;

      insertBook({
        name, author, year, isCompleted,
      });
      refresh();
    });

    const editSubmitButton = document.getElementById('editSubmit');
    editSubmitButton.addEventListener('click', () => {
      const id = document.getElementById('editingId').value;
      const name = document.getElementById('editTitle').value;
      const author = document.getElementById('editAuthor').value;
      const year = document.getElementById('editYear').value;
      const isCompleted = document.getElementById('editIsCompleted').checked;

      updateBook({
        id, name, author, year, isCompleted,
      });
      refresh();
    });

    const cancelButton = document.getElementById('cancel');
    cancelButton.addEventListener('click', () => {
      document.getElementById('add-form').classList.remove('hide');
      document.getElementById('edit-form').classList.add('hide');

      refresh();
    });

    const findElement = document.querySelector('search-bar');
    findElement.inputEvent = async () => {
      try {
        const filter = await findElement.value;
        getBook(filter);
      } catch (error) {
        Swal({
          icon: 'error',
          text: error,
        });
      }
    };
  });
};

export default main;
