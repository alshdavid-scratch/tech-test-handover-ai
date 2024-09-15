set windows-shell := ["pwsh", "-NoLogo", "-NoProfileLoadTime", "-Command"]

build:
  cd client && just build

dev:
  cd client && just dev

test:
  cd client && just test

deploy *ARGS:
  cd terraform && terraform init && terraform validate && terraform apply {{ARGS}}