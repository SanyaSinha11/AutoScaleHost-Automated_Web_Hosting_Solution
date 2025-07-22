resource "azurerm_resource_group" "rg" {
  name     = "autoscalehost-${var.environment}-rg"
  location = var.location
}

resource "azurerm_virtual_network" "vnet" {
  name                = "autoscalehost-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "autoscalehost-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}