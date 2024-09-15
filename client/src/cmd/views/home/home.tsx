import './home.scss'
import { ServicesFeedsItem } from '../../../platform/flickr-api/services-feeds-photos-public-get.ts';
import { h, Fragment } from "preact";
import { makeObservable, kind } from '../../../platform/rx/index.ts'
import { useViewModel } from '../../../platform/rx/preact.ts';
import { Spinner } from '../../components/spinner/spinner.tsx';
import { classNames } from '../../../platform/preact/class-names.ts';
import { format } from 'date-fns'
import { debounce } from '../../../platform/preact/debounce.ts';
import { FlickrService } from '../../../platform/flickr/flickr-service.ts';
import { useInject } from '../../contexts/app.tsx';

export class HomeViewModel {
  query: string
  items: ServicesFeedsItem[]
  isLoading: boolean
  initialLoad: boolean
  flickrService: FlickrService

  constructor(
    flickrService: FlickrService
  ) {
    this.query = ''
    this.items = []
    this.isLoading = false
    this.initialLoad = true
    this.flickrService = flickrService

    makeObservable(this, {
      query: kind.value,
      items: kind.array,
      isLoading: kind.value,
      initialLoad: kind.value,
    })
  }

  async onInit() {
    await this.fetchFeed()
    this.initialLoad = false
  }

  fetchFeedDebounced = debounce(() => this.fetchFeed(), 500)

  async search(query: string) {
    this.query = query

    if (!this.query) {
      await this.fetchFeed()
      return
    }

    this.fetchFeedDebounced()
  }

  async fetchFeed() {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    this.items = []
    
    const response = await this.flickrService.getFeed(this.query)
    this.items = response.items

    this.isLoading = false
  }

  async loadMore() {
    const response = await this.flickrService.getFeed(this.query)
    this.items.push(...response.items)
  }
}

export function HomeView() {
  const flickrService = useInject(FlickrService)
  const vm = useViewModel(() => new HomeViewModel(flickrService))

  return (
    <Fragment>
      <nav class="navbar">
        <div className="content-max-width">
          <div>
            <div class="logo">snickrs</div>
          </div>
          <div>
            <a href="https://github.com/alshdavid-scratch/tech-test-handover-ai"><img src="/assets/github.svg" /></a>
          </div>
        </div>
      </nav>
      <main class="view-home content-max-width">
        <div className="heading">
          <h1>Explore</h1>
          <div className='search'>
            <input 
              type="text"
              value={vm.query}
              onInput={(e:any) => vm.search(e.target.value)}
              placeholder="🔍 Search - tag:name user:name" />
          
          </div>
        </div>

        {vm.isLoading && (
          <div class="spinner-container">
            <Spinner>Loading...</Spinner>
          </div>
        )}

        <section class="images">
          {!vm.isLoading && vm.items.map((item) => (
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
          onClick={() => vm.loadMore()}
          disabled={vm.isLoading}
          >Load More 🚀</button>
      </footer>
    </Fragment>)
}
