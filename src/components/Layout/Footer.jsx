import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="py-8 bg-bg-light text-text-secondary text-center text-sm border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
          <Link to="/privacy" className="hover:text-primary transition">
            Политика конфиденциальности
          </Link>
          <Link to="/offer" className="hover:text-primary transition">
            Договор оферты
          </Link>
        </div>
        <p>© 2026 Fit Yourself. Все права защищены.</p>
      </div>
    </footer>
  )
}

export default Footer