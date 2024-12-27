# SPDX-FileCopyrightText: 2024 Mass Labs
#
# SPDX-License-Identifier: Unlicense
{
  description = "massmarket-typescript";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts/ac5d0b2d4d51a53a1cd4a4a10d22f4a12c3fe652";
    pre-commit-hooks.url = "github:cachix/pre-commit-hooks.nix";
    pre-commit-hooks.inputs.nixpkgs.follows = "nixpkgs";
    contracts.url = "github:masslbs/contracts";
    contracts.inputs.nixpkgs.follows = "nixpkgs";
    schema = {
      url = "github:masslbs/network-schema/wip/v2";
      flake = false;
    };
  };

  outputs = inputs @ {
    nixpkgs,
    flake-parts,
    schema,
    contracts,
    pre-commit-hooks,
    self,
    ...
  }:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = ["x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin"];
      imports = [
        inputs.pre-commit-hooks.flakeModule
      ];
      perSystem = {
        config,
        pkgs,
        system,
        self',
        ...
      }: {
        pre-commit.settings = {
          src = ./.;
          hooks = {
            alejandra.enable = true;
            prettier.enable = true;
          };
        };
        devShells.default = with pkgs;
          nixpkgs.legacyPackages.${system}.mkShell {
            shellHook = ''
              # these fail if 'nix develop' isnt run from the root of the project
              if [ -d ./packages ]; then
                # todo; maybe linking would be better
                cp ${schema}/testVectors.json ./packages/frontend/test/testVectors.json
                cp $MASS_CONTRACTS_PATH/abi/*.json ./packages/contracts/abi/
                cp $MASS_CONTRACTS_PATH/deploymentAddresses.json ./packages/contracts/
                prettier -w ./packages/frontend/test/testVectors.json ./packages/contracts/deploymentAddresses.json
              fi
            '';

            buildInputs =
              [
                # frontend dependencies
                typescript
                nodejs_latest
                nodePackages.pnpm
                playwright-driver.browsers
                contracts.packages.${system}.default
                reuse
              ]
              ++ config.pre-commit.settings.enabledPackages;

            NETWORK_SCHEMA_PATH = "${schema}";
            MASS_CONTRACTS_PATH = "${contracts.packages.${system}.default}";
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
            PLAYWRIGHT_NODEJS_PATH = "${pkgs.nodejs}/bin/node";
            PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
            PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH = "${pkgs.playwright-driver.browsers}/chromium-1091/chrome-linux/chrome";
          };
      };
    };
}
