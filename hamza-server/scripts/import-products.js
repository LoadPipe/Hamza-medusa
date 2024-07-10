/*
 id                 | character varying        |           | not null | 
 title              | character varying        |           | not null | 
 subtitle           | character varying        |           |          | 
 description        | character varying        |           |          | 
 handle             | character varying        |           |          | 
 is_giftcard        | f                         |           | not null | false
 thumbnail          | character varying        |           |          | 
 collection_id      | character varying        |           |          | 
 discountable       | t                         |           | not null | true
 status             | published                 |           | not null | 'draft'::product_status_enum
 store_id           | character varying        |           |          | 
 
 weight             | integer                  |           |          | 
 length             | integer                  |           |          | 
 height             | integer                  |           |          | 
 width              | integer                  |           |          | 
 hs_code            | character varying        |           |          | 
 origin_country     | character varying        |           |          | 
 mid_code           | character varying        |           |          | 
 material           | character varying        |           |          | 
 deleted_at         | timestamp with time zone |           |          | 
 metadata           | jsonb                    |           |          | 
 
 created_at         | timestamp with time zone |           | not null | now()
 updated_at         | timestamp with time zone |           | not null | now()
 type_id            | character varying        |           |          | 
 external_id        | character varying        |           |          | 
 massmarket_prod_id | character varying        |           |          | 
 */

const fs = require('fs');

function readProductsFromCsv() {
    const file = './data/products.csv';
    const fullText = fs.readFileSync(file, 'utf-8');
    const lines = fullText.split('\n');
    let ignored = false;
    const output = [];

    //read each line
    for (let line of lines) {
        line = line.trim();
        if (line.length > 0) {
            //ignore headers on top
            if (!ignored) {
                ignored = true;
                continue;
            }

            //split into fields
            const fields = line.split(',');
            console.log(fields.length);
            if (fields.length == 10) {
                output.push({
                    store_id: fields[0].trim(),
                    title: fields[1]
                        .trim()
                        .replace('&comma;', ',')
                        .replace('&crlf;', '\n'),
                    subtitle: fields[2]
                        .trim()
                        .replace('&comma;', ',')
                        .replace('&crlf;', '\n'),
                    description: fields[3]
                        .trim()
                        .replace('&comma;', ',')
                        .replace('&crlf;', '\n'),
                    handle: fields[4]
                        .trim()
                        .replace('&comma;', ',')
                        .replace('&crlf;', '\n'),
                    is_giftcard: fields[5].trim(),
                    thumbnail: fields[6].trim(),
                    collection_id: fields[7].trim(),
                    discountable: fields[8].trim(),
                    status: fields[9].trim(),
                });
            }
        }
    }

    return output;
}

async function main() {
    //console.log(readProductsFromCsv());
    try {
        const authResponse = await fetch('http://localhost:9000/admin/auth', {
            method: 'POST',
            body: JSON.stringify({
                email: 'admin@medusa-test.com',
                password: 'supersecret',
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        const authData = await authResponse.json();
        const authCookie = authResponse.headers.get('set-cookie');

        const response = await fetch(
            'http://localhost:9000/admin/custom/product',
            {
                method: 'POST',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    products: [
                        {
                            store_id: 'Legendary Light Design',
                            title: 'INDOOR/OUTDOOR WALL LAMP M - W100 X D4',
                            categories: [
                                {
                                    id: 'pcat_home_lighting',
                                },
                            ],
                            collection_id: 'pcol_lighting',
                            "subtitle": "For stunning indoor & outdoor ambience, this light comes with high-quality Langdon fixtures, a light design, and durable stricture framing.",
                            "description": "<li>M - W100 X D4.5 X H3.6 CMS.<li>L - W200 X D4.5 X H3.6 CMS.<li>S- W30 X D4.5 X H3.6 CMS.<li>S- W30 X D4.5 X H3.6 CMS.<li>NAME : Howet INDOOR/OUTDOOR WALL LAMP<li>CODE : WL-24D&crlf;SIZE :<li>S- W30 X D4.5 X H3.6 CMS.<li>M - W100 X D4.5 X H3.6 CMS.<li>L - W200 X D4.5 X H3.6 CMS.<li>COLOR : METAL BLACK<li>MATERIAL : HIGH QUALITY ALUMINIUM WITH WATERPROOF PROTECTIVE FILM<li>LIGHT SOURCE : LED 9W / 30W/ 60W",
                            "handle": "lld_indout",
                            is_giftcard: false,
                            weight: 260,
                            images: [
                                'http://localhost/Legendary/LLD_indout.png',
                            ],
                            options: [],
                            variants: [
                                {
                                    title: 'White',
                                    prices: [
                                        {
                                            currency_code: 'eth',
                                            amount: 4400000,
                                        },
                                        {
                                            currency_code: 'usdc',
                                            amount: 23000,
                                        },
                                        {
                                            currency_code: 'usdt',
                                            amount: 23000,
                                        },
                                    ],
                                    inventory_quantity: 75,
                                    manage_inventory: true,
                                },
                            ],
                        },
                    ],
                }),
            }
        );
    } catch (e) {
        console.error(e);
    }
}

main();
