import {
    type MiddlewaresConfig,
    type User,
    type UserService,
    type MedusaNextFunction,
    type CustomerService,
    type MedusaRequest,
    type MedusaResponse,
    authenticateCustomer,
    Logger,
    generateEntityId,
} from '@medusajs/medusa';
import { asyncLocalStorage, sessionStorage } from '../utils/context';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000';
const ADMIN_CORS =
    process.env.ADMIN_CORS || 'http://localhost:7001;http://localhost:7000';
const registerLoggedInUser = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    const logger = req.scope.resolve('logger') as Logger;

    logger.debug('running logged in user function');
    let loggedInUser: User | null = null;

    if (req.user && req.user.userId) {
        const userService = req.scope.resolve('userService') as UserService;
        loggedInUser = await userService.retrieve(req.user.userId);
    }

    req.scope.register({
        loggedInUser: {
            resolve: () => loggedInUser,
        },
    });

    next();
};

const registerLoggedInCustomer = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    const jwtToken: any = jwt.decode(req.headers.authorization);
    const customerId = jwtToken?.customer_id;

    asyncLocalStorage.run(new Map(), () => {
        sessionStorage.customerId = customerId ?? 'unknown';
        sessionStorage.requestId = generateEntityId();
        sessionStorage.sessionId = '';
        next();
    });
};

const restrictLoggedInCart = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    let authorized = false;
    const logger = req.scope.resolve('logger');

    const cart_id = req.query.id || req.headers.id || req.url.split('/')[1]; // Assuming cart_id is the 4th part of the URL
    const cartService = req.scope.resolve('cartService');
    if (!cart_id) {
        res.status(401).json({ status: false });
        return;
    }

    const cart = await cartService.retrieve(cart_id);
    if (cart.customer_id === null) {
        next();
        authorized = true;
    }
    // Check for LOGGED IN
    if (req.headers.authorization) {
        const jwtToken: any = jwt.decode(
            req.headers.authorization.replace('Bearer ', '')
        );
        const customerId = jwtToken?.customer_id;

        if (cart_id) {
            // Check if NOT anonymous cart first...
            if (cart_id === cart.id && customerId === cart.customer_id) {
                next();
                authorized = true;
            }
        }
    }

    if (!authorized) {
        res.status(401).json({ status: false });
        return;
    }
};

const restrictLoggedInCustomerById = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    if (req.url.includes('/token')) {
        return next(); // Skip the middleware if the URL is /token
    }
    let authorized = false;
    if (req.headers.authorization) {
        const logger = req.scope.resolve('logger');
        const jwtToken: any = jwt.decode(
            req.headers.authorization.replace('Bearer ', '')
        );
        const customerId = jwtToken?.customer_id;
        logger.debug(`customer id in store/auth route is ${customerId}`);

        const email = req.query.email || req.headers.email || req.url;
        logger.debug(`email ${email}`);
        if (email && customerId?.length) {
            const customerService = req.scope.resolve('customerService');
            const customer = await customerService.retrieve(customerId);

            if (customer?.id === customerId && email === customer.email) {
                authorized = true;
                return res.status(200).json({ exists: true });
            }
        }
    }

    if (!authorized) {
        res.status(401).json({ status: false });
        return;
    }
};

const restrictCustomerOrders = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    let authorized = false;
    if (req.headers.authorization) {
        const logger = req.scope.resolve('logger');
        const jwtToken: any = jwt.decode(
            req.headers.authorization.replace('Bearer ', '')
        );
        const customerId = jwtToken?.customer_id;
        logger.debug(`customer id in store/orders route is ${customerId}`);

        const orderId = req.url.replace('/', '');
        if (orderId && orderId.startsWith('order_') && customerId?.length) {
            const orderService = req.scope.resolve('orderService');
            const order = await orderService.retrieve(orderId);
            logger.debug(
                `order customer id in store/orders route is ${order?.customer_id}`
            );
            if (order?.customer_id === customerId) {
                next();
                authorized = true;
            }
        }
    }

    if (!authorized) {
        res.status(401).json({ status: false });
        return;
    }
};

export const permissions = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    if (!req.user || !req.user.userId) {
        next();
        return;
    }
    // retrieve currently logged-in user
    const userService = req.scope.resolve('userService') as UserService;
    const loggedInUser = await userService.retrieve(req.user.userId, {
        select: ['id'],
        relations: ['team_role', 'team_role.permissions'],
    });

    if (!loggedInUser.team_role) {
        // considered as super user
        next();
        return;
    }

    const isAllowed = loggedInUser.team_role?.permissions.some((permission) => {
        const metadataKey = Object.keys(permission.metadata).find(
            (key) => key === req.path
        );
        if (!metadataKey) {
            return false;
        }

        // boolean value
        return permission.metadata[metadataKey];
    });

    if (isAllowed) {
        next();
        return;
    }

    // deny access
    res.sendStatus(401);
};

export const config: MiddlewaresConfig = {
    routes: [
        {
            matcher: '/admin/products',
            middlewares: [registerLoggedInUser],
        },
        {
            matcher: '/admin/auth',
            middlewares: [
                cors({
                    origin: [
                        STORE_CORS,
                        'http://localhost:7001',
                        'http://localhost:7000',
                        'http://localhost:9000', // TEST ENV
                    ],
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/admin/collections',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/admin/*',
            middlewares: [
                cors({
                    origin: [
                        'http://localhost:7001',
                        'http://localhost:7000',
                        STORE_CORS,
                    ],
                    credentials: true,
                }),
                [permissions],
            ],
        },
        {
            matcher: '/custom/*',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
                registerLoggedInCustomer,
            ],
        },
        {
            matcher: '/admin/currencies',
            middlewares: [
                cors({
                    origin: '*',
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/store/orders',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
                restrictCustomerOrders,
            ],
        },

        {
            matcher: '/store/order-edits',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
                restrictCustomerOrders,
            ],
        },
        {
            matcher: '/store/payment-collection',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
                restrictCustomerOrders,
            ],
        },
        {
            matcher: '/store/returns',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
                restrictCustomerOrders,
            ],
        },
        {
            matcher: '/store/auth',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
                restrictLoggedInCustomerById,
            ],
        },

        {
            matcher: '/store/carts',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
                restrictLoggedInCart,
            ],
        },

        // {
        //     matcher: '/custom/confirmation-token/generate',
        //     // middlewares: [authenticateCustomer(), registerLoggedInCustomer],
        // },
    ],
};
