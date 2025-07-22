resource "azurerm_public_ip" "public_ip" {
  name                = "autoscalehost-lb-pubip"
  location            = var.location
  resource_group_name = var.resource_group  
  allocation_method   = "Static"
  sku                 = "Standard"
  tags                = var.tags
}

resource "azurerm_lb" "lb" {
  name                = "autoscalehost-lb"
  location            = var.location
  resource_group_name = var.resource_group  
  sku                 = "Standard"

  frontend_ip_configuration {
    name                 = "PublicIPAddress"
    public_ip_address_id = azurerm_public_ip.public_ip.id
  }

  tags = var.tags
}

resource "azurerm_lb_backend_address_pool" "bpepool" {
  name            = "backend-pool-${var.environment}"
  loadbalancer_id = azurerm_lb.lb.id
}

resource "azurerm_network_interface_backend_address_pool_association" "nic_assoc" {
  count                   = length(var.backend_nic_ids)
  network_interface_id    = var.backend_nic_ids[count.index]
  ip_configuration_name   = "internal"  # MUST match ip_configuration name in compute module
  backend_address_pool_id = azurerm_lb_backend_address_pool.bpepool.id
}
