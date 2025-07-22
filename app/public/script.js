// Application State
let selectedEnv = 'dev';
let deploymentStatus = 'idle'; // 'idle', 'deploying', 'success', 'error'
let deploymentResult = null;
let deploymentProgress = 0;

// Environment Configuration
const environmentConfig = {
    dev: { 
        name: 'Development', 
        vmInstances: 2
    },
    uat: { 
        name: 'UAT', 
        vmInstances: 2
    },
    prod: { 
        name: 'Production', 
        vmInstances: 3
    }
};

// DOM Elements
const envOptions = document.querySelectorAll('.env-option');
const deployButton = document.getElementById('deployButton');
const selectedEnvName = document.getElementById('selectedEnvName');
const deployButtonEnv = document.getElementById('deployButtonEnv');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const deploymentResults = document.getElementById('deploymentResults');
const infrastructureDiagram = document.getElementById('infrastructureDiagram');

// Result elements
const websiteUrl = document.getElementById('websiteUrl');
const websiteUrlText = document.getElementById('websiteUrlText');
const loadBalancerIp = document.getElementById('loadBalancerIp');
const vmInstances = document.getElementById('vmInstances');
const deploymentTime = document.getElementById('deploymentTime');
const vmContainer = document.getElementById('vmContainer');

// Initialize the application
function init() {
    setupEventListeners();
    updateUI();
}

// Setup event listeners
function setupEventListeners() {
    // Environment selection
    envOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (deploymentStatus !== 'deploying') {
                selectEnvironment(option.dataset.env);
            }
        });
    });

    // Deploy button
    deployButton.addEventListener('click', () => {
        if (deploymentStatus === 'success') {
            resetDeployment();
        } else if (deploymentStatus === 'idle') {
            startDeployment();
        }
    });
}

// Select environment
function selectEnvironment(env) {
    selectedEnv = env;
    updateUI();
}

// Update UI based on current state
function updateUI() {
    // Update environment selection
    envOptions.forEach(option => {
        option.classList.remove('selected');
        if (deploymentStatus === 'deploying') {
            option.classList.add('disabled');
        } else {
            option.classList.remove('disabled');
        }
        
        if (option.dataset.env === selectedEnv) {
            option.classList.add('selected');
        }
    });

    // Update environment name displays
    const envName = environmentConfig[selectedEnv].name;
    selectedEnvName.textContent = envName;
    deployButtonEnv.textContent = envName;

    // Update deploy button
    updateDeployButton();

    // Show/hide progress container
    if (deploymentStatus === 'deploying') {
        progressContainer.classList.remove('hidden');
    } else {
        progressContainer.classList.add('hidden');
    }

    // Show/hide results
    if (deploymentStatus === 'success') {
        deploymentResults.classList.remove('hidden');
        infrastructureDiagram.classList.remove('hidden');
        updateResults();
    } else {
        deploymentResults.classList.add('hidden');
        infrastructureDiagram.classList.add('hidden');
    }
}

// Update deploy button appearance and text
function updateDeployButton() {
    deployButton.classList.remove('success');
    
    if (deploymentStatus === 'deploying') {
        deployButton.disabled = true;
        deployButton.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Deploying...
        `;
    } else if (deploymentStatus === 'success') {
        deployButton.disabled = false;
        deployButton.classList.add('success');
        deployButton.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Deploy New Environment
        `;
    } else {
        deployButton.disabled = false;
        deployButton.innerHTML = `
            <i class="fas fa-cloud"></i>
            Deploy to ${environmentConfig[selectedEnv].name}
        `;
    }
}

// Start deployment process
async function startDeployment() {
    deploymentStatus = 'deploying';
    deploymentProgress = 0;
    deploymentResult = null;
    updateUI();

    updateProgress(); // initialize progress

    try {
        // Send request to backend
        const response = await fetch('http://localhost:5000/api/deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ environment: selectedEnv })
        });

        if (!response.ok) throw new Error('Deployment failed.');

        const data = await response.json();

        // Simulate progress
        const steps = 6;
        for (let i = 0; i < steps; i++) {
            await sleep(700);
            deploymentProgress = ((i + 1) / steps) * 100;
            updateProgress();
        }

        // Set deployment result
        deploymentResult = {
            websiteUrl: data.websiteUrl,
            loadBalancerIp: data.vmIps[0] || 'Unknown',
            vmInstances: environmentConfig[selectedEnv].vmInstances,
            deploymentTime: '2m 34s'
        };

        deploymentStatus = 'success';
    } catch (err) {
        console.error('Deployment error:', err);
        deploymentStatus = 'error';
    }

    updateUI();
}


// Update progress bar
function updateProgress() {
    progressFill.style.width = `${deploymentProgress}%`;
    progressText.textContent = `${Math.round(deploymentProgress)}% Complete`;
}

// Complete deployment
function completeDeployment() {
    deploymentStatus = 'success';
    
    // Generate mock deployment result
    deploymentResult = {
        websiteUrl: `https://autoscalehost-${selectedEnv}.azurewebsites.net`,
        loadBalancerIp: '20.62.146.142',
        vmInstances: environmentConfig[selectedEnv].vmInstances,
        deploymentTime: '2m 34s'
    };

    updateUI();
}

// Update results display
function updateResults() {
    if (!deploymentResult) return;

    // Update website URL
    websiteUrl.href = deploymentResult.websiteUrl;
    websiteUrlText.textContent = deploymentResult.websiteUrl;

    // Update other result fields
    loadBalancerIp.textContent = deploymentResult.loadBalancerIp;
    vmInstances.textContent = `${deploymentResult.vmInstances} Active`;
    deploymentTime.textContent = deploymentResult.deploymentTime;

    // Update infrastructure diagram
    updateInfrastructureDiagram();
}

// Update infrastructure diagram
function updateInfrastructureDiagram() {
    if (!deploymentResult) return;

    // Clear existing VMs
    vmContainer.innerHTML = '';

    // Add VM instances
    for (let i = 0; i < deploymentResult.vmInstances; i++) {
        const vmElement = document.createElement('div');
        vmElement.className = 'infra-item';
        vmElement.innerHTML = `
            <div class="infra-icon vm-gradient">
                <i class="fas fa-server"></i>
            </div>
            <div class="infra-name">VM ${i + 1}</div>
            <div class="infra-type">Web Server</div>
        `;
        vmContainer.appendChild(vmElement);
    }
}

// Reset deployment
function resetDeployment() {
    deploymentStatus = 'idle';
    deploymentResult = null;
    deploymentProgress = 0;
    updateUI();
}

// Utility function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);