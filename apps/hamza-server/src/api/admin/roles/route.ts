import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import RoleService from '../../../services/role';
import { readRequestBody } from '../../../utils/request-body';
import { RouteHandler } from '../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const roleService = req.scope.resolve('roleService') as RoleService;

    // omitting validation for simplicity
    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/admin/custom/roles', ['name', 'store_id', 'permissions']
    );

    await handler.handle(async () => {
        const { name, store_id, permissions } = handler.inputParams;

        const role = await roleService.create({
            name,
            store_id,
            permissions,
        });

        res.json(role);
    });
};
