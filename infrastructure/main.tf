import {
  id = "bde07ad246cac0ae6ae68324e6aae341"
  to = cloudflare_account.account
}

resource "cloudflare_account" "account" {
  name = "Fresh.job2390@launi.me's Account"
  type = "standard"
}

resource "cloudflare_d1_database" "wedding-launi-me" {
  for_each = toset(["preview", "production"])

  account_id = cloudflare_account.account.id
  name       = "wedding-launi-me-${each.key}"
}

resource "cloudflare_pages_project" "wedding-launi-me" {
  account_id        = cloudflare_account.account.id
  name              = "wedding-launi-me"
  production_branch = "main"

  source {
    type = "github"

    config {
      owner                         = "lamalex"
      repo_name                     = "wedding-launi-me"
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = ["dev", "preview"]
      preview_branch_excludes       = ["main", "prod"]
    }
  }

  build_config {
    build_command   = "bun run build"
    destination_dir = "dist"
    root_dir        = ""
  }

  deployment_configs {
    preview {
      placement {
        mode = "smart"
      }
      usage_model = "standard"
      environment_variables = {
        ENVIRONMENT        = "preview"
        UPLOADTHING_APP_ID = "0lvautmi1u"
      }
      secrets = {
        UPLOADTHING_SECRET = var.uploadthing_secret_preview
      }
      d1_databases = {
        WEDDING_DB = cloudflare_d1_database.wedding-launi-me["preview"].id
      }
      compatibility_date  = "2024-08-06"
      compatibility_flags = ["nodejs_compat"]
    }
    production {
      placement {
        mode = "smart"
      }
      usage_model = "standard"
      environment_variables = {
        ENVIRONMENT        = "production"
        UPLOADTHING_APP_ID = "f5zzoaqheq"
      }
      secrets = {
        UPLOADTHING_SECRET = var.uploadthing_secret_production
      }
      d1_databases = {
        WEDDING_DB = cloudflare_d1_database.wedding-launi-me["production"].id
      }
      compatibility_date  = "2024-08-06"
      compatibility_flags = ["nodejs_compat"]
    }
  }
}

data "cloudflare_zone" "launi-me" {
  account_id = cloudflare_account.account.id
  name       = "launi.me"
}

resource "cloudflare_record" "wedding-launi-me" {
  zone_id = data.cloudflare_zone.launi-me.id
  name    = "wedding"
  content = "wedding-launi-me.pages.dev"
  type    = "CNAME"
  ttl     = 3600
}

resource "cloudflare_pages_domain" "wedding-launi-me" {
  account_id   = cloudflare_account.account.id
  project_name = cloudflare_pages_project.wedding-launi-me.name
  domain       = cloudflare_record.wedding-launi-me.hostname
}

output "database_id" {
  value = [
    for db in cloudflare_d1_database.wedding-launi-me : {
      "name" : db.name, "id" : db.id
    }
  ]
}
