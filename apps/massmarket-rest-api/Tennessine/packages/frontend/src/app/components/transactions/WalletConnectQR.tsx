// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useState, useEffect } from "react";
import { SignClient } from "@walletconnect/sign-client";
import { WalletConnectModal } from "@walletconnect/modal";
import { sepolia, mainnet } from "viem/chains";
import { SignClient as ISignClient } from "@walletconnect/sign-client/dist/types/client";
import { SessionTypes } from "@walletconnect/types";
import Button from "@/app/common/components/Button";

function WalletConnectQR({
  purchaseAddress,
  displayedTotal,
}: {
  purchaseAddress: string;
  displayedTotal: string;
}) {
  const [signClient, setSignClient] = useState<null | ISignClient>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  const [account, setAccount] = useState<[] | string>([]);
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;
  const usedChain: number = chainName === "sepolia" ? sepolia.id : mainnet.id;
  const walletConnectModal = new WalletConnectModal({
    projectId: "6c432edcd930e0fa2c87a8d940ae5b91",
    chains: [`eip155:${usedChain}`],
  });

  useEffect(() => {
    if (account.length) {
      handleSend();
    }
  }, [account.length]);

  async function createClient() {
    try {
      const signClient = await SignClient.init({
        projectId: "6c432edcd930e0fa2c87a8d940ae5b91",
      });
      signClient && setSignClient(signClient);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleConnect() {
    if (!signClient) throw Error("Client is not set");
    try {
      const proposalNamespace = {
        eip155: {
          methods: ["eth_sendTransaction"],
          chains: [`eip155:${usedChain}`],
          events: ["connect", "disconnect"],
        },
      };

      const { uri, approval } = await signClient.connect({
        requiredNamespaces: proposalNamespace,
      });

      if (uri) {
        walletConnectModal.openModal({ uri });
        const sessionNamespace = await approval();
        if (sessionNamespace) {
          setSession(sessionNamespace);
          setAccount(sessionNamespace.namespaces.eip155.accounts[0].slice(9));
        }
        walletConnectModal.closeModal();
      }
    } catch (e) {
      console.log(e);
    }
  }

  // async function handleDisconnect() {
  //   try {
  //     signClient &&
  //       session &&
  //       (await signClient.disconnect({
  //         topic: session.topic,
  //         // @ts-expect-error FIXME
  //         message: "User disconnected",
  //         code: 6000,
  //       }));
  //     reset();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  async function handleSend() {
    if (!account.length) throw Error("No account found");
    try {
      const tx = {
        from: account,
        to: purchaseAddress,
        value: displayedTotal,
      };

      signClient &&
        session &&
        (await signClient.request({
          topic: session.topic,
          chainId: `eip155:${usedChain}`,
          request: {
            method: "eth_sendTransaction",
            params: [tx],
          },
        }));
    } catch (e) {
      console.log(e);
    }
  }

  // const reset = () => {
  //   setAccount([]);
  //   setSession(null);
  // };

  useEffect(() => {
    if (!signClient) {
      createClient();
    }
  }, [signClient]);

  return (
    <div className="mt-2">
      <Button onClick={handleConnect} disabled={!signClient}>
        Connect Wallet
      </Button>
    </div>
  );
}

export default WalletConnectQR;
