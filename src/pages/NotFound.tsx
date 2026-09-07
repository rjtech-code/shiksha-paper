import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold brand-gradient-text mb-4">404</h1>
      <p className="text-slate-500 mb-8">This page wandered off. Let's get you back.</p>
      <Link to="/" className="brand-gradient text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-pink-200">
        Back to home
      </Link>
    </div>
  )
}
