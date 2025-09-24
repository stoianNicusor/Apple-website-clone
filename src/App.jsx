import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Hightlights from './components/Hightlights';
import Model from './components/Model';

const App = () => {

  return (
    <main className="bg-black">
      <Navbar/>
      <Hero/>
      <Hightlights/>
      <Model/>
    </main>
  )
}

export default App
