import { getReadingLevel, getBookAge, getPriceClass, getCurrencySymbol } from "../services/util.service.js"

export function BookPreview({ book }) {
    const price = book.listPrice ? book.listPrice.amount : 0
    const currencyCode = book.listPrice ? book.listPrice.currencyCode : 'USD'
    const currencySymbol = getCurrencySymbol(currencyCode)
    const isOnSale = book.listPrice ? book.listPrice.isOnSale : false
    
    const readingLevel = getReadingLevel(book.pageCount)
    const bookAge = getBookAge(book.publishedDate)
    const priceClass = getPriceClass(price)
    
    return (
        <article className="book-preview">
            {isOnSale && <div className="sale-tag">On Sale!</div>}
            <h2>{book.title}</h2>
            <h3>{book.authors.length ? book.authors.join(', ') : 'Unknown Author'}</h3>
            <h4 className={priceClass}>Price: {currencySymbol}{price}</h4>
            {readingLevel && <p>{readingLevel}</p>}
            {bookAge && <p>{bookAge}</p>}
            <img src={book.thumbnail} alt="Book Image" />
        </article>
    )
}
