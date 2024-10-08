import { Fetcher } from "../dom/index.ts"
import { servicesFeedsPhotosPublicGet } from "../flickr-api/services-feeds-photos-public-get.ts"

export class FlickrService {
  fetcher: Fetcher

  constructor(
    fetcher: Fetcher
  ) {
    this.fetcher = fetcher
  }

  async getFeed(query?: string) {
    if (!query) {
      return servicesFeedsPhotosPublicGet(this.fetcher)
    }

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

      tags.push(word)
    }

    return await servicesFeedsPhotosPublicGet(this.fetcher, {
      tags,
      ids: users
    })
  }
}