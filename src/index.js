import './style.css';

let myLibrary;
let serializedLibrary;
const modal = document.getElementById('modal');
const addBtn = document.getElementById('add-book');
const closebtn = document.getElementById('close-btn');
const submitBtn = document.getElementById('submit-book');
const booksContainer = document.getElementById('books-container');

if (!localStorage.getItem('myLibrary')) {
  myLibrary = [];
} else {
  serializedLibrary = JSON.parse(localStorage.getItem('myLibrary'));
  myLibrary = serializedLibrary;
}

function updateStorage() {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

displayLibrary();
modal.style.display = 'none';
addBtn.addEventListener('click', openModal);
closebtn.addEventListener('click', closeModal);

function openModal() {
  modal.style.display = 'block';
  const inputs = document.getElementsByTagName('input');
  for (let i = 0; i < inputs.length - 1; i++) {
    inputs[i].required = true;
  }
  const name = document.getElementById('name');
  name.addEventListener('input', () => {
    if (name.validity.invalid || name.value == '') {
      name.setCustomValidity('Insert a name!');
    } else {
      name.setCustomValidity('');
    }
  });
  const author = document.getElementById('author');
  author.addEventListener('input', () => {
    if (author.validity.tooShort || author.value == '') {
      author.setCustomValidity('Insert a valid name!');
      author.reportValidity();
    } else {
      author.setCustomValidity('');
    }
  });
  const pages = document.getElementById('pages');
  pages.addEventListener('input', () => {
    if (pages.value == '') {
      pages.setCustomValidity('Insert the number of pages, please!');
      pages.reportValidity();
    } else {
      pages.setCustomValidity('');
    }
  });
  const read = !!document.querySelector('.switch-box').checked;
  submitBtn.addEventListener('click', () => {
    if (name.validity.valid && author.validity.valid && pages.validity.valid) {
      addBookToLibrary(name, author, pages, read);
    }
  });
}

function closeModal() {
  const inputs = document.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].required = false;
  }
}

function Book(name, author, pages, read) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(name, author, pages, read) {
  const newBook = new Book(name.value, author.value, parseInt(pages.value), read);
  myLibrary.push(newBook);
  updateStorage();
  displayLibrary();
}

function displayLibrary() {
  booksContainer.innerHTML = '';
  for (let i = 0; i < myLibrary.length; i++) {
    const card = document.createElement('div');
    booksContainer.appendChild(card);
    card.classList.add('card');
    const nameDiv = document.createElement('div');
    card.appendChild(nameDiv);
    nameDiv.textContent = `Name: ${myLibrary[i].name}`;
    const authorDiv = document.createElement('div');
    card.appendChild(authorDiv);
    authorDiv.textContent = `Author: ${myLibrary[i].author}`;
    const pagesDiv = document.createElement('div');
    card.appendChild(pagesDiv);
    pagesDiv.textContent = `Pages: ${myLibrary[i].pages}`;
    const readDiv = document.createElement('div');
    card.appendChild(readDiv);
    if (myLibrary[i].read) {
      readDiv.textContent = 'Read: Yes';
    } else {
      readDiv.textContent = 'Read: No';
    }
    const delBtn = document.createElement('button');
    card.appendChild(delBtn);
    delBtn.textContent = 'Delete';
    delBtn.classList.add('del-button');
    card.setAttribute('id', `${i}`);
    delBtn.setAttribute('id', `${i}`);
    delBtn.addEventListener('click', deleteCard);
  }
}

function deleteCard(event) {
  const index = parseInt(event.target.id);
  const card = document.getElementById(`${index}`);
  card.remove();
  myLibrary.splice(index, 1);
  updateStorage();
}
