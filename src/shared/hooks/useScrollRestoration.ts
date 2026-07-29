import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const scrollKey = (pathname: string): string => `scroll:${pathname}`

export const useScrollRestoration = () => {
  const location = useLocation()
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    const previousPath = pathnameRef.current
    if (previousPath !== location.pathname) {
      sessionStorage.setItem(scrollKey(previousPath), String(window.scrollY))
      pathnameRef.current = location.pathname
    }

    const saved = sessionStorage.getItem(scrollKey(location.pathname))
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo(0, Number(saved))
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])
}
