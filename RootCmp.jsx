const { useState } = React

import { AppHeader } from "./cmps/AppHeader.jsx"
import { About } from "./pages/About.jsx"
import { Home } from "./pages/Home.jsx"
import { BookIndex } from "./pages/BookIndex.jsx"
import { AppFooter } from "./cmps/AppFooter.jsx"

export function RootCmp() {

    const [page, setPage] = useState('book')

    return (
        <section className="app">
            <AppHeader onSetPage={setPage} />

            <main>
                {page === 'home' && <Home />}
                {page === 'about' && <About />}
                {page === 'book' && <BookIndex />}
            </main>
            <AppFooter />
        </section>
    )
} 