import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

const TELEGRAM_BOT_TOKEN = '8286883049:AAH4dOdRfGdePaA-mtSvduzym1OcYhtDrPo'
const TELEGRAM_CHAT_ID = '438549035'

function BookingForm({ onSuccess, preselectedService, hideServiceSelect = false }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: preselectedService || 'Пробная тренировка'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Обновляем форму, если preselectedService меняется
  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }))
    }
  }, [preselectedService])

  // Отправка в Telegram
  const sendToTelegram = async (data) => {
    const message = `🔴 НОВАЯ ЗАЯВКА FIT YOURSELF 🔴
    
👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
💪 Услуга: ${data.service}`

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      })
      if (!response.ok) {
        console.error('Telegram ошибка:', await response.text())
        return false
      }
      return true
    } catch (err) {
      console.error('Ошибка отправки в Telegram:', err)
      return false
    }
  }

  // Отправка в Supabase
  const sendToSupabase = async (data) => {
    try {
      // Получаем service_id по названию услуги
      let serviceId = null
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('id')
        .eq('title', data.service)
        .single()
      
      if (serviceError) {
        console.warn('Не найден service_id для:', data.service, serviceError)
      } else if (serviceData) {
        serviceId = serviceData.id
      }
      
      console.log('📤 Отправка в Supabase:', { 
        name: data.name, 
        phone: data.phone, 
        service_id: serviceId,
        service: data.service
      })
      
      const { data: result, error } = await supabase
        .from('appointments')
        .insert([
          {
            name: data.name,
            phone: data.phone,
            service_id: serviceId,
            service: data.service,
            status: 'new',
            notes: null
          }
        ])
        .select()
      
      if (error) {
        console.error('❌ Ошибка Supabase:', error)
        return false
      }
      
      console.log('✅ Успешно отправлено в Supabase:', result)
      return true
    } catch (err) {
      console.error('❌ Исключение при отправке в Supabase:', err)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    console.log('🚀 Начало отправки формы...')
    
    const supabaseSuccess = await sendToSupabase(formData)
    const telegramSuccess = await sendToTelegram(formData)
    
    console.log('Результат Supabase:', supabaseSuccess)
    console.log('Результат Telegram:', telegramSuccess)
    
    if (supabaseSuccess || telegramSuccess) {
      setIsSubmitted(true)
      setFormData({ 
        name: '', 
        phone: '', 
        service: preselectedService || 'Пробная тренировка'
      })
      setTimeout(() => {
        setIsSubmitted(false)
        if (onSuccess) onSuccess()
      }, 2000)
    } else {
      setError('Ошибка отправки. Попробуйте позже.')
    }
    
    setIsSubmitting(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Заявка принята!</h3>
        <p className="text-text-secondary">Я свяжусь с вами в ближайшее время.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900 text-red-200 p-4 rounded-2xl text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-text-primary font-medium mb-2">Ваше имя *</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-text-primary focus:border-primary focus:outline-none"
          placeholder="Иван"
        />
      </div>

      <div>
        <label className="block text-text-primary font-medium mb-2">Телефон *</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-text-primary focus:border-primary focus:outline-none"
          placeholder="+7 (___) ___-__-__"
        />
      </div>

      {!hideServiceSelect && (
        <div>
          <label className="block text-text-primary font-medium mb-2">Выберите услугу</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-text-primary focus:border-primary focus:outline-none appearance-none pr-12"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5rem'
            }}
          >
            <option>Пробная тренировка</option>
            <option>Персональная тренировка</option>
            <option>Абонемент на 8 занятий</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input type="checkbox" id="consent" required className="w-4 h-4 bg-gray-800 border border-gray-700 rounded" />
        <label htmlFor="consent" className="text-sm text-text-secondary">
          Согласен с <a href="#" className="text-primary hover:underline">политикой конфиденциальности</a>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-3 rounded-full text-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  )
}

export default BookingForm