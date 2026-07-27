import { SidebarProvider } from '@/components/ui/sidebar'
import Providers from './providers'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider className="h-svh min-h-0 overflow-hidden">{children}</SidebarProvider>
    </Providers>
  )
}
