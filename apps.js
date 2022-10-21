//ES5 convention
//Book constructor

function Book(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

//UI constructor

function Ui(){
//Add book to list
    Ui.prototype.addBookToList = function(book){
         const list = document.getElementById('book-list');
         const row = document.createElement('tr');
         row.innerHTML=`
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href='#' class= 'delete'>X</a></td>
        `;
         list.appendChild(row);
    }

    //show alert
    Ui.prototype.showAlert = function(message, className){
        const div = document.createElement('div');

        div.className = `alert ${className}`;

        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');

        const form = document.querySelector('#book-form')

        container.insertBefore(div, form);

        //set timer
        setTimeout((function(){
            document.querySelector('.alert').remove();
        }), 3000);
    }

    //clear fields
    Ui.prototype.clearFields = function(){
        document.getElementById('title').value='';
        document.getElementById('author').value='';
        document.getElementById('isbn').value='';
    }

    Ui.prototype.deleteBook = function(target){
        if(target.className === "delete"){
            target.parentElement.parentElement.remove();
        }
    }
}
const store = new Store();

function Store(){
    Store.prototype.getBooks = function() {
        let books;
        if(localStorage.getItem("books")=== null){
            books=[];
        }
        else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    Store.prototype.displayBooks = function() {
        const books =store.getBooks();

        books.forEach(function (book) {
            const ui = new Ui;

            ui.addBookToList(book);
        });
    }

    Store.prototype.addBook = function(book) {
        const books = store.getBooks()

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    Store.prototype.removeBook = function(isbn) {
        const books =store.getBooks();

        books.forEach(function (book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}
//DOM load Event
document.addEventListener('DOMContentLoaded', store.displayBooks);

//Event listeners for add book
document.getElementById('book-form').addEventListener('submit', loadBook);
//Get form values
function loadBook(e){
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //instantiate book
    const book = new Book(title, author, isbn);

    //instantiate UI
    const ui = new Ui();

    //validate
    if (title==='' || author==='' || isbn ===''){
        //Error alert
        ui.showAlert('please fill out the form', 'error');


    }
    else{
        //add book to list
        ui.addBookToList(book);

        ui.clearFields();

        //add to local storage
        store.addBook(book);

        ui.showAlert('Book Added', 'success');
    }

    e.preventDefault();
}

// Event listeners for delete books
document.getElementById('book-list').addEventListener('click', deleteThis);

function deleteThis(e) {
    const ui = new  Ui();

    ui.deleteBook(e.target);

    ui.showAlert('Book Removed', 'success');

    //Remove from localStorage
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    e.preventDefault();
}