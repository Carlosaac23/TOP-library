const dialog = document.querySelector('dialog');
const form = document.querySelector('.form');
const addBookBtn = document.getElementById('add-book');
const closeDialog = document.querySelector('.close-dialog');

const title = document.getElementById('title');
const titleError = document.querySelector('#title + span.error');

const author = document.getElementById('author');
const authorError = document.querySelector('#author + span.error');

const pages = document.getElementById('pages');
const pagesError = document.querySelector('#pages + span.error');

pages.addEventListener('blur', () => {
  if (pages.validity.valid) {
    pagesError.textContent = '';
    pagesError.className = 'error';
  } else {
    const messages = createPagesMessages(pages);
    showErrorPages(pages, pagesError, messages);
  }
});

handleListener('blur', title, titleError);
handleListener('input', title, titleError);
handleListener('blur', author, authorError);
handleListener('input', author, authorError);

function handleListener(type, input, errorSpan) {
  input.addEventListener(type, () => {
    if (input.validity.valid) {
      errorSpan.textContent = '';
      errorSpan.className = 'error';
    } else {
      const messages = createMessages(input);
      showError(input, errorSpan, messages);
    }
  });
}

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

  let hasErrors = false;

  if (!title.validity.valid) {
    const messages = createMessages(title);
    showError(title, titleError, messages);
    hasErrors = true;
  }

  if (!author.validity.valid) {
    const messages = createMessages(author);
    showError(author, authorError, messages);
    hasErrors = true;
  }

  if (!pages.validity.valid) {
    const messages = createPagesMessages();
    showErrorPages(pages, pagesError, messages);
    hasErrors = true;
  }

  if (hasErrors) return;

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

function createPagesMessages() {
  return {
    missing: 'You need to enter a number of pages.',
    rangeUnderFlow: 'You need to enter at least 10 pages',
  };
}

function showError(input, errorSpan, messages) {
  if (input.validity.valueMissing) {
    errorSpan.textContent = messages.missing;
  } else if (input.validity.tooLong) {
    errorSpan.textContent = messages.tooLong;
  } else if (input.validity.tooShort) {
    errorSpan.textContent = messages.tooShort;
  }

  errorSpan.className = 'error active';
}

function showErrorPages(input, errorSpan, messages) {
  if (input.validity.valueMissing) {
    errorSpan.textContent = messages.missing;
  } else if (input.validity.rangeUnderflow) {
    errorSpan.textContent = messages.rangeUnderFlow;
  }

  errorSpan.className = 'error active';
}
