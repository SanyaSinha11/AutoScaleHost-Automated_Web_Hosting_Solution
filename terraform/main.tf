provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  tenant_id       = var.tenant_id
}

resource "azurerm_resource_group" "rg" {
  name     = "autoscalehost-${var.environment}-rg"
  location = var.location
}

module "network" {
  source     = "./modules/network"
  location   = var.location
  environment = var.environment
}

module "compute" {
  source           = "./modules/compute"
  location         = var.location
  environment      = var.environment
  admin_username   = var.admin_username
  admin_password   = var.admin_password
  subnet_id        = module.network.subnet_id
  resource_group   = azurerm_resource_group.rg.name
  startup_script   = filebase64("startup_script.sh")
}

module "loadbalancer" {
  source               = "./modules/loadbalancer"
  location             = var.location
  environment          = var.environment
  public_ip_id = module.loadbalancer.lb_public_ip_id
  backend_nic_ids      = module.compute.nic_ids
  index                = 0
  tags = {
    environment = var.environment
  }
  resource_group = azurerm_resource_group.rg.name
}

output "status" {
  value = "Terraform is running and completed successfully!"
}
