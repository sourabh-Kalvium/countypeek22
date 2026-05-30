import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found">
      <h2>404 — Page Not Found</h2>
      <p>We could not find the page you were looking for.</p>
      <Link to="/">Back to Home</Link>
    </div>
  )
}

export default NotFound
