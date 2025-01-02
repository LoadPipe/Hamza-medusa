import { Lifetime } from 'awilix';
import { User, UserService as MedusaUserService } from '@medusajs/medusa';
import {
    CreateUserInput as MedusaCreateUserInput,
    UpdateUserInput,
} from '@medusajs/medusa/dist/types/user';
import StoreRepository from '../repositories/store';

interface CustomUserInput extends MedusaCreateUserInput {
    store_id?: string;
}

class UserService extends MedusaUserService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly loggedInUser_: User | null;
    protected readonly storeRepository_: typeof StoreRepository;

    constructor(container) {
        super(container);
        this.storeRepository_ = container.storeRepository;

        try {
            this.loggedInUser_ = container.loggedInUser;
        } catch (e) {
            // avoid errors when backend first runs
        }
    }

    async update(
        userId: string,
        update: UpdateUserInput & {
            role_id?: string;
        }
    ): Promise<User> {
        return super.update(userId, update);
    }

    //   async create(
    //     user: CreateUserInput,
    //     password: string
    //   ): Promise<User> {
    //     if (!user.store_id) {
    //       const storeRepo = this.manager_.withRepository(
    //         this.storeRepository_
    //       )
    //       let newStore = storeRepo.create()
    //       newStore = await storeRepo.save(newStore)
    //       user.store_id = newStore.id
    //     }

    //     return await super.create(user , password)
    //   }
}
export default UserService;
