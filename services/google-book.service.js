const API_KEY = ''

export const googleBookService = {
    query
}

function query(searchTerm) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=10&key=${API_KEY}`
    
    return axios.get(url)
        .then(function(res) {
            return res.data.items || []
        })
        .catch(function(err) {
            console.error('Error fetching Google Books:', err)
            throw err
        })
}
