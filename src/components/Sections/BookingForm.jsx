import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

const TELEGRAM_BOT_TOKEN = '8286883049:AAH4dOdRfGdePaA-mtSvduzym1OcYhtDrPo'
const TELEGRAM_CHAT_ID = '438549035'

// Функция для форматирования телефона
const formatPhoneNumber = (value) => {
  // Удаляем все нецифровые символы
  const digits = value.replace(/\D/g, '')
  
  // Если начинается с 8 или 9, заменяем на +7
  let phone = digits
  if (phone.startsWith('8')) {
    phone = '7' + phone.slice(1)
  }
  
  // Ограничиваем длину 11 цифрами (без +7)
  if (phone.length > 11) {
    phone = phone.slice(0, 11)
  }
  
  // Форматируем как +7 (XXX) XXX-XX-XX
  if (phone.length >= 1) {
    let formatted = '+7'
    if (phone.length > 1) {
      formatted += ' (' + phone.slice(1, 4)
    }
    if (phone.length >= 4) {
      formatted += ') ' + phone.slice(4, 7)
    }
    if (phone.length >= 7) {
      formatted += '-' + phone.slice(7, 9)
    }
    if (phone.length >= 9) {
      formatted += '-' + phone.slice(9, 11)
    }
    return formatted
  }
  return '+7'
}

// Валидация имени
const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return 'Имя должно содержать минимум 2 символа'
  }
  if (name.trim().length > 50) {
    return 'Имя слишком длинное'
  }
  return ''
}

// Валидация телефона
const validatePhone = (phone) => {
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 11) {
    return 'Введите полный номер телефона (10 цифр после +7)'
  }
  return ''
}

function BookingForm({ onSuccess, preselectedService, hideServiceSelect = false }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '+7',
    service: preselectedService || 'Пробная тренировка'
  })
  const [errors, setErrors] = useState({
    name: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }))
    }
  }, [preselectedService])

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value
    // Если стираем всё, показываем +7
    const digits = rawValue.replace(/\D/g, '')
    if (digits.length === 0 || digits === '7') {
      setFormData({ ...formData, phone: '+7' })
      setErrors({ ...errors, phone: '' })
      return
    }
    const formatted = formatPhoneNumber(rawValue)
    setFormData({ ...formData, phone: formatted })
    setErrors({ ...errors, phone: '' })
  }

  const handleNameChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, name: value })
    setErrors({ ...errors, name: validateName(value) })
  }

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

  const sendToSupabase = async (data) => {
    try {
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
    
    // Валидация перед отправкой
    const nameError = validateName(formData.name)
    const phoneError = validatePhone(formData.phone)
    
    setErrors({
      name: nameError,
      phone: phoneError
    })
    
    if (nameError || phoneError) {
      return
    }
    
    setIsSubmitting(true)
    setError('')

    const supabaseSuccess = await sendToSupabase(formData)
    const telegramSuccess = await sendToTelegram(formData)
    
    if (supabaseSuccess || telegramSuccess) {
      setIsSubmitted(true)
      setFormData({ 
        name: '', 
        phone: '+7', 
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
          onChange={handleNameChange}
          className={`w-full px-4 py-3 rounded-2xl bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} text-text-primary focus:border-primary focus:outline-none transition`}
          placeholder="Иван"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-text-primary font-medium mb-2">Телефон *</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handlePhoneChange}
          className={`w-full px-4 py-3 rounded-2xl bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} text-text-primary focus:border-primary focus:outline-none transition`}
          placeholder="+7 (___) ___-__-__"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
        )}
      </div>

      {!hideServiceSelect && (
        <div>
          <label className="block text-text-primary font-medium mb-2">Выберите услугу</label>
          <select
            name="service"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
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
          Согласен с политикой конфиденциальности и договором оферты
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