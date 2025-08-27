import "./globals.css"
import Link from "next/link"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <header className="navbar">
          <Link href="/" className="logo">Hi, I’m Ramprasad</Link>
          <nav className="links">
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/portfolio">Portfolio</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
