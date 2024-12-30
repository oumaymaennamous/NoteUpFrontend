'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, GraduationCap, BookOpen, Users, Settings, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: GraduationCap, label: 'Gestion Filière', href: '/admin/filieres' },
  { icon: BookOpen, label: 'Gestion Module', href: '/admin/modules' },
  { icon: Users, label: 'Gestion Étudiants', href: '/admin/etudiants' },
  { icon: Users, label: 'Gestion Professeur', href: '/admin/professeurs' },
  { icon: CalendarDays, label: 'New Promo', href: '/admin/promos' },
  { icon: Settings, label: 'Gestion Comptes', href: '/comptes' },
]
export function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const pathname = usePathname()

  return (
    <aside className={cn(
      "bg-gradient-to-b from-purple-700 to-indigo-900 text-white transition-all duration-300 ease-in-out",
      expanded ? "w-64" : "w-20"
    )}>
      <div className="flex flex-col h-screen">
        <div className={cn(
          "flex items-center justify-between p-4 transition-all duration-300 ease-in-out",
          expanded ? "flex-row" : "flex-col"
        )}>
          <h2 className={cn(
            "text-2xl font-bold transition-all duration-300 ease-in-out",
            expanded ? "opacity-100" : "opacity-0 w-0"
          )}>
            NoteUp.
          </h2>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {expanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-4">
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ease-in-out",
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-6 h-6 transition-all duration-300 ease-in-out", expanded ? "" : "mx-auto")} />
                    <span className={cn(
                      "transition-all duration-300 ease-in-out",
                      expanded ? "opacity-100" : "opacity-0 w-0"
                    )}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
