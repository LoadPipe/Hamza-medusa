import { Lifetime } from "awilix";
import { UserService as MedusaUserService } from "@medusajs/medusa";
import { User } from "../models/user";
import { CreateUserInput as MedusaCreateUserInput } from "@medusajs/medusa/dist/types/user";
import StoreRepository from "../repositories/store";

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

  async create(user: CustomUserInput, password: string): Promise<User> {
    if (!user.store_id) {
      const storeRepo = this.manager_.withRepository(this.storeRepository_);
      let newStore = storeRepo.create();
      newStore = await storeRepo.save(newStore);
      user.store_id = newStore.id;
    }

    return await super.create(user, password);
  }

  async delete(id: string): Promise<void> {
    // Deletes a user from a given user id.
  }
}

export default UserService;
