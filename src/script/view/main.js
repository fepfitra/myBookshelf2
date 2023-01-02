import '../component/search-bar.js';

const books = [];
let editingId = null;
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

const main = () => {
  const isStorageExist = () => {
    if (typeof(Storage) === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null){
      for(const book of data){
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  const refresh = () => {
    editingId = null;
    document.getElementById('title').value = '';
    document.getElementById('author').value ='';
    document.getElementById('year').value = '';
    document.getElementById('isCompleted').checked = false;
    
    document.getElementById('editTitle').value = '';
    document.getElementById('editAuthor').value = '';
    document.getElementById('editYear').value = '';
    document.getElementById('editIsCompleted').checked = false;
  }

  const makeBook = (bookObject) => {
    const isCompleted = document.createElement('input');
    isCompleted.checked = bookObject.isCompleted;
    isCompleted.type = 'checkbox';
    isCompleted.classList.add('form-check-input', 'me-1', 'mt-3');
    isCompleted.addEventListener('change', () => {

      const bookTarget = findBook(bookObject.id);
      if(bookTarget == null) return;
      bookTarget.isCompleted = isCompleted.checked;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    });


    const tadyContainer = document.createElement('div');
    tadyContainer.classList.add('ms-2', 'me-auto');

    const title = document.createElement('div');
    title.classList.add('fw-bold');
    title.innerHTML = isCompleted.checked ? `<del>${bookObject.title}</del>`:bookObject.title;

    const author = document.createElement('span');
    author.innerText = bookObject.author;

    const div = document.createElement('span');
    div.innerText = ' , ';

    const year = document.createElement('span');
    year.innerText = bookObject.year;

    tadyContainer.append(title, author, div, year);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('btn-group', 'mt-1');
    buttonsContainer.setAttribute('role', 'group');

    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-outline-primary');
    editButton.addEventListener('click', () => {
      editBook(bookObject.id);
    })

    let editButtonIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
    editButtonIcon.setAttribute('width', '16');
    editButtonIcon.setAttribute('height', '16');
    editButtonIcon.setAttribute('fill', 'currentColor');
    editButtonIcon.classList.add('bi', 'bi-pen-fill');
    editButtonIcon.setAttribute('viewBox', '0 0 16 16');
    editButtonIcon.innerHTML = document.getElementById('editIcon').innerHTML;

    editButton.append(editButtonIcon);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-outline-primary');
    deleteButton.addEventListener('click', () => {
      deleteBook(bookObject.id);
    });

    let deleteButtonIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
    deleteButtonIcon.setAttribute('width', '16');
    deleteButtonIcon.setAttribute('height', '16');
    deleteButtonIcon.setAttribute('fill', 'currentColor');
    deleteButtonIcon.classList.add('bi', 'bi-pen-fill');
    deleteButtonIcon.setAttribute('viewBox', '0 0 16 16');
    deleteButtonIcon.innerHTML = document.getElementById('deleteIcon').innerHTML;

    deleteButton.append(deleteButtonIcon);

    buttonsContainer.append(editButton, deleteButton);

    const liContainer = document.createElement('li');
    liContainer.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-start');
    liContainer.setAttribute('id', `book-${bookObject.id}`);
    liContainer.append(isCompleted, tadyContainer, buttonsContainer);

    return liContainer;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', (event) => {
      addBook();
      refresh();
      event.preventDefault();
    });

    const editSubmitButton = document.getElementById('editSubmit');
    editSubmitButton.addEventListener('click', (event) => {
      editSubmit(editingId);
      refresh();
      event.preventDefault();
    });

    const cancelButton = document.getElementById('cancel');
    cancelButton.addEventListener('click', () => {
      editCancel();
      refresh();
    });

    const findElement = document.querySelector('search-bar');
    findElement.inputEvent = async () => {
      try {
        const value = await findElement.value;
        renderAction(value);
      } catch (error) {
        alert(error);
      }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    if(isStorageExist()){
      loadDataFromStorage();
    }
  });

  document.addEventListener(RENDER_EVENT, () => {
    renderAction('');
  });

  const renderAction = (value) => {
    const regex = new RegExp(value,"i");

    const uncompletedBookList = document.getElementById('uncompleted-list');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completed-list');
    completedBookList.innerHTML='';

    let completedCount = 0;

    for(const bookItem of books){
      const bookElement = makeBook(bookItem);

      if(bookItem.title.search(regex) === -1) continue;
      if(!bookItem.isCompleted){
        uncompletedBookList.append(bookElement);
      }else{
        completedBookList.append(bookElement);
        completedCount++;
      }
        
    }
    if(completedCount === 0){
      document.getElementById('completed-container').classList.add('hide');
    }else{
      document.getElementById('completed-container').classList.remove('hide');
    }
  }

  const generateId = () => {
    return +new Date();
  }

  const generateBookObject = (id, title, author, year, isCompleted) => {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
  }

  const saveData = () => {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const addBook = () => {
    const generateID = generateId();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isCompleted = document.getElementById('isCompleted').checked;

    const bookObject = generateBookObject(generateID, title, author, year, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  const findBookIndex = (bookId) => {
    for(const index in books){
      if(books[index].id === bookId){
        return index;
      }
    }

    return -1;
  }

  const deleteBook = (bookId) => {
    const bookTarget = findBookIndex(bookId);

    if(bookTarget == -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  const findBook = (bookId) => {
    for(const bookItem of books){
      if(bookItem.id == bookId){
        return bookItem;
      }
    }

    return null;
  }

  const editBook = (bookId) => {
    const bookTarget = findBook(bookId); 
    if(bookTarget == null) return;

    editingId = bookTarget.id;
    
    document.getElementById('editTitle').value = bookTarget.title;
    document.getElementById('editAuthor').value = bookTarget.author;
    document.getElementById('editYear').value = bookTarget.year;
    document.getElementById('editIsCompleted').checked = bookTarget.isCompleted;

    document.getElementById('add-form').classList.add('hide');
    document.getElementById('edit-form').classList.remove('hide');
      
  }

  const editSubmit = (bookId) => {
    const bookTarget = findBook(bookId); 
    if(bookTarget == null) return;

    bookTarget.title = document.getElementById('editTitle').value;
    bookTarget.author = document.getElementById('editAuthor').value;
    bookTarget.year = document.getElementById('editYear').value;
    bookTarget.isCompleted = document.getElementById('editIsCompleted').checked;
    
    document.getElementById('add-form').classList.remove('hide');
    document.getElementById('edit-form').classList.add('hide');
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  const editCancel = () => {
    document.getElementById('add-form').classList.remove('hide');
    document.getElementById('edit-form').classList.add('hide');
  }
}

export default main;
