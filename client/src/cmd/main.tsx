import './index.scss'
import { h, render } from 'preact'
import { AppContext } from './contexts/app.tsx'
import { HomeView } from './views/home/home.tsx'

// DI system using React context
const provider = new Map()

function App() {
  return (
    <AppContext.Provider value={provider}>
      <HomeView />
    </AppContext.Provider>
  )
}

render(<App />, document.querySelector('#root')!)

console.log()