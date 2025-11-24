import { bookService } from "../services/book.service.js"

const { useState, useEffect } = React

export function BookDetails({ bookId, onBack }) {

    const [book, setBook] = useState(null)

    useEffect(() => {
        loadBook()
    }, [])

    function loadBook() {
        bookService.get(bookId)
            .then(book => setBook(book))
            .catch(err => {
                console.log('err:', err)
            })
    }

    if (!book) return <div>Loading...</div>
    const { title, subtitle, authors, publishedDate, description, pageCount, categories, thumbnail, language, listPrice } = book
    return (
        <section className="book-details container">
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <h3>By: {authors.join(', ')}</h3>
            <p>Published: {publishedDate}</p>
            <p>Pages: {pageCount}</p>
            <p>Categories: {categories.join(', ')}</p>
            <p>Language: {language}</p>
            <p className="description">{description}</p>
            <h4>Price: {listPrice.amount} {listPrice.currencyCode}</h4>
            {listPrice.isOnSale && <p className="sale">On Sale!</p>}
            <img src={thumbnail} alt="Book Image" />
            <button onClick={onBack}>Back</button>
        </section>
    )
}
