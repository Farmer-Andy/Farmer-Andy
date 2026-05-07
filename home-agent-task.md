# Home Agent Task: Move cloudy-sdk-test to Private Repo

## Context

We are migrating the `cloudy-sdk-test` Cloudflare Worker from a public GitHub repo
(`Farmer-Andy/Farmer-Andy`) into its own private repo (`Farmer-Andy/cloudy-sdk-test`).
The private repo already exists on GitHub but is empty. The source code lives on a
feature branch of the public repo.

## Instructions

Run the following commands in order. You will need GitHub credentials for the
`Farmer-Andy` account to be available (via git credential store, SSH keys, or a
`GITHUB_TOKEN` environment variable).

### Step 1 — Clone the source repo

```bash
git clone https://github.com/Farmer-Andy/Farmer-Andy.git
cd Farmer-Andy
```

### Step 2 — Check out the feature branch

```bash
git checkout claude/deploy-cloudflare-agent-sdk-d2mXe
```

### Step 3 — Extract the subfolder history into its own branch

```bash
git subtree split --prefix=cloudy-sdk-test -b move-worker
```

### Step 4 — Push that branch to the private repo as main

```bash
git push https://github.com/Farmer-Andy/cloudy-sdk-test.git move-worker:main
```

### Step 5 — Verify it worked

```bash
git ls-remote https://github.com/Farmer-Andy/cloudy-sdk-test.git
```

You should see a `refs/heads/main` line in the output.

## Done

Report back with the output of Step 5, or any error messages encountered.
Do not delete or modify anything in the original `Farmer-Andy/Farmer-Andy` repo.
