import './home.scss'
import { ServicesFeedsItem, servicesFeedsPhotosPublicGet } from '../../../platform/flickr-api/services-feeds-photos-public-get.ts';
import { h, Fragment } from "preact";
import { makeObservable, kind } from '../../../platform/rx/index.ts'
import { useViewModel } from '../../../platform/rx/preact.ts';
import { Spinner } from '../../components/spinner/spinner.tsx';
import { classNames } from '../../../platform/preact/class-names.ts';
import { format } from 'date-fns'
import { debounce } from '../../../platform/preact/debounce.ts';

export class HomeViewModel {
  items: ServicesFeedsItem[]
  itemsSearch: ServicesFeedsItem[]
  isLoading: boolean
  initialLoad: boolean
  searchLoading: boolean

  constructor() {
    this.items = []
    this.itemsSearch = []
    this.isLoading = false
    this.initialLoad = true
    this.searchLoading = false

    makeObservable(this, {
      items: kind.array,
      itemsSearch: kind.array,
      isLoading: kind.value,
      initialLoad: kind.value,
      searchLoading: kind.value,
    })
  }

  async onInit() {
    await this.fetchFeed()
    this.initialLoad = false
  }

  fetchFeedDebounced = debounce((query: string) => this.fetchFeed(query), 500)

  async search(query: string) {
    if (!query) {
      await this.fetchFeed()
      return
    }
    this.searchLoading = true
    this.fetchFeedDebounced(query)
  }

  async fetchFeed(query?: string) {
    if (this.isLoading) {
      return
    }
    this.isLoading = true

    if (query) {
      this.searchLoading = true

      const tags: string[] = []
      const users: string[] = []
      const words = query.split(' ')
      for (const word of words) {
        if (word.startsWith('#')) {
          tags.push(word.substring(1))
        }

        if (word.startsWith('tag:')) {
          tags.push(word.substring(4))
        }

        if (word.startsWith('user:')) {
          users.push(word.substring(5))
        }
      }

      const response = await servicesFeedsPhotosPublicGet({
        tags,
        ids: users
      })
  
      this.itemsSearch = response.items
    } else {
      this.itemsSearch = []
      const response = await servicesFeedsPhotosPublicGet()
      this.items.push(...response.items)
    }
    
    this.isLoading = false
    this.searchLoading = false
  }
}

export function HomeView() {
  const vm = useViewModel(() => new HomeViewModel)

  return (
    <Fragment>
      <nav class="navbar">
        <div className="content-max-width">
          <div>
            <div class="logo">snickrs</div>
          </div>
          <div className="search">
            
          </div>
        </div>
      </nav>
      <main class="view-home content-max-width">
        <div className="heading">
          <h1>Explore</h1>
          <div className='search'>
            <input 
              type="text" 
              onInput={(e:any) => vm.search(e.target.value)}
              placeholder="🔍 Search - tag:name user:name" />
          
          </div>
        </div>

        {((vm.searchLoading) || (vm.isLoading && vm.items.length === 0)) && (
          <div class="spinner-container">
            <Spinner>Loading...</Spinner>
          </div>
        )}

        <section class="images">
          {!vm.searchLoading && (vm.itemsSearch.length ? vm.itemsSearch : vm.items).map((item) => (
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
          onClick={() => vm.fetchFeed()}
          disabled={vm.isLoading}
          >Load More 🚀</button>
      </footer>
    </Fragment>)
}
