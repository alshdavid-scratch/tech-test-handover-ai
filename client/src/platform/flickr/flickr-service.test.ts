import { beforeEach, describe, test } from 'node:test'
import * as assert from 'node:assert'
import { FlickrService } from './flickr-service.ts'
import { MockedInterface, mockInterface } from '../../../test/dynamic-mock/dynamic-mock.ts'
import { Fetcher } from '../dom/index.ts'

describe('FlickrService', () => {
  let fetcher: MockedInterface<Fetcher>

  beforeEach(() => {
    fetcher = mockInterface()

    // @ts-expect-error
    fetcher.fetch.mock.mockImplementation(() => Promise.resolve({ json: () => Promise.resolve({}) }))
  })

  describe('constructor', () => {
    test('should not throw', () => {
      assert.doesNotThrow(() => new FlickrService(fetcher))
    })
  })

  describe('instance', () => {
    let flickrService: FlickrService

    beforeEach(() => {
      flickrService = new FlickrService(fetcher)
    })

    describe('getFeed', () => {
      test('should call back end', async () => {
        await flickrService.getFeed()
        assert.equal(fetcher.fetch.mock.callCount(), 1)        
      })
    })
  })
})