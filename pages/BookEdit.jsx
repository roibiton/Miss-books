import { bookService } from "../services/book.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { Loader } from "../cmps/Loader.jsx"

const { useState, useEffect } = React

const { Link, useNavigate, useParams } = ReactRouterDOM
export function BookEdit() {


    const [bookToEdit, setBookToEdit] = useState(bookService.getEmptyBook())
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { bookId } = useParams()

    useEffect(() => {
        if (bookId) loadBook()
    }, [])

    function loadBook() {
        setIsLoading(true)
        bookService.get(bookId)
            .then(book => setBookToEdit(book))
            .catch(err => console.log('err:', err))
            .finally(() => setIsLoading(false))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;
            case 'checkbox':
                value = target.checked
                break
        }
        
        if (field === 'amount') {
            setBookToEdit(prevBook => ({ 
                ...prevBook, 
                listPrice: { ...prevBook.listPrice, amount: value }
            }))
            return
        }
        
        setBookToEdit(prevBook => ({ ...prevBook, [field]: value }))
    }

    function onSaveBook(ev) {
        ev.preventDefault()
        const bookToSave = { 
            ...bookToEdit, 
            authors: typeof bookToEdit.authors === 'string' 
                ? bookToEdit.authors.split(',').map(author => author.trim()).filter(author => author)
                : bookToEdit.authors
        }
        bookService.save(bookToSave)
            .then(savedBook => {
                console.log('savedBook:', savedBook)
                navigate('/book')
                showSuccessMsg('Book saved!')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Problem saving book')
            })
    }


    const { title, listPrice, authors } = bookToEdit
    const loadingClass = isLoading ? 'loading' : ''
    
    if (isLoading) return <Loader />

    return (
        <section className={`book-edit ${loadingClass}`}>
            <h1>{bookId ? 'Edit' : 'Add'} Book</h1>
            <form onSubmit={onSaveBook}>
                <label htmlFor="title">Title</label>
                <input onChange={handleChange} value={title} type="text" name="title" id="title" />
                <label htmlFor="authors">Authors (comma separated)</label>
                <input onChange={handleChange} value={Array.isArray(authors) ? authors.join(', ') : authors} type="text" name="authors" id="authors" />
                <label htmlFor="amount">Price: {listPrice.amount} {listPrice.currencyCode}</label>
                <input onChange={handleChange} value={listPrice.amount} type="range" name="amount" id="amount" min="0" max="1000" />
                <section>
                    <button>Save</button>
                    <Link to="/book"><button type="button">Cancel</button></Link>
                </section>
            </form>
        </section>
    )
}