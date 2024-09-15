import './home.scss'
import { servicesFeedsPhotosPublicGet } from '../../../platform/flickr-api/services-feeds-photos-public-get.ts';
import { h, Fragment } from "preact";
import { makeObservable, kind } from '../../../platform/rx/index.ts'
import { useViewModel } from '../../../platform/rx/preact.ts';
import { Spinner } from '../../components/spinner/spinner.tsx';
import { classNames } from '../../../platform/preact/class-names.ts';

export class HomeViewModel {
  images: string[]
  isLoading: boolean
  initialLoad: boolean
  thing: any

  constructor() {
    this.images = []
    this.isLoading = false
    this.initialLoad = true

    makeObservable(this, {
      images: kind.array,
      isLoading: kind.value,
      initialLoad: kind.value,
    })
  }

  async onInit() {
    await this.fetchMore()
    this.initialLoad = false
  }

  async fetchMore() {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const response = await servicesFeedsPhotosPublicGet()
    for (const item of response.items) {
      this.images.push(item.media.m)
    }
    this.isLoading = false
  }
}

export function HomeView() {
  const vm = useViewModel(() => new HomeViewModel)

  return (
    <Fragment>
      <nav class="navbar">
        <div className="content-max-width">
          <div>
            <div class="logo">snickr</div>
          </div>
          <div>
            <input class="search" type="text" placeholder="🔍 Search" />
          </div>
        </div>
      </nav>
      <main class="view-home content-max-width">
        <h1>Explore</h1>

        {vm.isLoading && vm.images.length === 0 && (
          <div class="spinner-container">
            <Spinner>Loading...</Spinner>
          </div>
        )}

        <section class="images">
          {vm.images.map((image, i) => (
            <div class="image">
              <img loading="lazy" key={i} src={image} />
            </div>
          ))}
        </section>
      </main>

      <footer className="load-more">
        <button 
          className={classNames({ loading: !vm.initialLoad && vm.isLoading })}
          onClick={() => vm.fetchMore()}
          disabled={vm.isLoading}
          >Load More 🚀</button>
      </footer>
    </Fragment>)
}
