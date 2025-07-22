output "lb_name" {
  value = azurerm_lb.lb.name
}

output "lb_public_ip_id" {
  value = azurerm_public_ip.public_ip.id
}

output "backend_address_pool_id" {
  value = azurerm_lb_backend_address_pool.bpepool.id
}


