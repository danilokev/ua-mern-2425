import { useState } from 'react'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí puedes integrar backend o servicio de envío
    console.log('Formulario enviado:', formData)
    alert('Gracias por tu mensaje. ¡Te responderemos pronto!')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <main className="contact-page">
      <h2>Contacto</h2>
      <p>¿Tienes preguntas, sugerencias o comentarios? Escríbenos.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Correo electrónico:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mensaje:
          <textarea
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Enviar mensaje</button>
      </form>
    </main>
  )
}

export default ContactPage
