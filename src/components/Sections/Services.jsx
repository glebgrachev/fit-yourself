import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

function Services({ onBookingClick }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="services" className="py-16 bg-bg-light">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-secondary">Загрузка услуг...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-16 bg-bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-12">
          Услуги и цены
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="card-bg rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2"
            >
              <h3 className="text-2xl font-bold text-text-primary mb-2">{service.title}</h3>
              <div className="text-3xl font-bold text-primary mb-2">
                {service.price === 0 ? 'Бесплатно' : `${service.price.toLocaleString()} ₽`}
              </div>
              <div className="text-text-secondary text-sm mb-4">{service.duration}</div>
              <p className="text-text-secondary mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features?.map((feature, idx) => (
                  <li key={idx} className="text-text-secondary text-sm">✓ {feature}</li>
                ))}
              </ul>
              <button 
                onClick={onBookingClick}
                className="w-full bg-primary text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
              >
                Записаться
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services