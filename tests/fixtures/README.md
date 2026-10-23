# Patch download regression fixtures

These two intentionally unterminated text patches were captured from actual
Chrome downloads for the public PRCart PR #13 before its serialization repair.
They contain only public repository changes. Originals are retained byte-for-byte:

- preview-package.patch: SHA-256 ea7e053787473bce943aece34995515ad15b2973b2b25ad06131a6c3085be5ca
- production-wrangler.patch: SHA-256 cf0ce4877a738f55134e1ee9dabcb78aed136fadf9ddc0d7d982e7a8ad602404

base/ contains the corresponding public files at 875ff6f6ffa2f246ca050c53e1b5519e2cfe7fea;
expected/ contains them at 3c283e2a02160f04c852bbc7bfc652532d6c2a73.
Tests exercise Git parsing, base applicability, actual application and exact
resulting bytes. Blob tests cover serialization; real browser downloads still
need independent acceptance after deployment.

To validate actual downloaded files without modifying them:

```sh
pnpm test:download --base 875ff6f6ffa2f246ca050c53e1b5519e2cfe7fea /path/to/download.patch
```

The base commit must exist locally. Use the PR's actual base, not this fixture
base for unrelated changes. The command hashes original bytes and checks/applies
them only to a disposable extracted base tree. It never repairs the download.
