const { useState } = React

export function LongTxt({ txt, length = 100 }) {
    const [isExpanded, setIsExpanded] = useState(false)

    if (txt.length <= length) return <span>{txt}</span>

    return (
        <span>
            {isExpanded ? txt : txt.substring(0, length) + '...'}
            <button className="btn-read-more" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? ' Read Less' : ' Read More'}
            </button>
        </span>
    )
}
