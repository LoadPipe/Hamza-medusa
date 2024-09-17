import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { MedusaContainer } from '@medusajs/medusa';

export default async (container: MedusaContainer): Promise<void> => {
    const secret_name = 'hamza-server-env-variables';

    const client = new SecretsManagerClient({
        region: 'ap-southeast-2',
    });

    let response;

    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        console.log(error);
        throw error;
    }

    const secretData = JSON.parse(response.SecretString);
    console.log(secretData);

    for (let key of secretData) {
        process.env[key] = secretData[key];
    }
};