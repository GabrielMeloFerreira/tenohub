'use client'

import Image from 'next/image'
import { Calendar, CheckSquare, LogOut, NotebookText, Plus, Search, Settings } from 'lucide-react'

import { signOut } from '@/features/auth/server/actions'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { View } from '@/stores/ui-store'

const navItems: { label: string; icon: typeof NotebookText; view: View }[] = [
  { label: 'Todas as notas', icon: NotebookText, view: 'notes' },
  { label: 'Tarefas', icon: CheckSquare, view: 'todo' },
  { label: 'Calendário', icon: Calendar, view: 'calendar' },
]

interface NavSidebarProps {
  view: View
  user: { name: string; email: string }
  folders?: React.ReactNode
  notesActive: boolean
  onChangeView: (view: View) => void
  onShowAllNotes: () => void
  onCreateNote: () => void
}

export default function NavSidebar({
  view,
  user,
  folders,
  notesActive,
  onChangeView,
  onShowAllNotes,
  onCreateNote,
}: NavSidebarProps) {
  return (
    <Sidebar collapsible="none" className="h-svh shrink-0 border-r border-border">
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2">
          <Image
            src="/pfp.jpg"
            alt="Foto de perfil"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-md object-cover"
          />
          <div className="flex min-w-0 flex-col text-sm">
            <span className="truncate font-medium text-foreground">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChangeView('search')}
          className="mt-3 inline-flex w-full items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search size={15} />
          Buscar em tudo…
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onCreateNote}>
                  <Plus />
                  <span>Nova nota</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {navItems.map((item) => {
                const isNotes = item.view === 'notes'
                return (
                  <SidebarMenuItem key={item.view}>
                    <SidebarMenuButton
                      isActive={isNotes ? notesActive : view === item.view}
                      onClick={isNotes ? onShowAllNotes : () => onChangeView(item.view)}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>{folders}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={view === 'settings'}
              onClick={() => onChangeView('settings')}
            >
              <Settings />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={signOut} className="w-full">
              <SidebarMenuButton type="submit">
                <LogOut />
                <span>Sair</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
