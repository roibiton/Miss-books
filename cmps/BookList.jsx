const { Link } = ReactRouterDOM

import { BookPreview } from "./BookPreview.jsx";

export function BookList({ books, onRemoveBook, onEditBook }) {

    function handleRemove(ev, bookId) {
        ev.preventDefault()
        ev.stopPropagation()
        onRemoveBook(bookId)
    }

    function handleEdit(ev, bookId) {
        ev.preventDefault()
        ev.stopPropagation()
        onEditBook(bookId)
    }

    return (
        <ul className="book-list container">
            {books.map(book => (
                <li key={book.id}>
                    <Link to={`/book/${book.id}`}>
                        <BookPreview book={book} />
                    </Link>
                    <button className="btn-remove" onClick={(ev) => handleRemove(ev, book.id)}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                    <button className="btn-edit" onClick={(ev) => handleEdit(ev, book.id)}>
                        <i className="fa-solid fa-pen"></i>
                    </button>
                </li>
            ))}
        </ul>
    )

}
