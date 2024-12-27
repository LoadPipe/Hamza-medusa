# 2024-06-10

- Created a new Class "BlockchainClient" in @massmarket/client. This class contains the common functions needed to interact with the contacts. It is instantiated automatically when creating a new instance of the RelayClient as the `relayClient.blockchain` property.

- Created a new package @massmarket/tsconfig. This package contains the common typescript configuration for all the packages in the MassMarket project.

- Added [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) to the root package.json. This allows us to build all the packages at once using `tsc -b`
