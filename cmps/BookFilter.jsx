import { debounce } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BookFilter({ defaultFilter, onSetFilter }) {

    const [filterByToEdit, setFilterToEdit] = useState({ ...defaultFilter })

    const onSetFilterDebounce = useRef(debounce(onSetFilter, 400)).current

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    useEffect(() => {
        setFilterToEdit({ ...defaultFilter })
    }, [defaultFilter.title, defaultFilter.minPrice, defaultFilter.authors])

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

        setFilterToEdit(prevFilter => ({ ...prevFilter, [field]: value }))

    }

    function clearFilter() {
        const emptyFilter = { title: '', minPrice: '', authors: '' }
        setFilterToEdit(emptyFilter)
        onSetFilter(emptyFilter)
    }

    const { title, minPrice, authors } = filterByToEdit
    return (
        <section className="book-filter container">
            <h2>Filter Our Books</h2>

            <form>
                <label htmlFor="title">Title</label>
                <input onChange={handleChange} value={title} name="title" id="title" type="text" />

                <label htmlFor="authors">Authors</label>
                <input onChange={handleChange} value={authors} name="authors" id="authors" type="text" />

                <label htmlFor="minPrice">Min Price</label>
                <input onChange={handleChange} value={minPrice || ''} name="minPrice" id="minPrice" type="number" />

                <button type="button" onClick={clearFilter} className="clear-btn"><i className="fa-solid fa-broom"></i></button>
            </form>
        </section>
    )
}
