# **AutoScaleHost** ☁️

**Author:** Sanya Sinha
AutoScaleHost is a powerful one-click Infrastructure as Code (IaC) platform to deploy scalable web hosting environments on Microsoft Azure using Terraform, wrapped in an intuitive frontend interface with a connected Node.js backend.


## ⚙️ Features 
- Environment Selection: Dev, UAT, or Prod
- Dynamic VM provisioning with Terraform on Azure
- Azure Load Balancer integration
- Apache web server setup with VM
- Interactive Deployment UI (Progress bar, status, logs, results)
- Full-stack integration: HTML/CSS/JS (frontend) + Node.js (backend) + Terraform (infrastructure)

## 🌐 Tech Stack 
| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Frontend      | HTML, CSS, Vanilla JS             |
| Backend       | Node.js, Express.js               |
| Infra as Code | Terraform                         |
| Cloud         | Microsoft Azure                   |
| OS/Runtime    | Ubuntu 20.04 on Azure VMs, Apache |

## ✅ Prerequisites
Before running AutoScaleHost, make sure the following tools are installed:
| Tool                                                                       | Version | Install Guide                         |
| -------------------------------------------------------------------------- | ------- | ------------------------------------- |
| [Node.js](https://nodejs.org/)                                             | >= v14  | `npm install -g node`                 |
| [Terraform](https://developer.hashicorp.com/terraform/downloads)           | >= 1.3  | `brew install terraform` or apt/choco |
| [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) | latest  | `az login` to authenticate with Azure |

Also ensure you have:
- An Azure subscription (here, we have used Student Subscription)
- A Terraform Service Principal configured for authentication
- Node & Terraform properly added to your system PATH

## 🖥️ How to Run 
1. Clone repository
   ```bash
   git clone https://github.com/SanyaSinha11/AutoScaleHost-Automated_Web_Hosting_Solution.git
   cd AutoScaleHost-Automated_Web_Hosting_Solution
   ```

2. Install backend dependencies
3. Configure Azure Credentials for Terraform:
   Before deploying infrastructure, create a file terraform/backend.tf and configure your Azure backend (optional but recommended). Authenticate with Azure:
   ```bash
   az login
   ```
   Ensure your main.tf contains:
   ```bash
   provider "azurerm" {
     features {}
   }
   ```

4. Start the Full Stack Application
   ```bash
   npm start
   ```
   Visit the UI at: http://localhost:5000

## ⚙️ Deployment Flow
1. Choose the environment (Dev/UAT/Prod) from the UI.
2. Click "Deploy".
3. Backend will:
   - Trigger Terraform init & apply
   - Use the selected *.tfvars file (dev.tfvars, uat.tfvars, etc.)
4. Progress bar and deployment logs are shown on the frontend.
5. Once complete, the UI shows:
   - Load Balancer IP
   - Public VM IPs
   - Deployment time
   - Clickable website link

## 💻 UI
<img width="1855" height="836" alt="image" src="https://github.com/user-attachments/assets/bd8f5748-5c7e-4486-b2a0-dbbfe3fec3f0" />

## 🧪 Customizing for Your System
If you're running this project on your own system or server:
1. Update Azure variables in:
   - dev.tfvars, uat.tfvars, prod.tfvars inside terraform/
   - Update with your Azure region, resource group, VM size, etc.
2. Ensure Node.js has access to Terraform binary via PATH.
   ```Example
   export PATH=$PATH:/usr/local/bin/terraform
   ```
3. Modify backend/index.js if:
   - Terraform is installed in a non-default path
   - You want to modify environment logic or file structure

## 🐞 Troubleshooting
| Problem                   | Solution                                                              |
| ------------------------- | --------------------------------------------------------------------- |
| UI loads but Deploy fails | Check Terraform path, Azure credentials, or missing `*.tfvars` files  |
| `Cannot GET /` error      | Ensure you're serving UI from Express using `res.sendFile()`          |
| Port already in use       | Kill the process on port 5000: `lsof -i :5000` / `npx kill-port 5000` |
| PathToRegexp error        | Fix malformed route in backend like `app.get('/:')`                   |

```Example
cd terraform
terraform init
terraform apply -var-file="dev.tfvars"
```


© 2025 AutoScaleHost. All rights reserved.
