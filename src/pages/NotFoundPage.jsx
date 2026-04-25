import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="text-9xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Страница не найдена
        </h1>
        <p className="text-text-secondary mb-8">
          Извините, запрошенная страница не существует или была перемещена.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-primary text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-red-700 transition"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage