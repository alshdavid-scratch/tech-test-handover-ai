terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  cloud { 
    organization = "alshdavid"

    workspaces { 
      name = "tech-test-handover-ai" 
    } 
  } 

  required_version = "~> 1.0"
}

provider "aws" {
  region = "ap-southeast-2"
}

data "aws_region" "current" {}
