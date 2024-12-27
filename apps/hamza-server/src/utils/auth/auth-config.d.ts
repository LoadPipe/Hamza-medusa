import { SoftDeletableEntity } from "@medusajs/medusa";
import { UserRoles } from "../../services/Auth/auth";
import { TransactionBaseService } from "@medusajs/medusa/dist/interfaces";
import { AnalyticsConfig } from "@medusajs/medusa/dist/models";
import {
  CreateAnalyticsConfig,
  UpdateAnalyticsConfig,
} from "@medusajs/medusa/dist/types/analytics-config";
import { AnalyticsConfigRepository as AnalyticsRepository } from "@medusajs/medusa/dist/repositories/analytics-config";
import { EntityManager } from "typeorm";

export declare enum UserRoles {
  /** The user is an admin.*/
  ADMIN = "admin",
  /*** The user is a team member.*/
  MEMBER = "member",
  /*** The user is a developer.*/
  DEVELOPER = "developer",
}
export declare class User extends SoftDeletableEntity {
  role: UserRoles;
  email?: string;
  first_name?: string;
  last_name?: string;
  /**
   * @apiIgnore
   */
  api_token: string;
  metadata: Record<string, unknown>;
  /**
   * @apiIgnore
   */
  private beforeInsert;
}

type InjectedDependencies = {
  analyticsConfigRepository: typeof AnalyticsRepository;
  manager: EntityManager;
};
export declare class AnalyticsConfigService extends TransactionBaseService {
  constructor({ analyticsConfigRepository }: InjectedDependencies);
  retrieve(userId: string): Promise<AnalyticsConfig>;
  /**
   * Creates an analytics config.
   */
  create(
    wallet_address: string,
    userId: string,
    data: CreateAnalyticsConfig,
  ): Promise<AnalyticsConfig>;
  /**
   * Updates an analytics config. If the config does not exist, it will be created instead.
   */
  update(
    userId: string,
    update: UpdateAnalyticsConfig,
  ): Promise<AnalyticsConfig>;
  /**
   * Deletes an analytics config.
   */
  delete(userId: string): Promise<void>;
}

export interface CreateUserInput {
  id?: string;
  email?: string;
  wallet_address: string;
  first_name?: string;
  last_name?: string;
  api_token?: string;
  role?: UserRoles;
  metadata?: Record<string, unknown>;
}
