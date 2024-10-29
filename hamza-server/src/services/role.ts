import { TransactionBaseService } from '@medusajs/medusa';
import { Role } from '../models/role';
import RoleRepository from '../repositories/role';
import PermissionService, {
    CreatePayload as PermissionCreatePayload,
} from './permission';
import UserService from './user';

type CreatePayload = Pick<Role, 'name' | 'store_id'> & {
    permissions?: PermissionCreatePayload[];
};

type InjectedDependencies = {
    roleRepository: typeof RoleRepository;
    permissionService: PermissionService;
    userService: UserService;
};

class RoleService extends TransactionBaseService {
    protected readonly roleRpository_: typeof RoleRepository;
    protected readonly permissionService_: PermissionService;
    protected readonly userService_: UserService;

    constructor(container: InjectedDependencies) {
        super(container);

        this.roleRpository_ = container.roleRepository;
        this.permissionService_ = container.permissionService;
        this.userService_ = container.userService;
    }

    async retrieve(id: string): Promise<Role> {
        // for simplicity, we retrieve all relations
        // however, it's best to supply the relations
        // as an optional method parameter
        const roleRepo = this.manager_.withRepository(this.roleRpository_);
        return roleRepo.findOne({
            where: {
                id,
            },
            relations: ['permissions', 'store', 'users'],
        });
    }

    async create(data: CreatePayload): Promise<Role> {
        return this.atomicPhase_(async (manager) => {
            // omitting validation for simplicity
            const { permissions: permissionsData = [] } = data;
            delete data.permissions;

            const roleRepo = manager.withRepository(this.roleRpository_);
            const role = roleRepo.create(data);

            role.permissions = [];

            for (const permissionData of permissionsData) {
                role.permissions.push(
                    await this.permissionService_.create(permissionData)
                );
            }
            const result = await roleRepo.save(role);

            return await this.retrieve(result.id);
        });
    }

    async associateUser(role_id: string, user_id: string): Promise<Role> {
        return this.atomicPhase_(async () => {
            // omitting validation for simplicity
            await this.userService_.update(user_id, {
                role_id,
            });

            return await this.retrieve(role_id);
        });
    }
}

export default RoleService;
