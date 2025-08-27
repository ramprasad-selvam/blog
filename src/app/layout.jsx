import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
