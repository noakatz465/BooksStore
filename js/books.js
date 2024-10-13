// טען נתונים מקובץ JSON כאשר הדף נטען
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('bookList');
            bookList.innerHTML = '';
            data.forEach(book => {
                const bookRow = document.createElement('tr');
                bookRow.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>$${book.price.toFixed(2)}</td>
                    <td><button class="readBtn">קרא</button></td>
                `;
                bookRow.querySelector('.readBtn').addEventListener('click', function () {
                    bookDetails.innerHTML = `
                    <h3>${book.title}</h3>
                    <img src="${book.image}" alt="${book.title}" style="width: 150px; height: auto;">
                    <p>Price: $${book.price.toFixed(2)}</p>
                    <p>Rating: <input type="number" min="1" max="10" value="5"></p>
                `;
                });

                bookList.appendChild(bookRow);
            });
        });
});
