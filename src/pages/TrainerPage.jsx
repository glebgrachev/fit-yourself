import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import Modal from '../components/UI/Modal'
import BookingForm from '../components/Sections/BookingForm'

function TrainerPage() {
  const [trainer, setTrainer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">Загрузка...</p>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">Информация о тренере не найдена</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Вернуться на главную</Link>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Хлебные крошки */}
          <div className="text-sm text-text-secondary mb-6">
            <Link to="/" className="hover:text-primary transition">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary">О тренере</span>
          </div>

          {/* Основной блок: фото + информация */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Фото тренера */}
            <div className="md:w-2/5">
              <img 
                src={trainer.avatar_url || 'https://placehold.co/600x400/2A2F3F/white?text=Тренер'} 
                alt={trainer.name}
                className="w-full h-auto rounded-3xl object-cover"
              />
            </div>

            {/* Информация */}
            <div className="md:w-3/5">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{trainer.name}</h1>
              
              {/* Статистика */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <div className="text-2xl font-bold text-primary">{trainer.experience_years}+</div>
                  <div className="text-text-secondary text-sm">лет опыта</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{trainer.clients_count}+</div>
                  <div className="text-text-secondary text-sm">довольных клиентов</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{trainer.success_rate}%</div>
                  <div className="text-text-secondary text-sm">достигают цели</div>
                </div>
              </div>

              {/* Биография */}
              <div className="card-bg rounded-3xl p-6 mb-6">
                <h2 className="text-xl font-bold text-text-primary mb-3">О себе</h2>
                <p className="text-text-secondary leading-relaxed">{trainer.bio}</p>
              </div>

              {/* Сертификаты */}
              {trainer.certificates && trainer.certificates.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-text-primary mb-3">Сертификаты</h2>
                  <div className="flex flex-wrap gap-3">
                    {trainer.certificates.map((cert, idx) => (
                      <span key={idx} className="bg-gray-800 rounded-full px-4 py-2 text-sm text-text-secondary">
                        🎓 {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Telegram */}
              {trainer.telegram && (
                <div className="mb-6">
                  <a 
                    href={trainer.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 text-sm text-text-secondary hover:text-primary transition"
                  >
                    <span>📱</span> Написать в Telegram
                  </a>
                </div>
              )}

              {/* Кнопка записи */}
              <div className="flex justify-start">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-white px-8 py-3 rounded-full text-base font-medium hover:bg-red-700 transition w-full sm:w-[350px]"
                >
                  Записаться на тренировку
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="py-2">
          <h3 className="text-2xl font-bold text-text-primary text-center mb-4">
            Записаться на тренировку
          </h3>
          <BookingForm onSuccess={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </>
  )
}

export default TrainerPage