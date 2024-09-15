import { beforeEach, describe, test } from 'node:test'
import * as assert from 'node:assert'
import { HomeViewModel } from './home.tsx'
import { FlickrService } from '../../../platform/flickr/flickr-service.ts'
import { MockedInterface, mockInterface } from '../../../platform/testing/dynamic-mock.ts'

describe('HomeViewModel', () => {
  let flickrService: MockedInterface<FlickrService>

  beforeEach(() => {
    flickrService = mockInterface()
  })

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
  })
})