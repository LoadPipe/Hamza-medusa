import * as process from 'node:process';

class Config {
    public static get(): Config {
        return process.env.MASSMARKET_THING;
    }
}
