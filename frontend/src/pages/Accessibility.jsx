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
        <label className='switch'>
          <input
            type='checkbox'
            checked={largeText}
            onChange={() => setLargeText(!largeText)}
          />
          <span className='slider'></span>
          <span className='label-text'>Aumentar tamaño de fuente</span>
        </label>

        <label className='switch'>
          <input
            type='checkbox'
            checked={highContrast}
            onChange={() => setHighContrast(!highContrast)}
          />
          <span className='slider'></span>
          <span className='label-text'>Activar alto contraste</span>
        </label>

        <label className='switch'>
          <input
            type='checkbox'
            checked={reduceMotion}
            onChange={() => setReduceMotion(!reduceMotion)}
          />
          <span className='slider'></span>
          <span className='label-text'>Desactivar animaciones</span>
        </label>
      </div>
    </main>
  )
}

export default AccessibilityPage
