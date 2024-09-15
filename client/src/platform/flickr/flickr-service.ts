import { servicesFeedsPhotosPublicGet } from "../flickr-api/services-feeds-photos-public-get.ts"

export class FlickrService {
  windowRef: Window

  constructor(
    windowRef: Window
  ) {
    this.windowRef = windowRef
  }

  async getFeed(query?: string) {
    if (!query) {
      return servicesFeedsPhotosPublicGet(this.windowRef)
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
    }

    return await servicesFeedsPhotosPublicGet(this.windowRef, {
      tags,
      ids: users
    })
  }
}