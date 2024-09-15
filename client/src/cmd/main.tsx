import './index.scss'
import { h, render } from 'preact'
import { AppContext } from './contexts/app.tsx'
import { HomeView } from './views/home/home.tsx'
import { Router, Route } from 'preact-router';
import { RxDb } from '../platform/rx-db/index.ts'
import { NotFoundView } from './views/not-found/not-found.tsx';
// import { servicesFeedsPhotosPublicGet } from '../platform/flickr/services-feeds-photos-public-get.ts';

// DI system using React context
const provider = new Map()

const db = new RxDb()

// provider.set('data', await servicesFeedsPhotosPublicGet())

function App() {
  return (
    <AppContext.Provider value={provider}>
      <HomeView />
    </AppContext.Provider>
  )
}

render(<App />, document.querySelector('#root')!)

console.log()