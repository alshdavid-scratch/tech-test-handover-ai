import { afterEach, beforeEach, describe, test } from 'node:test'
import * as assert from 'node:assert'
import { h, render } from 'preact'
import { HomeViewModel, HomeView } from './home.tsx'
import { FlickrService } from '../../../platform/flickr/flickr-service.ts'
import { MockedInterface, mockInterface } from '../../../../test/dynamic-mock/dynamic-mock.ts'
import { BrowserPage } from '../../../../test/browser/browser.ts'
import { AppContext, ProviderMap } from '../../contexts/app.tsx'

describe('HomeView', () => {
  let flickrService: MockedInterface<FlickrService>

  beforeEach(() => {
    flickrService = mockInterface()
  
    // @ts-expect-error
    flickrService.getFeed.mock.mockImplementation(async (_query: string) => {
      return {
        items: [{
          title: 'test-title',
          link: 'test-link',
          media: {
            m: 'test-media'
          },
          date_taken: '2024-09-14T07:22:52-08:00',
          description: 'test-description',
          published: '2024-09-14T07:22:52-08:00',
          author: 'test-author',
          author_id: 'test-author-id',
          tags: 'test-tag1 test-tag2'
        }]
      }
    })
  })

  describe('HomeViewModel', () => {
    describe('constructor', () => {
      test('should not throw', () => {
        assert.doesNotThrow(() => new HomeViewModel(flickrService))
      })
    })
    
    describe('instance', () => {
      let vm: HomeViewModel

      beforeEach(() => {
        vm = new HomeViewModel(flickrService)
      })

      test('should update state with items list', async () => {
        await vm.fetchFeed()
        assert.ok(vm.items.length >= 1)
      })
    })
  })

  describe('HomeViewComponent', () => {
    let provider: ProviderMap
    let browser: BrowserPage

    beforeEach(async () => {
      provider = new Map()
      browser = new BrowserPage()

      provider.set(FlickrService, flickrService)

      await browser.exec()

      const div = browser.document.createElement('div')
      browser.document.body.appendChild(div)

      // @ts-expect-error
      globalThis.document = browser.document

      render(
        <AppContext.Provider value={provider}>
          <HomeView />
        </AppContext.Provider>, 
        div
      )
    })

    afterEach(async () => {
      await browser.close()
    })

    test('should render', async () => {
      assert.ok(browser.document.body.children.length >= 1)
    })

    test('should render items', async () => {
      await browser.waitForSelector('.image')
      assert.ok(browser.document.body.children.length >= 1)
      
    })
  })
})
