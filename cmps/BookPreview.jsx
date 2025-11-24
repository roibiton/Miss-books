

export function BookPreview({ book }) {
    return (
        <article className="book-preview">
            <h2>{book.title}</h2>
            <h4>Price: {book.listPrice.amount} {book.listPrice.currencyCode}</h4>
            <img src={book.thumbnail} alt="Book Image" />
        </article>
    )
}
