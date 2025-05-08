import '../styles/Dashboard.css'
import cat3D from '../assets/3d-cat-image.jpg'
import cat2D from '../assets/2d-cat-image.jpg'
import catAddon from '../assets/others-cat-image.jpg'
import asset1 from '../assets/terreno.png'         // Imagen ejemplo
import asset2 from '../assets/supermario.png'      // Imagen ejemplo


function Dashboard() {
  return (
    <main className="dashboard">
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading">Categorías principales</h2>
        <div className="categories">
          <article className="category">
            <img
              src={cat3D}
              alt="Icono 3D"
            />
            <h3>3D</h3>
            <p>Explora modelos y escenas 3D</p>
          </article>

          <article className="category">
            <img src={cat2D} alt="Icono 2D" />
            <h3>2D</h3>
            <p>Descubre ilustraciones y sprites</p>
          </article>

          <article className="category">
            <img src={catAddon} alt="Icono Add-Ons" />
            <h3>Add-Ons</h3>
            <p>Complementos y extras para tu juego</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="new-assets-heading">
        <h2 id="new-assets-heading" className="asset-title">¡Nuevos assets, nuevas aventuras!</h2>
        <div className="assets-grid">
          {[...Array(4)].map((_, i) => (
            <article key={i} className="asset-card">
              <img
                src={i % 2 === 0 ? asset1 : asset2}
                alt={i % 2 === 0 ? 'Imagen de terrenos' : 'Imagen de Super Mario'}
              />
              <h3>{i % 2 === 0 ? 'Terrenos' : 'Super Mario'}</h3>
              <span className="tag">{i % 2 === 0 ? '3D' : '2D'}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Dashboard
