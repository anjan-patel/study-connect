'use client'

import { useState } from 'react'
import {
  School,
  Palette,
  Calendar,
  CalendarDays,
  GraduationCap,
  Bell,
  CreditCard,
  MessageSquare,
  Bus,
  Users,
  Database,
  Shield,
  ChevronRight,
  Search
} from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { UserRole, SettingsCategory } from '@/lib/settings-types'
import { settingsCategories } from '@/lib/settings-data'

const iconMap: Record<string, React.ReactNode> = {
  School: <School className="h-5 w-5" />,
  Palette: <Palette className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  CalendarDays: <CalendarDays className="h-5 w-5" />,
  GraduationCap: <GraduationCap className="h-5 w-5" />,
  Bell: <Bell className="h-5 w-5" />,
  CreditCard: <CreditCard className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  Bus: <Bus className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Database: <Database className="h-5 w-5" />
}

interface SettingsHomeProps {
  currentRole?: UserRole
  onNavigate?: (href: string) => void
}

export function SettingsHome({ currentRole = 'admin', onNavigate }: SettingsHomeProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = settingsCategories.filter((category) => {
    const matchesRole = category.roles.includes(currentRole)
    const matchesSearch = category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesSearch
  })

  const handleNavigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href)
    }
  }

  return (
    <MobileShell title="Settings" backHref="/dashboard">
      <div className="px-4 py-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                DK
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground">Dr. Rajesh Kumar</h2>
              <p className="text-sm text-muted-foreground">Principal</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs capitalize">
                  <Shield className="h-3 w-3 mr-1" />
                  {currentRole.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 rounded-xl bg-card border-border"
          />
        </div>

        {/* Settings Categories */}
        <div className="space-y-3">
          {filteredCategories.map((category) => (
            <SettingsCategoryCard
              key={category.id}
              category={category}
              onClick={() => handleNavigate(category.href)}
            />
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No settings found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search query
            </p>
          </div>
        )}

        {/* App Info */}
        <div className="text-center py-6 space-y-1">
          <p className="text-sm font-medium text-foreground">School Connect</p>
          <p className="text-xs text-muted-foreground">Version 2.4.1</p>
        </div>
      </div>
    </MobileShell>
  )
}

interface SettingsCategoryCardProps {
  category: SettingsCategory
  onClick: () => void
}

function SettingsCategoryCard({ category, onClick }: SettingsCategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full bg-card rounded-2xl border border-border shadow-sm',
        'flex items-center gap-4 p-4 text-left',
        'transition-colors active:bg-accent/50'
      )}
    >
      <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {iconMap[category.icon] || <School className="h-5 w-5" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">{category.title}</h3>
          {category.badge && (
            <Badge variant="secondary" className="text-xs">
              {category.badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
          {category.description}
        </p>
      </div>
      
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </button>
  )
}
