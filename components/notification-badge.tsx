"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function NotificationBadge() {
  const { user, isAdmin } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    // Fetch unread notifications count
    fetchUnreadCount()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [user, isAdmin])

  const fetchUnreadCount = async () => {
    try {
      if (isAdmin) {
        // For admins, count pending denuncias
        const response = await fetch("/api/denuncias")
        const data = await response.json()
        const pendingCount = data.denuncias?.filter((d: any) => d.estado === "pendiente").length || 0
        setUnreadCount(pendingCount)
      } else {
        // For users, count denuncias with status updates
        const response = await fetch(`/api/denuncias?userId=${user?.id_usuario}`)
        const data = await response.json()
        const updatedCount =
          data.denuncias?.filter((d: any) => d.estado !== "pendiente" && d.estado !== "resuelta").length || 0
        setUnreadCount(updatedCount)
      }
    } catch (error) {
      console.error("[v0] Error fetching notification count:", error)
    }
  }

  if (unreadCount === 0) {
    return (
      <div className="relative">
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative">
      <Bell className="h-5 w-5 text-primary" />
      <Badge
        variant="destructive"
        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
      >
        {unreadCount > 9 ? "9+" : unreadCount}
      </Badge>
    </div>
  )
}
