import '@styles/globals.css'
import Nav from '@components/Nav'
import Provider from '@components/Provider';
import Script from 'next/script'

export const metadata = {
    title: "Promptopia",
    description: "DisCover and share your favorite prompts",
}

const RootLayout = ({ children }) => {

    return (
        <html lang='en'>
            <Provider>
                <body>
                    <div className="main">
                        <div className="gradient" />
                    </div>
                    <main className="app">
                        <Nav />
                        {children}
                    </main>
                </body>
            </Provider>

            <Script src="https://kit.fontawesome.com/c1677446e6.js" />
        </html>
    )
}

export default RootLayout;