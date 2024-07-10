import MMR from "../";
import fs from "fs";
import { Level } from "level";
import { keccak_256 } from "@noble/hashes/sha3";

import { afterEach, expect, test } from "vitest";

const dbPath = "./db/test";

function isEqualArray(a: Uint8Array, b: Uint8Array) {
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] != b[i]) return false;
  return true;
}

afterEach(() => {
  fs.rmSync(dbPath, { recursive: true, force: true });
});

test("next power of 2", async () => {
  expect(MMR.nextPowerOf2(0)).toBe(1);
  expect(MMR.nextPowerOf2(1)).toBe(1);
  expect(MMR.nextPowerOf2(2)).toBe(2);
  expect(MMR.nextPowerOf2(3)).toBe(4);
  expect(MMR.nextPowerOf2(4)).toBe(4);
  expect(MMR.nextPowerOf2(5)).toBe(8);
  expect(MMR.nextPowerOf2(6)).toBe(8);
  expect(MMR.nextPowerOf2(7)).toBe(8);
  expect(MMR.nextPowerOf2(8)).toBe(8);
  expect(MMR.nextPowerOf2(9)).toBe(16);
  expect(MMR.nextPowerOf2(10)).toBe(16);
  expect(MMR.nextPowerOf2(11)).toBe(16);
  expect(MMR.nextPowerOf2(12)).toBe(16);
  expect(MMR.nextPowerOf2(13)).toBe(16);
  expect(MMR.nextPowerOf2(14)).toBe(16);
  expect(MMR.nextPowerOf2(15)).toBe(16);
  expect(MMR.nextPowerOf2(16)).toBe(16);
});

test("path to leaf", async () => {
  // 0
  expect(MMR._pathToLeaf(1, 1)).toEqual([1]);
  // 1
  expect(MMR._pathToLeaf(2, 2)).toEqual([3, 2]);
  // 2
  expect(MMR._pathToLeaf(3, 3)).toEqual([7, 6, 4]);
  // 3
  expect(MMR._pathToLeaf(4, 4)).toEqual([7, 6, 5]);
  // 4
  expect(MMR._pathToLeaf(5, 5)).toEqual([15, 14, 10, 8]);
  // 5
  expect(MMR._pathToLeaf(6, 6)).toEqual([15, 14, 10, 9]);
  // 6
  expect(MMR._pathToLeaf(7, 7)).toEqual([15, 14, 13, 11]);
  // 7
  expect(MMR._pathToLeaf(8, 8)).toEqual([15, 14, 13, 12]);
  // 8
  expect(MMR._pathToLeaf(9, 9)).toEqual([31, 30, 22, 18, 16]);
  // 9
  expect(MMR._pathToLeaf(10, 10)).toEqual([31, 30, 22, 18, 17]);
  // 10
  expect(MMR._pathToLeaf(11, 11)).toEqual([31, 30, 22, 21, 19]);
  // 11
  expect(MMR._pathToLeaf(12, 12)).toEqual([31, 30, 22, 21, 20]);
  // 12
  expect(MMR._pathToLeaf(13, 13)).toEqual([31, 30, 29, 25, 23]);
  // 13
  expect(MMR._pathToLeaf(14, 14)).toEqual([31, 30, 29, 25, 24]);
  // 14
  expect(MMR._pathToLeaf(15, 15)).toEqual([31, 30, 29, 28, 26]);
});

test("push and load", async () => {
  const db = new Level(dbPath, {
    valueEncoding: "view",
  });
  const mmr = new MMR(db);

  let val1 = new Uint8Array(32);
  val1.fill(0);
  await mmr.push(val1);
  expect(isEqualArray(mmr._root!, keccak_256(val1))).toBe(true);

  const val2 = new Uint8Array(32);
  val2.fill(1);
  await mmr.push(val2);

  /**
   * test a tree with 2 leaves
   *  3
   * 1 2
   */
  let root = keccak_256(MMR.xorUint8Arrays(keccak_256(val1), keccak_256(val2)));
  expect(isEqualArray(mmr.root!, root)).toBe(true);

  /**
   * test a tree with 3 leaves
   *  3
   * 1 2 4
   */
  const val3 = new Uint8Array(32);
  val3.fill(2);
  await mmr.push(val3);
  root = keccak_256(MMR.xorUint8Arrays(root, keccak_256(val3)));
  expect(isEqualArray(mmr._root!, root)).toBe(true);

  /**
   * test a tree with 4 leaves
   *    7
   *  3   6
   * 1 2 4 5
   */
  const val4 = new Uint8Array(32);
  val4.fill(3);
  await mmr.push(val4);
  root = keccak_256(
    MMR.xorUint8Arrays(
      keccak_256(MMR.xorUint8Arrays(keccak_256(val1), keccak_256(val2))),
      keccak_256(MMR.xorUint8Arrays(keccak_256(val3), keccak_256(val4))),
    ),
  );
  expect(isEqualArray(mmr._root!, root)).toBe(true);

  // check to see if we can load the saved values
  const loadedVal4 = await mmr.get(3);
  expect(isEqualArray(loadedVal4, val4)).toBe(true);

  const loadedVal3 = await mmr.get(2);
  expect(isEqualArray(loadedVal3, val3)).toBe(true);

  const loadedVal2 = await mmr.get(1);
  expect(isEqualArray(loadedVal2, val2)).toBe(true);

  const loadedVal1 = await mmr.get(0);
  expect(isEqualArray(loadedVal1, val1)).toBe(true);

  await mmr.close();
  await mmr.open();
  await mmr.close();

  expect(isEqualArray(mmr.root!, root)).toBe(true);
});

test("push and edit", async () => {
  const db = new Level(dbPath, {
    valueEncoding: "view",
  });
  const mmr = new MMR(db);

  for (let i = 0; i < 10; i++) {
    const val = new Uint8Array(32);
    val.fill(i);
    await mmr.push(val);
  }

  for (let i = 0; i < 10; i++) {
    const loaded = await mmr.get(i);
    const val = new Uint8Array(32);
    val.fill(i);
    expect(isEqualArray(loaded, val)).toBe(true);
  }

  for (let i = 0; i < 10; i++) {
    const val = new Uint8Array(32);
    val.fill(0xff);
    await mmr.set(i, val);
  }

  const val = new Uint8Array(32);
  val.fill(0xff);
  for (let i = 0; i < 10; i++) {
    const loaded = await mmr.get(i);
    expect(isEqualArray(loaded, val)).toBe(true);
  }

  await mmr.close();
});

test("multiproofs", async () => {
  const db = new Level(dbPath, {
    valueEncoding: "view",
  });
  const mmr = new MMR(db);

  for (let i = 0; i < 5; i++) {
    const val = new Uint8Array(32);
    val.fill(i);
    await mmr.push(val);
  }

  let proofPos = mmr._getMultiProofPositions([0, 1, 2, 3, 4]);
  expect(proofPos).toEqual([13, 9]);
  proofPos = mmr._getMultiProofPositions([2]);
  expect(proofPos).toEqual([14, 3, 5]);
  await mmr.close();
});
