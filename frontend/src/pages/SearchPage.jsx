import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import asset1 from '../assets/terreno.png'
import asset2 from '../assets/supermario.png'
import '../styles/index.css'

const allAssets = [
  {
    id: 1,
    title: 'Terrenos',
    tag: '3D',
    image: asset1,
    keywords: ['suelo', 'campo', 'terreno'],
  },
  {
    id: 2,
    title: 'Super Mario',
    tag: '2D',
    image: asset2,
    keywords: ['mario', 'plataforma', 'sprite'],
  },
  {
    id: 3,
    title: 'Terrenos Pro',
    tag: '3D',
    image: asset1,
    keywords: ['terreno', 'paisaje', 'montaña'],
  },
  {
    id: 4,
    title: 'Mario Retro',
    tag: '2D',
    image: asset2,
    keywords: ['sprite', '8bit', 'retro', 'mario'],
  },
]

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function SearchPage() {
  const query = useQuery()
  const keyword = query.get('q')?.toLowerCase() || ''
  const tag = query.get('tag')?.toUpperCase() || ''

  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      const matchesKeyword =
        keyword === '' ||
        asset.title.toLowerCase().includes(keyword) ||
        asset.keywords.some((k) => k.includes(keyword))
      const matchesTag = tag === '' || asset.tag === tag
      return matchesKeyword && matchesTag
    })
  }, [keyword, tag])

  return (
    <main className="search-page">
      <h2>Resultados de búsqueda</h2>
      {filteredAssets.length === 0 ? (
        <p>No se encontraron resultados para tu búsqueda.</p>
      ) : (
        <div className="assets-grid">
          {filteredAssets.map((asset) => (
            <article key={asset.id} className="asset-card">
              <img src={asset.image} alt={`Imagen de ${asset.title}`} />
              <h3>{asset.title}</h3>
              <span className="tag">{asset.tag}</span>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default SearchPage
