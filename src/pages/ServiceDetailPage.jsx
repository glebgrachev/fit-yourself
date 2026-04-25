import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import Modal from '../components/UI/Modal'
import BookingForm from '../components/Sections/BookingForm'

function ServiceDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchService()
  }, [id])

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setService(data)
    } catch (error) {
      console.error('Ошибка загрузки услуги:', error)
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

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">Услуга не найдена</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Вернуться на главную</Link>
      </div>
    )
  }

  const imageUrl = service.image_url || 'https://placehold.co/600x400/2A2F3F/white?text=Fit+Yourself'

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Хлебные крошки */}
          <div className="text-sm text-text-secondary mb-6">
            <Link to="/" className="hover:text-primary transition">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary">{service.title}</span>
          </div>

          {/* Основной блок: фото 2/5 + текст 3/5 */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Фото */}
            <div className="md:w-2/5">
              <img 
                src={imageUrl} 
                alt={service.title}
                className="w-full h-auto rounded-3xl object-cover"
              />
            </div>

            {/* Информация */}
            <div className="md:w-3/5">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{service.title}</h1>
              <div className="text-2xl font-bold text-primary mb-6">
                {service.price === 0 ? 'Бесплатно' : `${service.price.toLocaleString()} ₽`}
              </div>
              
              {/* Краткое описание */}
              <p className="text-text-secondary mb-6">{service.description}</p>
              
              {/* Длительность */}
              {service.duration && (
                <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 text-sm text-text-secondary mb-6">
                  <span>⏱</span> {service.duration}
                </div>
              )}
              
              {/* Кнопка записи */}
              <div className="flex justify-start">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-white px-8 py-3 rounded-full text-base font-medium hover:bg-red-700 transition w-full sm:w-[350px]"
                >
                  Записаться
                </button>
              </div>
            </div>
          </div>

          {/* Детальное описание */}
          {(service.full_description || service.description) && (
            <div className="card-bg rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Подробнее об услуге</h2>
              <div className="text-text-secondary whitespace-pre-line">
                {service.full_description || service.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="py-2">
          <h3 className="text-2xl font-bold text-text-primary text-center mb-4">
            Записаться на тренировку
          </h3>
          <BookingForm 
            onSuccess={() => setIsModalOpen(false)} 
            preselectedService={service.title}
            hideServiceSelect={true}
          />
        </div>
      </Modal>
    </>
  )
}

export default ServiceDetailPage