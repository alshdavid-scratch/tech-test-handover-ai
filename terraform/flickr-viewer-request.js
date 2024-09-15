function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.startsWith('/api/flickr/')) {
      request.uri = uri.replace('/api/flickr/', '/');
  }

  return request;
}
