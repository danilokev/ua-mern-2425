import '../Dashboard.css'
import logo3d from '../assets/3d-icon.png'      // Icono 3D
import logo2d from '../assets/2d-icon.png'      // Icono 2D
import addonIcon from '../assets/addons-icon.png'  // Icono Add-On
import asset1 from '../assets/terreno.png'      // Imagen ejemplo
import asset2 from '../assets/supermario.png'   // Imagen ejemplo

function Dashboard() {
  return (
    <div className="dashboard">
      <section className="section-heading">
        <h2>Assets</h2>
        <p>Categorías principales</p>
      </section>

      <section className="categories">
        <div className="category">
          <img src={logo3d} alt="3D" />
          <span>3D</span>
          <p>(Texto categoría)</p>
        </div>
        <div className="category selected">
          <img src={logo2d} alt="2D" />
          <span>2D</span>
          <p>(Texto categoría)</p>
        </div>
        <div className="category">
          <img src={addonIcon} alt="Add-ons" />
          <span>Add-Ons</span>
          <p>(Texto categoría)</p>
        </div>
      </section>

      <h3 className="asset-title">¡Nuevos assets, nuevas aventuras!</h3>

      <section className="assets-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="asset-card">
            <img src={i % 2 === 0 ? asset1 : asset2} alt="Asset" />
            <h4>{i % 2 === 0 ? 'Terrenos' : 'Super Mario'}</h4>
            <span className="tag">{i % 2 === 0 ? '3D' : '2D'}</span>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Dashboard
