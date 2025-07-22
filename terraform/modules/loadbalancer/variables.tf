variable "location" {}
variable "environment" {}
variable "public_ip_id" {}
variable "backend_nic_ids" {}
variable "resource_group" {
    description = "Name of the resource group"
    type        = string
}
variable "index" {}
variable "tags" {
  type    = map(string)
  default = {}
}