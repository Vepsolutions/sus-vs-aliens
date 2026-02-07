---
description: Deploy Sus vs Aliens to Vercel
---

# Deploy Sus vs Aliens to Vercel

Follow these steps to deploy your game to the web using Vercel.

## Prerequisites
- A GitHub account.
- A Vercel account (you can sign up with GitHub).
- Use a terminal for the git commands.

## Step 1: Push Code to GitHub

1.  **Initialize Git** (if not already done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit of Sus vs Aliens"
    ```

2.  **Create a New Repository on GitHub**:
    - Go to [github.com/new](https://github.com/new).
    - Name your repository (e.g., `sus-vs-aliens`).
    - Keep it **Public** (easier) or **Private**.
    - Click **Create repository**.

3.  **Link and Push**:
    - Copy the commands shown under "...or push an existing repository from the command line".
    - Run them in your project terminal:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/sus-vs-aliens.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy on Vercel

1.  **Go to Vercel**:
    - Log in to [vercel.com](https://vercel.com/dashboard).

2.  **Import Project**:
    - Click **"Add New..."** -> **"Project"**.
    - Select your `sus-vs-aliens` repository from the list (you might need to install the Vercel GitHub app if you haven't).
    - Click **Import**.

3.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Vite**.
    - **Build Command**: `vite build` (Default)
    - **Output Directory**: `dist` (Default)
    - Click **Deploy**.

## Step 3: Play!

- Vercel will build your game.
- Once done, you'll get a URL (e.g., `sus-vs-aliens.vercel.app`).
- Share it with the world!
