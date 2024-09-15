locals {
  s3_origin_id = var.bucket_name
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

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.bucket_name

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
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

output "website_url" {
  value = "http://${aws_cloudfront_distribution.website_cloudfront.domain_name}"
}