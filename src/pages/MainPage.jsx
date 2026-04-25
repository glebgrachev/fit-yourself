import { useState } from 'react'
import Hero from '../components/Sections/Hero'
import Services from '../components/Sections/Services'
import Benefits from '../components/Sections/Benefits'
import AboutTrainer from '../components/Sections/AboutTrainer'
import BookingForm from '../components/Sections/BookingForm'
import Modal from '../components/UI/Modal'

function MainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <main className="flex-grow pt-4">
        <Hero onBookingClick={() => setIsModalOpen(true)} />
        <Services onBookingClick={() => setIsModalOpen(true)} />
        <Benefits />
        <AboutTrainer onBookingClick={() => setIsModalOpen(true)} />
        <div className="max-w-2xl mx-auto w-full px-4 pb-16">
          <BookingForm />
        </div>
      </main>

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

export default MainPage