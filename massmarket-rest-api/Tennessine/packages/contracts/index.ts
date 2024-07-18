// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: Unlicense

import addresses from "./deploymentAddresses.json" with { type: "json" };
export { addresses };
import Payments from "./abi/Payments.json" with { type: "json" };
export { Payments };
import PaymentsByAddress from "./abi/PaymentsByAddress.json" with { type: "json" };
export { PaymentsByAddress };
import RelayReg from "./abi/RelayReg.json" with { type: "json" };
export { RelayReg };
import ShopReg from "./abi/ShopReg.json" with { type: "json" };
export { ShopReg };
import ERC20 from "./abi/ERC20.json" with { type: "json" };
export { ERC20 };
import Eddies from "./abi/Eddies.json" with { type: "json" };
export { Eddies };
export const permissions = {
  addPermission: 0,
  removePermission: 1,
  updateRootHash: 2,
  addRelay: 3,
  removeRelay: 4,
  replaceRelay: 5,
  registerUser: 6,
  removeUser: 7,
  publishInviteVerifier: 8,
};
