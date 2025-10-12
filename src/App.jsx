// src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import './styles.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import { isAuthed, logout } from './auth'
import {
  HomeIcon,
  CreditCardIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  ChartBarIcon as ChartBarIconSolid,
} from '@heroicons/react/24/solid'

function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Close mobile sidebar on route change
    setSidebarOpen(false)
    setProfileDropdownOpen(false)
  }, [location])

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setDarkMode(!darkMode)
  }

  if (!isAuthed()) return <Navigate to="/login" />

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      current: location.pathname === '/'
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: CreditCardIcon,
      iconSolid: CreditCardIconSolid,
      current: location.pathname === '/transactions'
    },
    {
      name: 'Budget',
      href: '/budget',
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid,
      current: location.pathname === '/budget'
    }
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform 
                      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      transition-transform duration-300 ease-in-out lg:hidden
                      flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">FinanceApp</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Mobile Navigation - Fixed */}
        <nav className="flex-1 px-4 py-6">
          <div className="flex flex-col space-y-2">
            {navigation.map((item) => {
              const Icon = item.current ? item.iconSolid : item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full
                           ${item.current
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 dark:text-gray-300 
                     hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 
                     rounded-xl transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64">
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo Header */}
          <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <CurrencyDollarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">FinanceApp</span>
          </div>
          
          {/* Desktop Navigation - Fixed */}
          <nav className="flex-1 px-4 py-6">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.current ? item.iconSolid : item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full
                             ${item.current
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Desktop User section at bottom of sidebar */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 dark:text-gray-300 
                       hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 
                       rounded-xl transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top navigation bar - FIXED FOR MOBILE */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 
                        dark:border-gray-700 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
          <div className="px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Left section */}
              <div className="flex items-center flex-1">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                           transition-colors lg:hidden"
                >
                  <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Page title - desktop only */}
                <div className="hidden lg:block">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {navigation.find(item => item.current)?.name || 'Dashboard'}
                  </h1>
                </div>

               
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                

                {/* Notifications - Hidden on very small screens */}
                <button 
                  className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                           transition-colors hidden xs:block"
                  aria-label="Notifications"
                >
                  <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 
                             dark:hover:bg-gray-700 transition-colors"
                  >
                    <UserCircleIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Test User</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">testuser@gmail.com</p>
                    </div>
                    <ChevronDownIcon className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 
                                              transition-transform hidden sm:block ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown menu - Responsive positioning */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-gray-800 
                                  rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 
                                  py-2 animate-slideDown z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 md:hidden">
                        <p className="text-xs font-medium text-gray-900 dark:text-white">Test User</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">testuser@gmail.com</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 
                                 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
                                 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budget" element={<Budget />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 
                        px-4 sm:px-6 lg:px-8 py-4 mt-auto">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 FinanceApp. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Shell />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App