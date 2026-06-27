'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Music2, BookOpen, ListMusic, Play, Sun, Moon, FlipHorizontal, Layers } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useApp } from '@/contexts/AppContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/chords', icon: Music2, label: 'Chords' },
  { to: '/scales', icon: Layers, label: 'Scales' },
  { to: '/songs', icon: BookOpen, label: 'Songs' },
  { to: '/playlists', icon: ListMusic, label: 'Playlists' },
  { to: '/practice', icon: Play, label: 'Practice' },
]

export default function AppSidebar() {
  const { prefs, updatePrefs } = useApp()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  function isActive(to: string) {
    return to === '/' ? pathname === '/' : pathname.startsWith(to)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="size-7 rounded flex items-center justify-center bg-primary flex-shrink-0">
            <Music2 className="size-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">Practice Atlas</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {NAV.map(({ to, icon: Icon, label }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton render={<Link href={to} />} isActive={isActive(to)}>
                <Icon />
                {label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun /> : <Moon />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => updatePrefs({ leftHanded: !prefs.leftHanded })}>
              <FlipHorizontal />
              {prefs.leftHanded ? 'Right-handed' : 'Left-handed'}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
