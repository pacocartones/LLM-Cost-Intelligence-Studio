import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] ??
  process.env.npm_package_name ??
  'llm-cost-intelligence-studio'
const isGitHubPagesBuild =
  process.env.GITHUB_ACTIONS === 'true' || Boolean(process.env.GITHUB_REPOSITORY)

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  base: isGitHubPagesBuild ? `/${repositoryName}/` : '/',
}))
