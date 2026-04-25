import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

function PrivacyPage() {
  const [privacyText, setPrivacyText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrivacyPolicy()
  }, [])

  const fetchPrivacyPolicy = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us')
        .select('privacy_policy')
        .limit(1)
        .single()

      if (error) throw error
      setPrivacyText(data?.privacy_policy || 'Политика конфиденциальности не заполнена.')
    } catch (error) {
      console.error('Ошибка загрузки политики:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Хлебные крошки */}
        <div className="text-sm text-text-secondary mb-6">
          <Link to="/" className="hover:text-primary transition">Главная</Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">Политика конфиденциальности</span>
        </div>

        <div className="card-bg rounded-3xl p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Политика обработки персональных данных
          </h1>
          <div className="text-text-secondary whitespace-pre-line leading-relaxed">
            {privacyText}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage