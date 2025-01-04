import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import "../../app/globalsp.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <br/>
          <main>{children}</main>
        </ThemeProvider>
       
  )
}

