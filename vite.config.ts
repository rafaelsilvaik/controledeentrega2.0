import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getLastNFUpdate } from './src/utils/nfStorage'

const getLastUpdateDate = () => {
  return getLastNFUpdate();
}

export default defineConfig({
  plugins: [react()],
  define: {
    '__LAST_UPDATE__': JSON.stringify(getLastUpdateDate()),
  }
})
