
export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

export function getReadingLevel(pageCount) {
    if (pageCount > 500) return 'Serious Reading'
    if (pageCount > 200) return 'Descent Reading'
    if (pageCount < 100) return 'Light Reading'
    return ''
}

export function getBookAge(publishedYear) {
    const currentYear = new Date().getFullYear()
    const age = currentYear - publishedYear
    
    if (age > 10) return 'Vintage'
    if (age < 1) return 'New'
    return ''
}

export function getPriceClass(price) {
    if (price > 150) return 'expensive'
    if (price < 20) return 'cheap'
    return ''
}

export function getCurrencySymbol(currencyCode) {
    const currencySymbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'ILS': '₪',
        'INR': '₹',
        'CNY': '¥',
        'KRW': '₩',
        'RUB': '₽',
        'BRL': 'R$'
    }
    return currencySymbols[currencyCode] || currencyCode
}

export function animateCSS(el, animation, options = {}) {
    const { isRemoveClass = true } = options

    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)

        function handleAnimationEnd(event) {
            event.stopPropagation()
            if (isRemoveClass) {
                el.classList.remove(`${prefix}animated`, animationName)
            }
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}

export function debounce(func, delay) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}