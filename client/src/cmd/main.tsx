import './index.scss'
import { h, render } from 'preact'
import { AppContext } from './contexts/app.tsx'
import { HomeView } from './views/home/home.tsx'
import { FlickrService } from '../platform/flickr/flickr-service.ts'

// DI system using React context
const provider = new Map()

provider.set(FlickrService, new FlickrService(window))

function App() {
  return (
    <AppContext.Provider value={provider}>
      <HomeView />
    </AppContext.Provider>
  )
}

render(<App />, document.querySelector('#root')!)

console.log()