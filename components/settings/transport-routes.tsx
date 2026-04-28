'use client'

import { useState } from 'react'
import { 
  Bus, 
  Plus, 
  ChevronRight, 
  MapPin, 
  Phone,
  User,
  MoreVertical,
  Pencil,
  Trash2,
  Power,
  Search
} from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { transportRoutes as initialRoutes } from '@/lib/settings-data'
import type { TransportRoute } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface TransportRoutesScreenProps {
  onBack?: () => void
  onViewRoute?: (routeId: string) => void
  onAddRoute?: () => void
}

export function TransportRoutesScreen({ 
  onBack, 
  onViewRoute,
  onAddRoute
}: TransportRoutesScreenProps) {
  const [routes, setRoutes] = useState<TransportRoute[]>(initialRoutes)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteRoute, setDeleteRoute] = useState<TransportRoute | null>(null)

  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleRouteStatus = (routeId: string) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === routeId ? { ...r, isActive: !r.isActive } : r
      )
    )
  }

  const handleDelete = (route: TransportRoute) => {
    setRoutes((prev) => prev.filter((r) => r.id !== route.id))
    setDeleteRoute(null)
  }

  const getTotalStudents = (route: TransportRoute) => {
    return route.stops.reduce((acc, stop) => acc + stop.studentsCount, 0)
  }

  return (
    <MobileShell
      title="Transport Routes"
      subtitle={`${routes.length} routes configured`}
      onBack={onBack}
      backHref="/settings"
      headerAction={
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onAddRoute}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add route</span>
        </Button>
      }
    >
      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 rounded-xl bg-card border-border"
          />
        </div>

        {/* Routes List */}
        <div className="space-y-3">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className={cn(
                'bg-card rounded-2xl border shadow-sm overflow-hidden',
                route.isActive ? 'border-border' : 'border-border opacity-60'
              )}
            >
              <div className="flex items-start gap-4 p-4">
                <div className={cn(
                  'h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  route.isActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}>
                  <Bus className="h-6 w-6" />
                </div>
                
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onViewRoute?.(route.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{route.name}</h3>
                    <Badge variant={route.isActive ? 'secondary' : 'outline'} className="text-xs">
                      {route.routeNumber}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{route.vehicleNumber}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {route.stops.length} stops
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {getTotalStudents(route)} students
                    </span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewRoute?.(route.id)}>
                      <ChevronRight className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Route
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleRouteStatus(route.id)}>
                      <Power className="h-4 w-4 mr-2" />
                      {route.isActive ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteRoute(route)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Driver Info */}
              <div className="border-t border-border px-4 py-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{route.driverName}</span>
                  </div>
                  <a
                    href={`tel:${route.driverPhone}`}
                    className="flex items-center gap-1 text-sm text-primary font-medium"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Bus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">
              {searchQuery ? 'No routes found' : 'No transport routes'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Add your first transport route'}
            </p>
            {!searchQuery && (
              <Button onClick={onAddRoute} className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteRoute} onOpenChange={() => setDeleteRoute(null)}>
        <AlertDialogContent className="mx-4 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Route?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteRoute?.name}&quot; and remove all associated stops.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRoute && handleDelete(deleteRoute)}
              className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  )
}
