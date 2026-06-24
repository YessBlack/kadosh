import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
    <App />
    <Toaster />
  </ThemeProvider>
)
