import { Request, Response } from 'express';
import { HexString } from '../utils';

export function serveRequest(
    req: Request,
    res: Response,
    runFunction: (id: any, body: any) => Promise<any>,
    successReturnCode: number = 200,
    defaultReturnCode: number = 500
) {
    console.log('request received: ', JSON.stringify(req.body));

    const onError = (e: any) => {
        console.error(e);
        res.status(defaultReturnCode).json({
            msg: 'Internal server error',
        });
    };

    try {
        runFunction(req.params.id, req.body)
            .then((output) => {
                if (output) res.status(successReturnCode).json(output);
            })
            .catch((e) => {
                onError(e);
            });
    } catch (e) {
        console.log(e);
    }
}

export function validateRequiredHexString(
    res: Response,
    str: HexString,
    name: string
): boolean {
    //TODO: check also for zero address
    if (!str || !str.trim().length || str.trim() === '0x0') {
        res.status(400).json({
            msg: `Required: ${name}`,
        });
        return false;
    }
    return true;
}

export function validateRequiredString(
    res: Response,
    str: string,
    name: string
): boolean {
    //TODO: check also for zero address
    if (!str || !str.trim().length) {
        res.status(400).json({
            msg: `Required: ${name}`,
        });
        return false;
    }
    return true;
}

export function validateStoreIdAndKeycard(
    res: Response,
    input: { storeId: HexString; keycard: HexString }
): boolean {
    if (!validateRequiredHexString(res, input.keycard, 'keycard')) {
        return false;
    }
    if (!validateRequiredHexString(res, input.storeId, 'storeId')) {
        return false;
    }
    return true;
}

export const ENDPOINT = 'relay-beta.mass.market/v2';
