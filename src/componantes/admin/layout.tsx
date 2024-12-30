import '../../app/globals.css'
import { Inter } from 'next/font/google'
import { Sidebar } from '../../app/components/Sidebar'
import { Navbar } from '../../app/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

 

export default function RootLayoutAdmin({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
              <div className="container mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
     
  )
}
