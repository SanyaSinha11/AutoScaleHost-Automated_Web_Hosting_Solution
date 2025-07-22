output "nic_ids" {
  value = azurerm_network_interface.nic[*].id
}

output "public_ip_id" {
  value = azurerm_public_ip.publicip[0].id
}

output "public_ips" {
  value = azurerm_public_ip.publicip[*].ip_address
}