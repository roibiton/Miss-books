import { getReadingLevel, getBookAge, getPriceClass } from "../services/util.service.js"

export function BookPreview({ book }) {
    const price = book.listPrice ? book.listPrice.amount : 0
    const currency = book.listPrice ? book.listPrice.currencyCode : 'USD'
    
    const readingLevel = getReadingLevel(book.pageCount)
    const bookAge = getBookAge(book.publishedDate)
    const priceClass = getPriceClass(price)
    
    return (
        <article className="book-preview">
            <h2>{book.title}</h2>
            <h4 className={priceClass}>Price: {price} {currency}</h4>
            {readingLevel && <p>{readingLevel}</p>}
            {bookAge && <p>{bookAge}</p>}
            <img src={book.thumbnail} alt="Book Image" />
        </article>
    )
}
