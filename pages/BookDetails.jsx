import { bookService } from "../services/book.service.js"
import { getReadingLevel, getBookAge, getPriceClass, getCurrencySymbol } from "../services/util.service.js"
import { LongTxt } from "../cmps/LongTxt.jsx"
import { Loader } from "../cmps/Loader.jsx"
import { AddReview } from "../cmps/AddReview.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function BookDetails() {

    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { bookId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBook()
    }, [bookId])

    function loadBook() {
        setIsLoading(true)
        bookService.get(bookId)
            .then(book => setBook(book))
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot find book')
            })
            .finally(() => setIsLoading(false))
    }

    function onBack() {
        navigate('/book')
    }

    function onAddReview(review) {
        setIsLoading(true)
        bookService.addReview(bookId, review)
            .then(updatedBook => {
                setBook(updatedBook)
                showSuccessMsg('Review added successfully')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot add review')
            })
            .finally(() => setIsLoading(false))
    }

    function onRemoveReview(reviewId) {
        setIsLoading(true)
        bookService.removeReview(bookId, reviewId)
            .then(updatedBook => {
                setBook(updatedBook)
                showSuccessMsg('Review removed successfully')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove review')
            })
            .finally(() => setIsLoading(false))
    }

    function getStars(rating) {
        return '⭐'.repeat(rating)
    }

    function formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    if (!book) return <Loader />
    const { title, subtitle, authors, publishedDate, description, pageCount, categories, thumbnail, language, listPrice } = book

    const readingLevel = getReadingLevel(pageCount)
    const bookAge = getBookAge(publishedDate)
    const priceClass = getPriceClass(listPrice.amount)
    const currencySymbol = getCurrencySymbol(listPrice.currencyCode)

    const loadingClass = isLoading ? 'loading' : ''

    return (
        <section className={`book-details container ${loadingClass}`}>
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
            <h4 className={priceClass}>Price: {currencySymbol}{listPrice.amount}</h4>
            {listPrice.isOnSale && <p className="sale">On Sale!</p>}
            <img src={thumbnail} alt="Book Image" />
            <button onClick={onBack}>Back</button>
            <section>
                <Link to={`/book/${book.prevBookId}`}><button>Prev</button></Link>
                <Link to={`/book/${book.nextBookId}`}><button>Next</button></Link>
            </section>

            <AddReview bookId={bookId} onAddReview={onAddReview} />

            {book.reviews && book.reviews.length > 0 && (
                <section className="reviews-list">
                    <h3>Reviews ({book.reviews.length})</h3>
                    {book.reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <div className="review-header">
                                <span className="reviewer-name">{review.fullname}</span>
                                <span className="review-rating">{getStars(review.rating)}</span>
                            </div>
                            <div className="review-date">Read on: {formatDate(review.readAt)}</div>
                            <button className="delete-btn" onClick={() => onRemoveReview(review.id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </section>
            )}
        </section>
    )
}
