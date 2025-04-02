import '../styles/Dashboard.css'
import logo3d from '../assets/3d-icon.png'      // Icono 3D
import logo2d from '../assets/2d-icon.png'      // Icono 2D
import addonIcon from '../assets/addons-icon.png'  // Icono Add-On
import asset1 from '../assets/terreno.png'      // Imagen ejemplo
import asset2 from '../assets/supermario.png'   // Imagen ejemplo

function Dashboard() {
  return (
    <main className="dashboard">
      <header className="section-heading">
        <h1>Assets</h1>
        <p>Categorías principales</p>
      </header>

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading">Categorías</h2>
        <div className="categories">
          <article className="category">
            <img src={logo3d} alt="Icono 3D" />
            <h3>3D</h3>
            <p>Explora modelos y escenas 3D</p>
          </article>

          <article className="category">
            <img src={logo2d} alt="Icono 2D" />
            <h3>2D</h3>
            <p>Descubre ilustraciones y sprites</p>
          </article>

          <article className="category">
            <img src={addonIcon} alt="Icono Add-Ons" />
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
