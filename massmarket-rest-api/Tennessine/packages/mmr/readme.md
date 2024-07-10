# Merkle Mountain Range

```
          /\
         /**\
        /****\   /\
       /      \ /**\
      /  /\    /    \        /\    /\  /\      /\            /\/\/\  /\
     /  /  \  /      \      /  \/\/  \/  \  /\/  \/\  /\  /\/ / /  \/  \
    /  /    \/ /\     \    /    \ \  /    \/ /   /  \/  \/  \  /    \   \
   /  /      \/  \/\   \  /      \    /   /    \
__/__/_______/___/__\___\__________________________________________________
```

This is a persistent [Merkle Mountain Range](https://github.com/opentimestamps/opentimestamps-server/blob/master/doc/merkle-mountain-range.md) implementation that stives for simplicity and readability. It is not optimized for performance.

### There are some footguns

- The tree xor's the hashes of leafs to generate the parent hash. This is not secure if the leafs are not trusted and can be manipulated by an attacker.
- You can only grow the tree by pushing values to it.
- You can't remove values from the tree.

### Impovements

- batch operations would be more performant
