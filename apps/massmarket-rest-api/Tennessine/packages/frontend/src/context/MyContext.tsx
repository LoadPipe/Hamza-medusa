// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useAccount,
  useEnsName,
  useBalance,
  useEnsAvatar,
  useWalletClient,
} from "wagmi";
import { RelayClient, type WalletClientWithAccount } from "@massmarket/client";
import { hardhat, sepolia, mainnet, type Chain } from "viem/chains";
import { http, createPublicClient, createWalletClient } from "viem";
import { useAuth } from "@/context/AuthContext";
import * as abi from "@massmarket/contracts";
import { IStatus } from "../types";
import { type ClientContext, ShopId } from "./types";
import { privateKeyToAccount } from "viem/accounts";
import { usePathname } from "next/navigation";
import { random32BytesHex } from "@massmarket/utils";

export const MyContext = createContext<ClientContext>({
  walletAddress: null,
  shopId: "0x",
  balance: null,
  avatar: null,
  name: null,
  relayClient: null,
  publicClient: null,
  inviteSecret: null,
  clientWallet: null,
  keyCardEnrolled: false,
  createNewRelayClient: () => null,
  setShopId: () => {},
  setKeyCardEnrolled: () => {},
  setInviteSecret: () => {},
  setRelayClient: () => {},
  setWallet: () => {},
  checkPermissions: () =>
    new Promise(() => {
      return false;
    }),
  getTokenInformation: () =>
    new Promise(() => {
      return { name: "", symbol: "", decimals: 0 };
    }),
});

export const MyContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  if (typeof window == "undefined") {
    console.warn("not a browser session");
    return;
  }
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(
    null,
  );
  const [relayClient, setRelayClient] = useState<RelayClient | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [clientWallet, setWallet] = useState<WalletClientWithAccount | null>(
    null,
  );
  const [inviteSecret, setInviteSecret] = useState<`0x${string}` | null>(null);
  const { address, isConnected } = useAccount();
  const name = useEnsName({ address })?.data || null;
  const ensAvatar = useEnsAvatar({ name: ensName! })?.data;
  const { data: _wallet, status: walletStatus } = useWalletClient();
  const {
    setIsConnected,
    setIsMerchantView,
    setUpdateRootHashPerm,
    isMerchantView,
  } = useAuth();
  const [keyCardEnrolled, setKeyCardEnrolled] = useState<boolean>(false);
  const [shopId, setShopId] = useState<ShopId>(
    (localStorage.getItem("shopId") as ShopId) ||
      (process.env.NEXT_PUBLIC_STORE_ID as ShopId),
  );

  const pathname = usePathname();
  const isDemoStore =
    ![`/merchants/`, `/create-store/`].includes(pathname) && !isMerchantView;

  if (!shopId) {
    throw Error("missing shop ID");
  }
  const savedKC = localStorage.getItem("keyCard") as `0x${string}`;

  useEffect(() => {
    if (savedKC) {
      setKeyCardEnrolled(true);
    }
  }, []);

  let usedChain: Chain;
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;
  switch (chainName) {
    case "hardhat":
      usedChain = hardhat;
      break;
    case "sepolia":
      usedChain = sepolia;
      break;
    case "mainnet":
      usedChain = mainnet;
      break;
    default:
      throw new Error(`unhandled chain name ${chainName}`);
  }

  const publicClient =
    chainName === "sepolia"
      ? createPublicClient({
          chain: usedChain,
          transport: http("https://rpc2.sepolia.org"),
        })
      : createPublicClient({
          chain: usedChain,
          transport: http(),
        });
  const { data } = useBalance({
    address: address as `0x${string}`,
  });

  const getTokenInformation = async (erc20Addr: `0x${string}`) => {
    const name = (await publicClient.readContract({
      address: erc20Addr,
      abi: abi.ERC20,
      functionName: "name",
      args: [],
    })) as string;
    const symbol = (await publicClient.readContract({
      address: erc20Addr,
      abi: abi.ERC20,
      functionName: "symbol",
      args: [],
    })) as string;
    const decimals = (await publicClient.readContract({
      address: erc20Addr,
      abi: abi.ERC20,
      functionName: "decimals",
      args: [],
    })) as number;
    return { name, symbol, decimals };
  };
  useEffect(() => {
    if (_wallet && walletStatus == "success") {
      setWallet(_wallet);
    }
  }, [walletStatus]);

  useEffect(() => {
    if (clientWallet) {
      address && setWalletAddress(address);
      data?.formatted && setBalance(data.formatted);
      ensAvatar && setAvatar(ensAvatar);
      ensName && setEnsName(name);
    }
  }, [isConnected, clientWallet, data, ensAvatar, name]);

  useEffect(() => {
    let keyCard = random32BytesHex();
    if (!keyCardEnrolled && !savedKC) {
      localStorage.setItem("keyCardToEnroll", keyCard);
    } else {
      keyCard = savedKC;
    }
    const privateKey = inviteSecret ? inviteSecret : keyCard;
    const keyCardWallet = privateKeyToAccount(privateKey);
    const user = {
      relayEndpoint:
        process.env.NEXT_PUBLIC_RELAY_ENDPOINT ||
        "wss://relay-beta.mass.market/v1",
      keyCardWallet,
      chain: usedChain,
    };
    const _relayClient = new RelayClient(user);
    setRelayClient(_relayClient);
    (async () => {
      if (!savedKC && isDemoStore && !keyCardEnrolled) {
        console.log("enrolling KC with guest wallet...");
        const guestWallet = createWalletClient({
          account: privateKeyToAccount(random32BytesHex()),
          chain: usedChain,
          transport: http(),
        });
        const res = await _relayClient.enrollKeycard(guestWallet, true, shopId);
        if (res.ok) {
          setKeyCardEnrolled(true);
          privateKey && localStorage.setItem("keyCard", privateKey);
          setIsConnected(IStatus.Complete);
        } else {
          setIsConnected(IStatus.Failed);
          localStorage.removeItem("keyCard");
        }
        localStorage.removeItem("keyCardToEnroll");
      } else if (savedKC && walletAddress) {
        console.log(`connecting to client with KC : ${savedKC}`);
        const hasAccess = await checkPermissions();
        if (hasAccess) {
          setUpdateRootHashPerm(true);
          setIsMerchantView(true);
        }
        setKeyCardEnrolled(true);
      }
    })();

    console.log(`relay client set ${user.relayEndpoint} with shop: ${shopId}`);
  }, [walletAddress]);

  useEffect(() => {
    if (keyCardEnrolled) {
      (async () => {
        console.log("connecting to client...");
        const authenticated = await relayClient!.connect();
        console.log({ authenticated });
        if (authenticated) {
          setIsConnected(IStatus.Complete);
        } else {
          setIsConnected(IStatus.Failed);
        }
      })();
    }
  }, [keyCardEnrolled]);

  const checkPermissions = async () => {
    if (walletAddress) {
      const hasAccess = (await publicClient.readContract({
        address: abi.addresses.ShopReg as `0x${string}`,
        abi: abi.ShopReg,
        functionName: "hasPermission",
        args: [shopId, walletAddress, abi.permissions.updateRootHash],
      })) as boolean;
      return hasAccess;
    } else return false;
  };

  const createNewRelayClient = () => {
    const keyCard = random32BytesHex();
    const keyCardWallet = privateKeyToAccount(keyCard);
    localStorage.setItem("keyCardToEnroll", keyCard);

    const user = {
      relayEndpoint:
        process.env.NEXT_PUBLIC_RELAY_ENDPOINT ||
        "wss://relay-beta.mass.market/v1",
      keyCardWallet,
      shopId: shopId as `0x${string}`,
      chain: usedChain,
    };

    return new RelayClient(user);
  };

  const value = {
    name,
    walletAddress,
    balance,
    avatar,
    ensName,
    relayClient,
    publicClient,
    inviteSecret,
    clientWallet,
    keyCardEnrolled,
    setInviteSecret,
    setWallet,
    getTokenInformation,
    setKeyCardEnrolled,
    shopId,
    setShopId,
    checkPermissions,
    setRelayClient,
    createNewRelayClient,
  };

  return (
    <MyContext.Provider value={value}>{props.children}</MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
