"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Leaf, User, LogOut, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">Justicia Verde</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/denuncias">
                <Button variant="ghost">Denuncias</Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.nombre_completo}</span>
                      <span className="text-xs text-muted-foreground">{user?.correo}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
