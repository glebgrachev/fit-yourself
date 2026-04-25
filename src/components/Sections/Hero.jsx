import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

function Hero({ onBookingClick }) {
  const [heroData, setHeroData] = useState({
    title: 'Твое тело — новая форма',
    subtitle: 'Персональные тренировки с сертифицированным тренером. Начни без боли и ограничений',
    buttonText: 'Записаться на пробное занятие',
    imageUrl: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHeroData()
  }, [])

  const fetchHeroData = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us')
        .select('hero_title, hero_subtitle, hero_button_text, hero_image_url')
        .limit(1)
        .single()

      if (error) throw error
      if (data) {
        setHeroData({
          title: data.hero_title || heroData.title,
          subtitle: data.hero_subtitle || heroData.subtitle,
          buttonText: data.hero_button_text || heroData.buttonText,
          imageUrl: data.hero_image_url || ''
        })
      }
    } catch (error) {
      console.error('Ошибка загрузки Hero:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-bg-light">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-secondary">Загрузка...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-bg-light">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
              {heroData.title}
            </h1>
            <p className="text-text-secondary text-lg mb-8">
              {heroData.subtitle}
            </p>
            <button 
              onClick={onBookingClick}
              className="bg-primary text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-red-700 transition transform hover:scale-105"
            >
              {heroData.buttonText}
            </button>

            <div className="flex justify-center md:justify-start gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-primary">8+</div>
                <div className="text-text-secondary text-sm">лет опыта</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">200+</div>
                <div className="text-text-secondary text-sm">довольных клиентов</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-text-secondary text-sm">достигают цели</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            {heroData.imageUrl ? (
              <img 
                src={heroData.imageUrl} 
                alt="Тренировка"
                className="w-full max-w-md md:max-w-full h-auto max-h-[500px] object-cover rounded-3xl shadow-lg"
              />
            ) : (
              <div className="bg-gray-800 rounded-3xl w-full max-w-md md:max-w-full h-96 flex items-center justify-center">
                <span className="text-text-secondary">Фото тренировки</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero