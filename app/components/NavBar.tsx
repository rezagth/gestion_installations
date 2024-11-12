"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/installations', label: 'Installations' },
    { href: '/remplacements', label: 'Remplacements' },
    { href: '/suivi', label: 'Suivi' },
  ]

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white text-lg font-bold">Gestion Installations</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-b-2 border-white'
                      : 'border-transparent'
                  } text-white hover:border-gray-300 hover:text-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}