"use client"

import { useState } from "react"
import { MobileShell } from "./mobile-shell"
import { SettingsCard, SettingsRow } from "./settings-card"
import { FormField, FormSelect, FormInput } from "./form-field"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Clock, 
  Users, 
  Bus,
  Plus,
  Trash2,
  GripVertical,
  Navigation
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface RouteStop {
  id: string
  name: string
  pickupTime: string
  dropTime: string
  studentsCount: number
}

interface RouteDetailProps {
  routeId?: string
  onBack: () => void
  onSave: () => void
}

export function RouteDetail({ routeId, onBack, onSave }: RouteDetailProps) {
  const isNew = !routeId
  
  const [formData, setFormData] = useState({
    routeName: isNew ? "" : "Route A - North Zone",
    routeCode: isNew ? "" : "RT-001",
    vehicleNumber: isNew ? "" : "KA-01-AB-1234",
    driverName: isNew ? "" : "Ramesh Kumar",
    driverPhone: isNew ? "" : "+91 98765 43210",
    conductorName: isNew ? "" : "Suresh Singh",
    conductorPhone: isNew ? "" : "+91 98765 43211",
    capacity: isNew ? "" : "40",
    isActive: true,
    gpsEnabled: true,
  })

  const [stops, setStops] = useState<RouteStop[]>(isNew ? [] : [
    { id: "1", name: "MG Road Junction", pickupTime: "7:00 AM", dropTime: "4:30 PM", studentsCount: 8 },
    { id: "2", name: "Park Street", pickupTime: "7:10 AM", dropTime: "4:20 PM", studentsCount: 12 },
    { id: "3", name: "City Mall", pickupTime: "7:20 AM", dropTime: "4:10 PM", studentsCount: 6 },
    { id: "4", name: "Railway Station", pickupTime: "7:30 AM", dropTime: "4:00 PM", studentsCount: 10 },
  ])

  const [showAddStop, setShowAddStop] = useState(false)
  const [newStop, setNewStop] = useState({ name: "", pickupTime: "", dropTime: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.routeName.trim()) newErrors.routeName = "Route name is required"
    if (!formData.routeCode.trim()) newErrors.routeCode = "Route code is required"
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = "Vehicle number is required"
    if (!formData.driverName.trim()) newErrors.driverName = "Driver name is required"
    if (!formData.driverPhone.trim()) newErrors.driverPhone = "Driver phone is required"
    if (stops.length === 0) newErrors.stops = "At least one stop is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    onSave()
  }

  const addStop = () => {
    if (newStop.name && newStop.pickupTime && newStop.dropTime) {
      setStops(prev => [...prev, {
        id: Date.now().toString(),
        name: newStop.name,
        pickupTime: newStop.pickupTime,
        dropTime: newStop.dropTime,
        studentsCount: 0
      }])
      setNewStop({ name: "", pickupTime: "", dropTime: "" })
      setShowAddStop(false)
      if (errors.stops) {
        setErrors(prev => ({ ...prev, stops: "" }))
      }
    }
  }

  const removeStop = (id: string) => {
    setStops(prev => prev.filter(s => s.id !== id))
  }

  const totalStudents = stops.reduce((sum, stop) => sum + stop.studentsCount, 0)

  return (
    <MobileShell
      title={isNew ? "Add Route" : "Edit Route"}
      onBack={onBack}
      rightAction={
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? "Saving..." : "Save"}
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Route Info */}
        <SettingsCard
          title="Route Information"
          icon={<Bus className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FormInput
              label="Route Name"
              value={formData.routeName}
              onChange={(v) => updateField("routeName", v)}
              placeholder="e.g., Route A - North Zone"
              required
              error={errors.routeName}
            />
            <FormInput
              label="Route Code"
              value={formData.routeCode}
              onChange={(v) => updateField("routeCode", v)}
              placeholder="e.g., RT-001"
              required
              error={errors.routeCode}
            />
            <FormInput
              label="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={(v) => updateField("vehicleNumber", v)}
              placeholder="e.g., KA-01-AB-1234"
              required
              error={errors.vehicleNumber}
            />
            <FormInput
              label="Seating Capacity"
              value={formData.capacity}
              onChange={(v) => updateField("capacity", v)}
              placeholder="e.g., 40"
              type="number"
            />
          </div>
        </SettingsCard>

        {/* Driver Info */}
        <SettingsCard
          title="Driver & Conductor"
          icon={<Users className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FormInput
              label="Driver Name"
              value={formData.driverName}
              onChange={(v) => updateField("driverName", v)}
              placeholder="Enter driver name"
              required
              error={errors.driverName}
            />
            <FormInput
              label="Driver Phone"
              value={formData.driverPhone}
              onChange={(v) => updateField("driverPhone", v)}
              placeholder="+91 98765 43210"
              type="tel"
              required
              error={errors.driverPhone}
            />
            <FormInput
              label="Conductor Name"
              value={formData.conductorName}
              onChange={(v) => updateField("conductorName", v)}
              placeholder="Enter conductor name (optional)"
            />
            <FormInput
              label="Conductor Phone"
              value={formData.conductorPhone}
              onChange={(v) => updateField("conductorPhone", v)}
              placeholder="+91 98765 43210"
              type="tel"
            />
          </div>
        </SettingsCard>

        {/* Route Stops */}
        <SettingsCard
          title="Route Stops"
          icon={<MapPin className="h-5 w-5" />}
          description={`${stops.length} stops • ${totalStudents} students`}
          action={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAddStop(true)}
              className="text-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          }
        >
          {errors.stops && (
            <p className="text-sm text-destructive mb-3">{errors.stops}</p>
          )}
          
          {showAddStop && (
            <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-3">
              <FormInput
                label="Stop Name"
                value={newStop.name}
                onChange={(v) => setNewStop(prev => ({ ...prev, name: v }))}
                placeholder="e.g., MG Road Junction"
              />
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Pickup Time"
                  value={newStop.pickupTime}
                  onChange={(v) => setNewStop(prev => ({ ...prev, pickupTime: v }))}
                  placeholder="7:00 AM"
                />
                <FormInput
                  label="Drop Time"
                  value={newStop.dropTime}
                  onChange={(v) => setNewStop(prev => ({ ...prev, dropTime: v }))}
                  placeholder="4:30 PM"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addStop}>Add Stop</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddStop(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {stops.map((stop, index) => (
              <div 
                key={stop.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{stop.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{stop.pickupTime} / {stop.dropTime}</span>
                    <span className="text-primary">{stop.studentsCount} students</span>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[340px] rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Stop</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove &quot;{stop.name}&quot; from this route?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removeStop(stop.id)}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </SettingsCard>

        {/* Settings */}
        <SettingsCard title="Route Settings">
          <div className="space-y-1">
            <SettingsRow
              icon={<Navigation className="h-5 w-5" />}
              title="GPS Tracking"
              description="Enable real-time location tracking"
              action={
                <Switch
                  checked={formData.gpsEnabled}
                  onCheckedChange={(v) => updateField("gpsEnabled", v)}
                />
              }
            />
            <SettingsRow
              title="Active Route"
              description="Route is available for assignment"
              action={
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(v) => updateField("isActive", v)}
                />
              }
            />
          </div>
        </SettingsCard>

        {/* Delete Route */}
        {!isNew && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                Delete Route
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[340px] rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Route</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this route and remove all student assignments. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </MobileShell>
  )
}
