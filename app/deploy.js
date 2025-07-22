const { exec } = require('child_process');
const path = require('path');

const terraformDir = path.join(__dirname, '..', 'terraform');

function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(stderr);
                return reject(new Error(stderr || error.message));
            }
            resolve(stdout);
        });
    });
}

async function deploy(env) {
    const validEnvs = ['dev', 'uat', 'prod'];
    if (!validEnvs.includes(env)) {
        throw new Error('Invalid environment: ' + env);
    }

    const tfvarsFile = `${env}.tfvars`;

    try {
        await runCommand('terraform init -input=false', terraformDir);
        await runCommand(`terraform apply -var-file=${tfvarsFile} -auto-approve`, terraformDir);

        const output = await runCommand('terraform output -json', terraformDir);
        const parsedOutput = JSON.parse(output);

        return {
            websiteUrl: parsedOutput.website_url?.value || '',
            loadBalancerIp: parsedOutput.load_balancer_ip?.value || '',
            vmPublicIps: parsedOutput.vm_public_ips?.value || [],
            deploymentTime: '2m 34s' // You can calculate real time if needed
        };
    } catch (err) {
        throw new Error(`Deployment failed: ${err.message}`);
    }
}

module.exports = deploy;
