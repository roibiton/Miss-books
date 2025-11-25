import { loadFromStorage, saveToStorage, makeLorem, getRandomIntInclusive } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { books as initialBooks } from './books.data.js'

const BOOK_KEY = 'bookDB'
_initBooks()

export const bookService = {
    query,
    get,
    remove,
    save,
    getEmptyBook,
    getDefaultFilter,
    addReview,
    removeReview,
    addGoogleBook
}

function query(filterBy = {}) {
    return storageService.query(BOOK_KEY)
        .then(books => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                books = books.filter(book => regExp.test(book.title))
            }
            if (filterBy.maxPrice) {
                books = books.filter(book => book.listPrice.amount <= filterBy.maxPrice)
            }
            if (filterBy.authors) {
                const searchTerms = filterBy.authors.split(',').map(term => term.trim()).filter(term => term)
                books = books.filter(book => {
                    if (!book.authors || book.authors.length === 0) return false
                    return searchTerms.some(searchTerm => {
                        const regExp = new RegExp(searchTerm, 'i')
                        return book.authors.some(author => regExp.test(author))
                    })
                })
            }
            return books
        })
}

function get(bookId) {
    return storageService.get(BOOK_KEY, bookId)
    .then(book => _setNextPrevBookId(book))
}

function remove(bookId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(BOOK_KEY, bookId)
}

function save(book) {
    if (book.id) {
        return storageService.put(BOOK_KEY, book)
    } else {
        return storageService.post(BOOK_KEY, book)
    }
}

function getEmptyBook() {
    return { 
        title: '', 
        subtitle: makeLorem(3),
        authors: [],
        publishedDate: new Date().getFullYear(),
        description: makeLorem(20),
        pageCount: getRandomIntInclusive(50, 900),
        categories: [makeLorem(1), makeLorem(1)],
        thumbnail: `http://coding-academy.org/books-photos/${getRandomIntInclusive(1, 20)}.jpg`,
        language: 'en',
        listPrice: {
            amount: 0,
            currencyCode: 'EUR',
            isOnSale: true
        }
    }
}

function getDefaultFilter() {
    return { title: '', maxPrice: '', authors: '' }
}

function _initBooks() {
    let books = loadFromStorage(BOOK_KEY)
    if (!books || !books.length) {
        saveToStorage(BOOK_KEY, initialBooks)
    }
}

function _setNextPrevBookId(book) {
    return query().then((books) => {
        const bookIdx = books.findIndex((currBook) => currBook.id === book.id)
        const nextBook = books[bookIdx + 1] ? books[bookIdx + 1] : books[0]
        const prevBook = books[bookIdx - 1] ? books[bookIdx - 1] : books[books.length - 1]
        book.nextBookId = nextBook.id
        book.prevBookId = prevBook.id
        return book
    })
}

function addReview(bookId, review) {
    return get(bookId).then(book => {
        if (!book.reviews) book.reviews = []
        
        const newReview = {
            id: _makeId(),
            ...review,
            createdAt: Date.now()
        }
        
        book.reviews.unshift(newReview)
        return save(book)
    })
}

function removeReview(bookId, reviewId) {
    return get(bookId).then(book => {
        if (!book.reviews) return book
        
        const reviewIdx = book.reviews.findIndex(review => review.id === reviewId)
        if (reviewIdx !== -1) {
            book.reviews.splice(reviewIdx, 1)
            return save(book)
        }
        return book
    })
}

function _makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function addGoogleBook(googleBook) {
    // Check if book already exists in database
    return query().then(books => {
        const volumeInfo = googleBook.volumeInfo
        const existingBook = books.find(book => 
            book.title.toLowerCase() === volumeInfo.title.toLowerCase()
        )
        
        if (existingBook) {
            return Promise.reject('Book already exists in database')
        }
        
        // Convert Google Books API format to our app format
        const book = {
            title: volumeInfo.title || 'Unknown Title',
            subtitle: volumeInfo.subtitle || '',
            authors: volumeInfo.authors || [],
            publishedDate: volumeInfo.publishedDate ? 
                parseInt(volumeInfo.publishedDate.substring(0, 4)) : 
                new Date().getFullYear(),
            description: volumeInfo.description || makeLorem(getRandomIntInclusive(10, 150)),
            pageCount: volumeInfo.pageCount || getRandomIntInclusive(100, 800),
            categories: volumeInfo.categories || [],
            thumbnail: (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) || 
                `http://coding-academy.org/books-photos/${getRandomIntInclusive(1, 20)}.jpg`,
            language: volumeInfo.language || 'en',
            listPrice: {
                amount: getRandomIntInclusive(50, 1000),
                currencyCode: 'EUR',
                isOnSale: Math.random() > 0.5
            }
        }
        
        return save(book)
    })
}
