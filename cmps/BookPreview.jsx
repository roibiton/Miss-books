export function BookPreview({ book }) {
    const price = book.listPrice ? book.listPrice.amount : 0
    const currency = book.listPrice ? book.listPrice.currencyCode : 'USD'
    
    return (
        <article className="book-preview">
            <h2>{book.title}</h2>
            <h4>Price: {price} {currency}</h4>
            <img src={book.thumbnail} alt="Book Image" />
        </article>
    )
}
