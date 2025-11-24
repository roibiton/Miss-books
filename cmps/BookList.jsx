import { BookPreview } from "./BookPreview.jsx";

export function BookList({ books, onRemoveBook, onSelectBookId }) {

    function handleRemove(ev, bookId) {
        ev.stopPropagation()
        onRemoveBook(bookId)
    }

    return (
        <ul className="book-list container">
            {books.map(book => (
                <li key={book.id} onClick={() => onSelectBookId(book.id)}>
                    <BookPreview book={book} />
                    <button className="btn-remove" onClick={(ev) => handleRemove(ev, book.id)}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </li>
            ))}
        </ul>
    )

}
