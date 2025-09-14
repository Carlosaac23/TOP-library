const dialog = document.querySelector('dialog');
const form = document.querySelector('.form');
const addBookBtn = document.getElementById('add-book');
const closeDialog = document.querySelector('.close-dialog');

let myLibrary = [];

function Book(id, title, author, pages, read) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.changeReadStatus = function () {
  this.read = !this.read;
  return this.read;
};

addBookBtn.addEventListener('click', () => {
  dialog.showModal();
});

closeDialog.addEventListener('click', () => {
  dialog.close();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  dialog.close();

  const formData = new FormData(form);
  const id = crypto.randomUUID();

  const bookTitle = document.getElementById('title').value;
  const bookAuthor = document.getElementById('author').value;
  const bookPages = document.getElementById('pages').value;
  const bookRead = JSON.parse(formData.get('read'));

  const book = new Book(id, bookTitle, bookAuthor, bookPages, bookRead);
  myLibrary.push(book);
  renderBooks(myLibrary);

  console.log(myLibrary);
  form.reset();
});

function renderBooks(array) {
  const booksContainer = document.getElementById('books-container');
  booksContainer.innerHTML = '';

  array.forEach(book => {
    const { title, author, pages, read } = book;
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

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => deleteBook(book.id);

    const readBtn = document.createElement('button');
    readBtn.classList.add('change-btn');
    readBtn.textContent = 'Change';
    readBtn.addEventListener('click', () => {
      book.changeReadStatus();
      bookReadEl.textContent = `Read it?: ${read ? 'read' : 'unread'}`;
    });

    buttonsContainer.appendChild(deleteBtn);
    buttonsContainer.appendChild(readBtn);

    bookCard.appendChild(bookTitleEl);
    bookCard.appendChild(bookAuthorEl);
    bookCard.appendChild(bookPagesEl);
    bookCard.appendChild(bookReadEl);
    bookCard.appendChild(buttonsContainer);
    booksContainer.appendChild(bookCard);
  });
}

function deleteBook(id) {
  myLibrary = myLibrary.filter(book => book.id !== id);
  renderBooks(myLibrary);
}

function capitalize(words) {
  return words
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
