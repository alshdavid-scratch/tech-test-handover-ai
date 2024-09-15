export type ServicesFeedsPhotosPublicGetResponse = {
  title: string
  link: string
  description: string
  modified: string // Date "2024-09-15T04:23:14Z"
  generator: string
  items: Array<ServicesFeedsItem>
}

export type ServicesFeedsItem = {
  title: string
  link: string
  media: {
    m: string
  },
  date_taken: string // "2024-09-14T07:22:52-08:00"
  description: string
  published: string
  author: string
  author_id: string
  tags: string
}

export type ServicesFeedsPhotosPublicGetOptions = {
  id?: string
  ids?: string[]
  tags?: string[]
  tagMode?: 'all' | 'any'
}

export function servicesFeedsPhotosPublicGet(options: ServicesFeedsPhotosPublicGetOptions = {}): Promise<ServicesFeedsPhotosPublicGetResponse> {
  const params = new URLSearchParams()
  if (options.id) {
    params.set('id', options.id)
  }

  if (options.ids) {
    params.set('ids', options.ids.join(','))
  }

  if (options.tags) {
    params.set('tags', options.tags.join(','))
  }

  if (options.tagMode) {
    params.set('tagmode', options.tagMode)
  }

  params.set('format', 'json')
  params.set('nojsoncallback', '1')

  return fetch(`/api/flickr/services/feeds/photos_public.gne?${params.toString()}`).then(r => r.json())
}