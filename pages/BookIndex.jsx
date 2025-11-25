import { BookFilter } from "../cmps/BookFilter.jsx"
import { BookList } from "../cmps/BookList.jsx"
import { BookAdd } from "../cmps/BookAdd.jsx"
import { bookService } from "../services/book.service.js"
import { Loader } from "../cmps/Loader.jsx"
import { showErrorMsg,showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { Link, useNavigate } = ReactRouterDOM

export function BookIndex() {

    const [books, setBooks] = useState(null)
    const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter())
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        loadBooks()
    }, [filterBy])

    function loadBooks() {
        bookService.query(filterBy)
            .then(setBooks)
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemoveBook(bookId) {
        bookService.remove(bookId)
            .then(() => {
                setBooks(books => (
                    books.filter(book => book.id !== bookId)
                ))
                showSuccessMsg('Book removed')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Problem removing book')
            })
    }

    function onEditBook(bookId) {
        navigate(`/book/edit/${bookId}`)
    }

    function onSetFilter(newFilterBy) {
        setFilterBy(filterBy => ({ ...filterBy, ...newFilterBy }))
    }

    function onClearFilter() {
        setFilterBy(bookService.getDefaultFilter())
    }

    function onBookAdded(newBook) {
        setBooks(books => [newBook, ...books])
        setIsAddModalOpen(false)
    }

    if (!books) return <Loader />
    return (
        <section className="book-index">
            <BookFilter
                defaultFilter={filterBy}
                onSetFilter={onSetFilter}
                onClearFilter={onClearFilter}
            />
            <div className="book-actions">
                <Link to="/book/edit">
                    <button>Add Book</button>
                </Link>
                <button onClick={() => setIsAddModalOpen(true)}>
                    Add from Google
                </button>
            </div>

            <BookList
                books={books}
                onRemoveBook={onRemoveBook}
                onEditBook={onEditBook}
            />

            {isAddModalOpen && (
                <BookAdd 
                    onClose={() => setIsAddModalOpen(false)}
                    onBookAdded={onBookAdded}
                />
            )}
        </section>
    )
}
