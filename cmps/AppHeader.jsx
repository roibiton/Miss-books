
const { Link, NavLink } = ReactRouterDOM
const { useState } = React

export function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function toggleMenu() {
        setIsMenuOpen(function(prev) { return !prev })
    }

    function closeMenu() {
        setIsMenuOpen(false)
    }

    return (
        <React.Fragment>
            {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
            
            <header className="app-header">
                <section>
                   
                    
                    <button className="hamburger-btn" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                     <h1>React Book App</h1>
                    <nav className={'app-nav ' + (isMenuOpen ? 'open' : '')}>
                        <NavLink to="/home" onClick={closeMenu}>Home</NavLink>
                        <NavLink to="/about" onClick={closeMenu}>About</NavLink>
                        <NavLink to="/book" onClick={closeMenu}>Books</NavLink>
                    </nav>
                </section>
            </header>
        </React.Fragment>
    )
}