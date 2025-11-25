const { useState } = React

export function AddReview({ bookId, onAddReview }) {
    const [review, setReview] = useState({ 
        fullname: '', 
        rating: '5', 
        readAt: '' 
    })

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        setReview(prevReview => ({ ...prevReview, [field]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        if (!review.fullname || !review.rating || !review.readAt) {
            alert('Please fill in all fields')
            return
        }
        
        const reviewToSave = {
            ...review,
            rating: +review.rating
        }
        
        onAddReview(reviewToSave)
        setReview({ fullname: '', rating: '5', readAt: '' })
    }

    return (
        <section className="add-review">
            <h3>Add Your Review</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="fullname">Full Name:</label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={review.fullname}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <select
                        id="rating"
                        name="rating"
                        value={review.rating}
                        onChange={handleChange}
                        required
                    >
                        <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                        <option value="4">⭐⭐⭐⭐ (4)</option>
                        <option value="3">⭐⭐⭐ (3)</option>
                        <option value="2">⭐⭐ (2)</option>
                        <option value="1">⭐ (1)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="readAt">Read At:</label>
                    <input
                        type="date"
                        id="readAt"
                        name="readAt"
                        value={review.readAt}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Add Review</button>
            </form>
        </section>
    )
}
