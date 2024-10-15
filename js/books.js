let isUpdateMode = false;
let bookToUpdate = null;

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const bookList = document.getElementById('bookList');
            bookList.innerHTML = '';
            data.forEach(book => {
                const bookRow = document.createElement('tr');
                bookRow.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>$${book.price.toFixed(2)}</td>
                    <td><button class="read">בחר</button></td>
                    <td><button class="delete" id="delete">מחק</button></td>
                    <td><button class="update" id="update">עדכון</button></td>
                `;
                bookRow.querySelector('.delete').addEventListener('click', function () {
                    fetch(`http://localhost:3000/books/${book.id}`, {
                        method: 'DELETE',
                    })
                        .then(() => {
                            bookRow.remove();
                        })
                        .catch(error => console.error('Error:', error));
                });

                bookRow.querySelector('.update').addEventListener('click', function () {
                    isUpdateMode = true;
                    bookToUpdate = book;

                    document.getElementById('id').value = book.id;
                    document.getElementById('title').value = book.title;
                    document.getElementById('price').value = book.price;
                    document.getElementById('image').value = book.image;

                    const addBookForm = document.getElementById('addBookForm');
                    addBookForm.style.display = 'block';
                });

                bookRow.querySelector('.read').addEventListener('click', function () {
                    const range = localStorage.getItem(`rating_${book.id}`) || 5;
                    bookDetails.innerHTML = `
                        <h3>${book.title}</h3>
                        <img src="${book.image}" alt="${book.title}" style="width: 150px; height: auto;">
                        <p>Price: $${book.price.toFixed(2)}</p>
                        <p>Rating: <input type="range" min="1" max="10" value="${range}" data-id="${book.id}" class="newRange"></p>
                    `;

                    const newRange = document.querySelector(`.newRange[data-id="${book.id}"]`);
                    newRange.addEventListener('input', function () {
                        const range = this.value;
                        localStorage.setItem(`rating_${book.id}`, range);
                    });
                });

                bookList.appendChild(bookRow);
            });
        });

    document.getElementById('add').addEventListener('click', function () {
        const addBookForm = document.getElementById('addBookForm');
        addBookForm.style.display = 'block'
    })


    document.getElementById('addBookForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const newBook = {
            id: Number(document.getElementById('id').value),
            title: document.getElementById('title').value,
            price: Number(document.getElementById('price').value),
            image: document.getElementById('image').value
        };
        if (isUpdateMode && bookToUpdate) {
            console.log("update");
            
            fetch(`http://localhost:3000/books/${bookToUpdate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBook)
            })
                .then(response => response.json())
                .then(updatedBook => {
                    const rows = document.querySelectorAll('#bookList tr');
                    rows.forEach(row => {
                        if (Number(row.querySelector('td').textContent) === updatedBook.id) {
                            row.innerHTML = `
                                <td>${updatedBook.id}</td>
                                <td>${updatedBook.title}</td>
                                <td>$${updatedBook.price.toFixed(2)}</td>
                                <td><button class="read">בחר</button></td>
                                <td><button class="deleteBtn">מחק</button></td>
                                <td><button class="updateBtn">עדכון</button></td>
                            `;
                        }
                    });
                    document.getElementById('addBookForm').style.display = 'none';
                });
        }
        else {
            console.log("add");

            fetch('http://localhost:3000/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBook)
            })
                .then(response => response.json())
                .then(book => {
                    const bookList = document.getElementById('bookList');
                    bookList.innerHTML += `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>$${book.price.toFixed(2)}</td>
                <td><button class="read">בחר</button></td>
            </tr>`;
                    document.getElementById('addBookForm').reset();
                    document.getElementById('addBookForm').style = 'none'
                });
        }
    });
});
