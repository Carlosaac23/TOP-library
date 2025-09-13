const dialog = document.querySelector('dialog');
const form = document.querySelector('.form');
const addBookBtn = document.getElementById('add-book');
const closeDialog = document.querySelector('.close-dialog');

const myLibrary = [];

function Book(id, title, author, pages, read) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

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

    const bookTitle = document.createElement('h2');
    bookTitle.textContent = capitalize(title);

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = `Author: ${capitalize(author)}`;

    const bookPages = document.createElement('p');
    bookPages.textContent = `Pages: ${pages}`;

    const bookRead = document.createElement('p');
    bookRead.style.display = 'inline-block';
    bookRead.textContent = `Read it?: ${read ? 'read' : 'unread'}`;

    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(bookPages);
    bookCard.appendChild(bookRead);
    booksContainer.appendChild(bookCard);
  });
}

function capitalize(words) {
  return words
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
