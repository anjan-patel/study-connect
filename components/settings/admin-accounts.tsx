"use client"

import { useState } from "react"
import { MobileShell } from "./mobile-shell"
import { SettingsCard, SettingsRow } from "./settings-card"
import { FormField, FormSelect, FormInput } from "./form-field"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Plus,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  Key,
  UserCog
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Admin {
  id: string
  name: string
  email: string
  phone: string
  role: "super_admin" | "admin" | "moderator"
  avatar?: string
  isActive: boolean
  lastLogin: string
  createdAt: string
}

const mockAdmins: Admin[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@school.edu",
    phone: "+91 98765 43210",
    role: "super_admin",
    isActive: true,
    lastLogin: "2 hours ago",
    createdAt: "Jan 2024"
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@school.edu",
    phone: "+91 98765 43211",
    role: "admin",
    isActive: true,
    lastLogin: "1 day ago",
    createdAt: "Mar 2024"
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit@school.edu",
    phone: "+91 98765 43212",
    role: "admin",
    isActive: true,
    lastLogin: "3 days ago",
    createdAt: "Jun 2024"
  },
  {
    id: "4",
    name: "Sneha Gupta",
    email: "sneha@school.edu",
    phone: "+91 98765 43213",
    role: "moderator",
    isActive: false,
    lastLogin: "2 weeks ago",
    createdAt: "Aug 2024"
  },
]

const roleConfig = {
  super_admin: { label: "Super Admin", icon: ShieldAlert, color: "bg-purple-100 text-purple-700" },
  admin: { label: "Admin", icon: ShieldCheck, color: "bg-blue-100 text-blue-700" },
  moderator: { label: "Moderator", icon: Shield, color: "bg-gray-100 text-gray-700" },
}

interface AdminAccountsProps {
  onBack: () => void
}

export function AdminAccounts({ onBack }: AdminAccountsProps) {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [deleteAdmin, setDeleteAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin" as Admin["role"],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", role: "admin" })
    setErrors({})
  }

  const openAddSheet = () => {
    resetForm()
    setEditingAdmin(null)
    setShowAddSheet(true)
  }

  const openEditSheet = (admin: Admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    })
    setEditingAdmin(admin)
    setShowAddSheet(true)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingAdmin) {
      setAdmins(prev => prev.map(a => 
        a.id === editingAdmin.id 
          ? { ...a, ...formData }
          : a
      ))
    } else {
      const newAdmin: Admin = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        lastLogin: "Never",
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
      }
      setAdmins(prev => [...prev, newAdmin])
    }
    
    setSaving(false)
    setShowAddSheet(false)
    resetForm()
  }

  const toggleAdminStatus = (adminId: string) => {
    setAdmins(prev => prev.map(a =>
      a.id === adminId ? { ...a, isActive: !a.isActive } : a
    ))
  }

  const handleDelete = () => {
    if (deleteAdmin) {
      setAdmins(prev => prev.filter(a => a.id !== deleteAdmin.id))
      setDeleteAdmin(null)
    }
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  return (
    <MobileShell
      title="Admin Accounts"
      onBack={onBack}
      rightAction={
        <Button size="sm" onClick={openAddSheet}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 text-center border">
            <p className="text-2xl font-bold text-primary">{admins.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center border">
            <p className="text-2xl font-bold text-success">{admins.filter(a => a.isActive).length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center border">
            <p className="text-2xl font-bold text-muted-foreground">{admins.filter(a => !a.isActive).length}</p>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </div>
        </div>

        {/* Admin List */}
        <SettingsCard title="Administrators">
          <div className="space-y-3">
            {filteredAdmins.map((admin) => {
              const RoleIcon = roleConfig[admin.role].icon
              return (
                <div 
                  key={admin.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${!admin.isActive ? "opacity-60" : ""}`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={admin.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(admin.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{admin.name}</p>
                      {!admin.isActive && (
                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={`text-xs ${roleConfig[admin.role].color}`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleConfig[admin.role].label}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => openEditSheet(admin)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleAdminStatus(admin.id)}>
                        <UserCog className="h-4 w-4 mr-2" />
                        {admin.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key className="h-4 w-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteAdmin(admin)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>
        </SettingsCard>

        {/* Role Permissions Info */}
        <SettingsCard
          title="Role Permissions"
          icon={<Shield className="h-5 w-5" />}
        >
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium">Super Admin</p>
                <p className="text-xs text-muted-foreground">Full access to all settings including billing and data management</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">Manage users, academics, and most settings except billing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium">Moderator</p>
                <p className="text-xs text-muted-foreground">View-only access with limited content moderation</p>
              </div>
            </div>
          </div>
        </SettingsCard>
      </div>

      {/* Add/Edit Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-auto">
          <SheetHeader className="text-left">
            <SheetTitle>{editingAdmin ? "Edit Admin" : "Add Admin"}</SheetTitle>
            <SheetDescription>
              {editingAdmin ? "Update admin account details" : "Create a new administrator account"}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-4">
            <FormInput
              label="Full Name"
              value={formData.name}
              onChange={(v) => setFormData(prev => ({ ...prev, name: v }))}
              placeholder="Enter full name"
              required
              error={errors.name}
            />
            <FormInput
              label="Email Address"
              value={formData.email}
              onChange={(v) => setFormData(prev => ({ ...prev, email: v }))}
              placeholder="admin@school.edu"
              type="email"
              required
              error={errors.email}
            />
            <FormInput
              label="Phone Number"
              value={formData.phone}
              onChange={(v) => setFormData(prev => ({ ...prev, phone: v }))}
              placeholder="+91 98765 43210"
              type="tel"
              required
              error={errors.phone}
            />
            <FormSelect
              label="Role"
              value={formData.role}
              onChange={(v) => setFormData(prev => ({ ...prev, role: v as Admin["role"] }))}
              options={[
                { value: "super_admin", label: "Super Admin" },
                { value: "admin", label: "Admin" },
                { value: "moderator", label: "Moderator" },
              ]}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddSheet(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingAdmin ? "Update" : "Create Account"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAdmin} onOpenChange={() => setDeleteAdmin(null)}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteAdmin?.name}&apos;s account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  )
}
