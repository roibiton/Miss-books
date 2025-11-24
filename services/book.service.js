import { loadFromStorage, saveToStorage } from './util.service.js'
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
    getDefaultFilter
}

function query(filterBy = {}) {
    return storageService.query(BOOK_KEY)
        .then(books => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                books = books.filter(book => regExp.test(book.title))
            }
            if (filterBy.minPrice) {
                books = books.filter(book => book.listPrice.amount >= filterBy.minPrice)
            }
            if (filterBy.authors) {
                const regExp = new RegExp(filterBy.authors, 'i')
                books = books.filter(book => book.authors.some(author => regExp.test(author)))
            }
            return books
        })
}

function get(bookId) {
    return storageService.get(BOOK_KEY, bookId)
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

function getEmptyBook(title = '', subtitle = '') {
    return { 
        title, 
        subtitle,
        authors: [],
        publishedDate: new Date().getFullYear(),
        description: '',
        pageCount: 0,
        categories: [],
        thumbnail: '',
        language: 'en',
        listPrice: {
            amount: 0,
            currencyCode: 'EUR',
            isOnSale: false
        }
    }
}

function getDefaultFilter() {
    return { title: '', minPrice: '', authors: '' }
}

function _initBooks() {
    let books = loadFromStorage(BOOK_KEY)
    if (!books || !books.length) {
        saveToStorage(BOOK_KEY, initialBooks)
    }
}
