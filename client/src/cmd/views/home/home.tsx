import './home.scss'
import { ServicesFeedsItem, servicesFeedsPhotosPublicGet } from '../../../platform/flickr-api/services-feeds-photos-public-get.ts';
import { h, Fragment } from "preact";
import { makeObservable, kind } from '../../../platform/rx/index.ts'
import { useViewModel } from '../../../platform/rx/preact.ts';
import { Spinner } from '../../components/spinner/spinner.tsx';
import { classNames } from '../../../platform/preact/class-names.ts';
import { format } from 'date-fns'
export class HomeViewModel {
  items: ServicesFeedsItem[]
  isLoading: boolean
  initialLoad: boolean
  thing: any

  constructor() {
    this.items = []
    this.isLoading = false
    this.initialLoad = true

    makeObservable(this, {
      items: kind.array,
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
    console.log(response)
    this.items.push(...response.items)
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

        {vm.isLoading && vm.items.length === 0 && (
          <div class="spinner-container">
            <Spinner>Loading...</Spinner>
          </div>
        )}

        <section class="images">
          {vm.items.map((item) => (
            <a class="image" href={item.link}>
              <div className="inner">
                <div className="banner">
                  <div className="title">{item.title}</div>
                  <div className="author">{item.author}</div>
                  <time datetime={item.published}>Published: {format(item.published, 'dd mm yyyy')}</time>
                  <div className="tags">
                    {item.tags && item.tags.split(' ').map(tag => <div>{tag}</div>)}
                  </div>
                </div>
              </div>
              <img 
                loading="lazy"
                key={item.link} 
                src={item.media.m} />
            </a>
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
