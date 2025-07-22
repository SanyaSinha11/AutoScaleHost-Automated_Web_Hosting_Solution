resource "azurerm_public_ip" "publicip" {
  count               = 2
  name                = "autoscalehost-pubip-${count.index}"
  location            = var.location
  resource_group_name = var.resource_group
  allocation_method   = "Static"
}

resource "azurerm_network_interface" "nic" {
  count               = 2
  name                = "autoscalehost-nic-${count.index}"
  location            = var.location
  resource_group_name = var.resource_group

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet_id
    private_ip_address_allocation = "Dynamic"
    # Comment or remove this:
    # public_ip_address_id         = azurerm_public_ip.vm_public_ip.id
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  count               = 2
  name                = "autoscalehost-${count.index}"
  location            = var.location
  resource_group_name = var.resource_group
  size                = "Standard_B1s"
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  network_interface_ids = [azurerm_network_interface.nic[count.index].id]
  disable_password_authentication = false

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

  os_disk {
    name                 = "autoscalehost-osdisk-${count.index}"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  computer_name  = "autoscalehost-${count.index}"
  custom_data    = var.startup_script
}
