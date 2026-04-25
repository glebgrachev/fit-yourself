import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

function Header() {
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    fetchLogo()
  }, [])

  const fetchLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us')
        .select('logo_url')
        .limit(1)
        .single()

      if (error) throw error
      if (data?.logo_url) setLogoUrl(data.logo_url)
    } catch (error) {
      console.error('Ошибка загрузки логотипа:', error)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <header className="py-4 bg-bg-light border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <button 
          onClick={scrollToTop}
          className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Fit Yourself" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base md:text-lg">FY</span>
            </div>
          )}
          <span className="font-bold text-2xl md:text-4xl text-text-primary font-heading leading-tight md:leading-tight">
            Fit Yourself
          </span>
        </button>
      </div>
    </header>
  )
}

export default Header