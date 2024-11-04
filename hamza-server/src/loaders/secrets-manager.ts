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
        if (process.env.USE_AWS_SECRETS) {
            response = await client.send(
                new GetSecretValueCommand({
                    SecretId: secret_name,
                    VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
                })
            );

            const secretData = JSON.parse(response.SecretString);

            for (let key of Object.keys(secretData)) {
                if (!process.env[key]?.length)
                    process.env[key] = secretData[key];
            }
        }
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        console.log(error);
        throw error;
    }
};