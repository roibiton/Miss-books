import { bookService } from "../services/book.service.js"
import { getReadingLevel, getBookAge, getPriceClass } from "../services/util.service.js"
import { LongTxt } from "../cmps/LongTxt.jsx"
import { Loader } from "../cmps/Loader.jsx"

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

    if (!book) return <Loader />
    const { title, subtitle, authors, publishedDate, description, pageCount, categories, thumbnail, language, listPrice } = book
    
    const readingLevel = getReadingLevel(pageCount)
    const bookAge = getBookAge(publishedDate)
    const priceClass = getPriceClass(listPrice.amount)
    
    return (
        <section className="book-details container">
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <h3>By: {authors.join(', ')}</h3>
            <p>Published: {publishedDate}</p>
            {bookAge && <p className="book-age">{bookAge}</p>}
            <p>Pages: {pageCount}</p>
            {readingLevel && <p className="reading-level">{readingLevel}</p>}
            <p>Categories: {categories.join(', ')}</p>
            <p>Language: {language}</p>
            <p className="description">
                <LongTxt txt={description} length={100} />
            </p>
            <h4 className={priceClass}>Price: {listPrice.amount} {listPrice.currencyCode}</h4>
            {listPrice.isOnSale && <p className="sale">On Sale!</p>}
            <img src={thumbnail} alt="Book Image" />
            <button onClick={onBack}>Back</button>
        </section>
    )
}
