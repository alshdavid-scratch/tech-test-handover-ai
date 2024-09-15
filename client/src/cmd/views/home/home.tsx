import { servicesFeedsPhotosPublicGet } from '../../../platform/flickr-api/services-feeds-photos-public-get.ts';
import './home.scss'
import { h, Fragment } from "preact";
import { makeObservable, kind, subscribe } from '../../../platform/rx/index.ts'
import { useViewModel } from '../../../platform/rx/preact.ts';

export class HomeViewModel {
  images: string[]
  isLoading: boolean
  thing: any

  constructor() {
    this.images = []
    this.isLoading = false

    makeObservable(this, {
      images: kind.array,
      isLoading: kind.value,
    })
  }

  onInit() {
    this.fetchMore()
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
      <div class="view-home content-max-width">
        <h1>Explore</h1>
        <section class="images">
          {vm.images.map((image, i) => <img key={i} src={image} />)}
        </section>
        {vm.isLoading === false && <button onClick={() => vm.fetchMore()}>Load More</button>}
      </div>
    </Fragment>)
}
