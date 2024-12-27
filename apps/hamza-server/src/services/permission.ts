import { TransactionBaseService } from '@medusajs/medusa';
import { Permission } from '../models/permission';
import PermissionRepository from '../repositories/permission';

export type CreatePayload = Pick<Permission, 'name' | 'metadata'>;

type InjectedDependencies = {
    permissionRepository: typeof PermissionRepository;
};

class PermissionService extends TransactionBaseService {
    protected readonly permissionRepository_: typeof PermissionRepository;

    constructor(container: InjectedDependencies) {
        super(container);
        this.permissionRepository_ = container.permissionRepository;
    }

    async create(data: CreatePayload) {
        // omitting validation for simplicity
        return this.atomicPhase_(async (manager) => {
            const permissionRepo = manager.withRepository(
                this.permissionRepository_
            );
            const permission = permissionRepo.create(data);

            const result = await permissionRepo.save(permission);

            return result;
        });
    }
}

export default PermissionService;
