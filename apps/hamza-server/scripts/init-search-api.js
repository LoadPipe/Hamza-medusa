const fs = require('fs');

function replaceKey(envPath, configKey, newValue) {
    let fullText = fs.readFileSync(envPath, 'utf-8');
    const lines = fullText.split('\n');
    console.log(lines.length);

    for (let n = 0; n < lines.length; n++) {
        const line = lines[n];
        if (line.startsWith(`${configKey}=`)) {
            const oldLine = line;
            const value = line.substring(configKey.length + 1);
            const newLine = line.replace(value, newValue);

            //replace the old key & value
            fullText = fullText.replace(oldLine, newLine);
            console.log(fullText);
            fs.writeFileSync(envPath, fullText);
        }
    }
}

async function main() {
    try {
        //call the api
        const keyResponse = await fetch('http://localhost:7700/keys', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: 'Bearer Pybr4pq4eFjrKVQ79sSUJfp7O8tXNWJj',
            },
        });

        const deleteProductIndex = await fetch('http://localhost:7700/indexes/products/documents', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: 'Bearer Pybr4pq4eFjrKVQ79sSUJfp7O8tXNWJj',
            },
        })
        console.log(await keyResponse);

        //get the key
        const keyData = await keyResponse.json();
        console.log(keyData);
        const frontendApiKey = keyData.results[0].key;
        console.log('frontend api key', frontendApiKey);
        const backendAPIKey = keyData.results[1].key;
        console.log('backend api key', backendAPIKey);

        // write the key to .env
        replaceKey('../hamza-server/.env', 'MEILISEARCH_API_KEY', backendAPIKey);
        replaceKey(
            '../hamza-client/.env.local',
            'NEXT_PUBLIC_SEARCH_API_KEY',
            frontendApiKey
        );
    } catch (e) {
        console.error(e);
    }
}

main();
