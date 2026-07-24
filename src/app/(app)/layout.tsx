import { SidebarProvider } from '@/components/ui/sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-svh min-h-0 overflow-hidden">{children}</SidebarProvider>
  )
}
