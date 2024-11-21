import './App.css'
import mapPlaceholder from './assets/map_placeholder.png';

function App() {
  return (
    <>
      <h1 className="title">E-Comm</h1>

      <div className = "map">
        <img src={mapPlaceholder} alt='Map'></img>
      </div>

      <section className='list'>
        <ul className='emergencies'>
          <li>Emergency 1 Component</li>
          <li>Emergency 2 Component</li>
          <li>Emergency 3 Component</li>
        </ul>
      </section>
      
      {/* Put form component here */}
    </>
  )
}

export default App
