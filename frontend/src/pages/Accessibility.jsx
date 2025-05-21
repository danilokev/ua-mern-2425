import { useState, useEffect } from 'react'
import '../styles/index.css'

function AccessibilityPage() {
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('large-text', largeText)
    document.body.classList.toggle('high-contrast', highContrast)
    document.body.classList.toggle('reduce-motion', reduceMotion)
  }, [largeText, highContrast, reduceMotion])

  return (
    <main className='accessibility-page'> 
      <h2>Opciones de accesibilidad</h2>

      <div className='toggle-group'>
        <label>
          <input
            type='checkbox'
            checked={largeText}
            onChange={() => setLargeText(!largeText)}
          />
          Aumentar tamaño de fuente
        </label>

        <label>
          <input
            type='checkbox'
            checked={highContrast}
            onChange={() => setHighContrast(!highContrast)}
          />
          Activar alto contraste
        </label>

        <label>
          <input
            type='checkbox'
            checked={reduceMotion}
            onChange={() => setReduceMotion(!reduceMotion)}
          />
          Desactivar animaciones
        </label>
      </div>
    </main>
  )
}

export default AccessibilityPage
