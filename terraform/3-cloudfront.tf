locals {
  s3_origin_id = var.bucket_name
  flikr_origin_id = "flickr"
}

resource "aws_cloudfront_origin_access_identity" "bucket_oai" {}

resource "aws_cloudfront_distribution" "website_cloudfront" {
  enabled = true
  wait_for_deployment = false

  origin {
    domain_name = aws_s3_bucket_website_configuration.s3_website.website_endpoint
    origin_id   = var.bucket_name
    
    custom_origin_config {
      http_port = "80"
      https_port = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = "www.flickr.com"
    origin_id   = local.flikr_origin_id
    
    custom_origin_config {
      http_port = "80"
      https_port = "443"
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/api/flickr/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.flikr_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = false
    viewer_protocol_policy = "redirect-to-https"

    function_association {
      event_type = "viewer-request"
      function_arn = aws_cloudfront_function.flickr_viewer_request.arn
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  is_ipv6_enabled = false

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_function" "flickr_viewer_request" {
  name    = "flickr_viewer_request"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/flickr-viewer-request.js")
}

output "website_url" {
  value = "http://${aws_cloudfront_distribution.website_cloudfront.domain_name}"
}