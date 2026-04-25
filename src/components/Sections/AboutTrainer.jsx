import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'

function AboutTrainer({ onBookingClick }) {
  const [trainer, setTrainer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrainer()
  }, [])

  const fetchTrainer = async () => {
    try {
      const { data, error } = await supabase
        .from('trainer')
        .select('*')
        .limit(1)
        .single()

      if (error) throw error
      setTrainer(data)
    } catch (error) {
      console.error('Ошибка загрузки тренера:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="about" className="py-16 bg-bg-light">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-secondary">Загрузка информации...</p>
        </div>
      </section>
    )
  }

  if (!trainer) return null

  return (
    <section id="about" className="py-16 bg-bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-12">
          О тренере
        </h2>
        
        <Link to="/trainer" className="block">
          <div className="flex flex-col md:flex-row gap-12 transition-all duration-300 hover:-translate-y-2">
            {/* Фото тренера */}
            <div className="md:w-2/5">
              <img 
                src={trainer.avatar_url || 'https://placehold.co/600x400/2E303A/white?text=Фото+тренера'} 
                alt={trainer.name}
                className="w-full h-auto rounded-3xl object-cover"
              />
            </div>
            
            {/* Информация */}
            <div className="md:w-3/5">
              <div className="card-bg rounded-3xl p-8">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  {trainer.name}
                </h2>
                <p className="text-text-secondary mb-4">{trainer.bio}</p>
                <div className="flex flex-wrap gap-6 mb-8">
                  {trainer.certificates?.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-xl">🎓</span> {cert}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap justify-start gap-8 mb-8">
                  <div>
                    <div className="text-3xl font-bold text-primary">{trainer.experience_years}+</div>
                    <div className="text-text-secondary text-sm">лет опыта</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">{trainer.clients_count}+</div>
                    <div className="text-text-secondary text-sm">довольных клиентов</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">{trainer.success_rate}%</div>
                    <div className="text-text-secondary text-sm">достигают цели</div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault() // Останавливаем переход по ссылке
                    onBookingClick()
                  }}
                  className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-red-700 transition"
                >
                  Записаться на тренировку
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

export default AboutTrainer