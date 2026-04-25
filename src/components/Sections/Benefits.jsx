import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

function Benefits() {
  const [benefits, setBenefits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBenefits()
  }, [])

  const fetchBenefits = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us')
        .select('benefits')
        .limit(1)
        .single()

      if (error) throw error
      setBenefits(data?.benefits || [])
    } catch (error) {
      console.error('Ошибка загрузки преимуществ:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-bg-light">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-secondary">Загрузка...</p>
        </div>
      </section>
    )
  }

  if (benefits.length === 0) return null

  return (
    <section className="py-16 bg-bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-12">
          Почему выбирают меня
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {benefits.map((item, index) => (
            <div key={index} className="card-bg rounded-3xl p-6 text-center transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits