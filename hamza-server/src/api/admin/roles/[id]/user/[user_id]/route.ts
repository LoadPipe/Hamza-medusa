import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import RoleService from '../../../../../../services/role';
import { RouteHandler } from '../../../../../route-handler';

// TODO: We can move this to our service layer to keep our route clean,
//  we already have a service layer to create users this can easily be added there
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/admin/custom/roles/user'
    );

    await handler.handle(async () => {
        const { id, user_id } = req.params;

        const roleService = req.scope.resolve('roleService') as RoleService;
        const role = await roleService.associateUser(id, user_id);

        res.json(role);
    });
};
