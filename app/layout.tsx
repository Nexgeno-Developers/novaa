import './globals.css'
import { Josefin_Sans
} from 'next/font/google'
// import { Providers } from './providers'
import { cn } from '@/lib/utils' // (if using Shadcn's `cn` helper)
import Navbar from '@/components/Navbar'
import { Providers } from '@/lib/providers'



const josefin_sans = Josefin_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Novaa Global Properties',
  description: 'Luxury real estate in Thailand, UAE, and Europe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(josefin_sans.className)}>
        <Providers>
        <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
