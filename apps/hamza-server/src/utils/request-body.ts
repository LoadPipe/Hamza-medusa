export function readRequestBody(body: any, fieldNames: string[]): any {
    const output = {};
    body = JSON.parse(JSON.stringify(body));
    for (const name of fieldNames) {
        output[name] = body[name];
    }
    return output;
}
