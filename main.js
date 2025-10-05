const dialog = document.querySelector('dialog');
const form = document.querySelector('.form');
const addBookBtn = document.getElementById('add-book');
const closeDialog = document.querySelector('.close-dialog');

const title = document.getElementById('title');
const titleError = document.querySelector('#title + span.error');

const author = document.getElementById('author');
const authorError = document.querySelector('#author + span.error');

title.addEventListener('input', () => {
  if (title.validity.valid) {
    titleError.textContent = '';
    titleError.className = 'error';
  } else {
    const messages = createMessages(title);
    showError(title, titleError, messages);
  }
});

author.addEventListener('input', () => {
  if (author.validity.valid) {
    authorError.textContent = '';
    authorError.className = 'error';
  } else {
    const messages = createMessages(author);
    showError(author, authorError, messages);
  }
});

addBookBtn.addEventListener('click', () => {
  dialog.showModal();
});

closeDialog.addEventListener('click', () => {
  dialog.close();
});

let myLibrary = [];

class Book {
  constructor(id, title, author, pages, read, opinion) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.opinion = opinion;
  }

  changeReadStatus() {
    this.read = !this.read;
    return this.read;
  }

  static deleteBook(id) {
    let confirmQuestion = confirm('Are you sure you want to delete this book?');

    if (confirmQuestion) {
      myLibrary = myLibrary.filter(book => book.id !== id);
      renderBooks(myLibrary);
    }
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const id = crypto.randomUUID();

  const bookTitle = document.getElementById('title').value;
  const bookAuthor = document.getElementById('author').value;
  const bookPages = document.getElementById('pages').value;
  const bookRead = JSON.parse(formData.get('read'));
  const bookOpinion = document.getElementById('opinion').value;

  if (!title.validity.valid || !author.validity.valid) {
    showError();
  }

  const book = new Book(
    id,
    bookTitle,
    bookAuthor,
    bookPages,
    bookRead,
    bookOpinion
  );
  myLibrary.push(book);
  renderBooks(myLibrary);
  dialog.close();
  form.reset();
});

function renderBooks(array) {
  const booksContainer = document.getElementById('books-container');
  booksContainer.innerHTML = '';

  array.forEach(book => {
    const { title, author, pages, read, opinion } = book;
    const bookCard = document.createElement('div');
    bookCard.classList.add('book__card');

    const bookTitleEl = document.createElement('h2');
    bookTitleEl.textContent = capitalize(title);

    const bookAuthorEl = document.createElement('p');
    bookAuthorEl.textContent = `Author: ${capitalize(author)}`;

    const bookPagesEl = document.createElement('p');
    bookPagesEl.textContent = `Pages: ${pages}`;

    const bookReadEl = document.createElement('p');
    bookReadEl.textContent = `Read it?: ${read ? 'read' : 'unread'}`;

    const bookOpinionEl = document.createElement('p');
    bookOpinionEl.classList.add('opinion-text');
    bookOpinionEl.textContent = `Opinion: ${opinion}`;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => Book.deleteBook(book.id);

    const readBtn = document.createElement('button');
    readBtn.classList.add('change-btn');
    readBtn.textContent = `${book.read ? 'Unread' : 'Read'}`;
    readBtn.addEventListener('click', () => {
      book.changeReadStatus();
      renderBooks(myLibrary);
    });

    buttonsContainer.appendChild(deleteBtn);
    buttonsContainer.appendChild(readBtn);

    bookCard.appendChild(bookTitleEl);
    bookCard.appendChild(bookAuthorEl);
    bookCard.appendChild(bookPagesEl);
    bookCard.appendChild(bookReadEl);
    bookCard.appendChild(bookOpinionEl);
    bookCard.appendChild(buttonsContainer);
    booksContainer.appendChild(bookCard);
  });
}

function capitalize(words) {
  return words
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function createMessages(fieldName) {
  return {
    missing: `You need to enter a ${fieldName.name}.`,
    tooLong: `${capitalize(fieldName.name)} must be a maximum of ${
      fieldName.maxLength
    } characters; you entered ${fieldName.value.length}`,
    tooShort: `${capitalize(fieldName.name)} should be at least ${
      fieldName.minLength
    } characters; you entered ${fieldName.value.length}.`,
  };
}

function showError(input, span, messages) {
  if (input.validity.valueMissing) {
    span.textContent = messages.missing;
  } else if (input.validity.tooLong) {
    span.textContent = messages.tooLong;
  } else if (input.validity.tooShort) {
    span.textContent = messages.tooShort;
  }

  span.className = 'error active';
}
