<!--
SPDX-FileCopyrightText: 2024 Mass Labs

SPDX-License-Identifier: MIT
-->

# DESCRIPTION

A TS library that implements a basic relay client. This is designed to handle commincation to the relay and also handle some interaction with the smart contract.

# TEST

The tests need a relay to test against. Relay setup is in the `relay` repo.
The tests also need anvil or a testnet with the smart contract deployed. Assuming you are in the nix dev shell, run `run-and-deploy` to start anvil and deploy the smart contract locally.

```bash
pnpm test
```

Test in browser

```bash
pnpm test:browser
```

Browser tests results are in the browser's console.

# LICENCE

Mozilla Public License
Version 2.0
