import { bookService } from "../services/book.service.js"
import { googleBookService } from "../services/google-book.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { debounce } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BookAdd({ onClose, onBookAdded }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [googleBooks, setGoogleBooks] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const searchInputRef = useRef(null)

    useEffect(() => {
        // Focus the search input when modal opens
        if (searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [])

    useEffect(() => {
        if (searchTerm.trim().length >= 1) {
            debouncedSearch(searchTerm)
        } else {
            setGoogleBooks([])
        }
    }, [searchTerm])

    const debouncedSearch = useRef(
        debounce((term) => {
            searchGoogleBooks(term)
        }, 500)
    ).current

    function searchGoogleBooks(term) {
        setIsLoading(true)
        googleBookService.query(term)
            .then(function(books) {
                setGoogleBooks(books)
                setIsLoading(false)
            })
            .catch(function(err) {
                console.error('Error searching Google Books:', err)
                showErrorMsg('Failed to search Google Books')
                setGoogleBooks([])
                setIsLoading(false)
            })
    }

    function onAddBook(googleBook) {
        bookService.addGoogleBook(googleBook)
            .then(function(addedBook) {
                showSuccessMsg('Book "' + addedBook.title + '" added successfully!')
                
                // Remove the book from the search results
                setGoogleBooks(function(prevBooks) {
                    return prevBooks.filter(function(book) {
                        return book.id !== googleBook.id
                    })
                })
                
                // Notify parent component
                if (onBookAdded) {
                    onBookAdded(addedBook)
                }
            })
            .catch(function(err) {
                console.error('Error adding book:', err)
                showErrorMsg(err || 'Failed to add book')
            })
    }

    function handleSearchChange(ev) {
        setSearchTerm(ev.target.value)
    }

    return (
        <div className="book-add-modal-overlay" onClick={onClose}>
            <div className="book-add-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Book from Google Books</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="search-container">
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search for books..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>

                <div className="books-results">
                    {isLoading && <div className="loading-message">Searching...</div>}
                    
                    {!isLoading && searchTerm.trim().length >= 1 && googleBooks.length === 0 && (
                        <div className="no-results">No books found. Try a different search term.</div>
                    )}
                    
                    {!isLoading && googleBooks.length > 0 && (
                        <ul className="google-books-list">
                            {googleBooks.map(function(book) {
                                return (
                                    <li key={book.id} className="google-book-item">
                                        {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail && (
                                            <img 
                                                src={book.volumeInfo.imageLinks.thumbnail} 
                                                alt={book.volumeInfo.title}
                                                className="book-thumbnail"
                                            />
                                        )}
                                        <span className="book-title">{book.volumeInfo.title}</span>
                                        <span className="book-author">{book.volumeInfo.authors ? book.volumeInfo.authors[0] : ''}</span>
                                        <button 
                                            className="add-btn"
                                            onClick={function() { onAddBook(book) }}
                                            title="Add this book"
                                        >
                                            +
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
