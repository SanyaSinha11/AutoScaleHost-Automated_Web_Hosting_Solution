# AutoScaleHost
**Author:** Sanya Sinha

A one-click Infrastructure as Code (IAC) web hosting solution for Azure using Terraform.


## Features
- Deploy web servers in Dev, UAT, or Prod
- Azure Load Balancer integration
- Apache web server setup with VM

## Technologies
- Azure Cloud
- Terraform
- Bash scripting

## How to Run
1. Clone repo
2. Go to `terraform` folder
3. Run:
   ```bash
   terraform init
   terraform apply -var-file="dev.tfvars"
   ```

## 📦 GitHub Submission Guide
1. Initialize Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AutoScaleHost"
   ```

2. Push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/AutoScaleHost.git
   git push -u origin main
   ```
