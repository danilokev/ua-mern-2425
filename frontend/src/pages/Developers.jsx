import alfonso from '../assets/Alfonso.jpg'
import kevin from '../assets/Kevin.jpg'
import mario from '../assets/Mario.jpg'
import marcos from '../assets/Marcos.jpg'

const team = [
  {
    name: 'Alfonso',
    role: 'Frontend Developer',
    img: alfonso,
  },
  {
    name: 'Kevin',
    role: 'Fullstack Developer',
    img: kevin,
  },
  {
    name: 'Mario',
    role: 'Frontend and designer',
    img: mario,
  },
  {
    name: 'Marcos',
    role: 'Asset Developer',
    img: marcos,
  },
]

function DevsPage() {
  return (
    <main className="devs-page">
      <h2>Equipo de desarrollo</h2>
      <section className="devs-grid">
        {team.map((dev) => (
          <article className="dev-card" key={dev.name}>
            <img src={dev.img} alt={`Foto de ${dev.name}`} />
            <h3>{dev.name}</h3>
            <p>{dev.role}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default DevsPage
