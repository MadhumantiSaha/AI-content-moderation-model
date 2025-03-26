"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Calendar,
  Image,
  Key,
  LayoutDashboard,
  LogOut,
  Menu,
  Package2,
  Search,
  Settings,
  ShieldAlert,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Content Review", href: "/content-review", icon: Image },
    { name: "Moderation History", href: "/moderation-history", icon: Calendar },
    { name: "Policy Management", href: "/policy-management", icon: ShieldAlert },
    { name: "API & Key Management", href: "/api-management", icon: Key },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 border-b pb-4">
                    <Package2 className="h-6 w-6" />
                    <span className="font-semibold">Content Moderation</span>
                    <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  <nav className="flex-1 py-4">
                    <ul className="grid gap-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                              pathname === item.href
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="border-t pt-4">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="hidden md:inline-block">Content Moderation</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <form className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-64 pl-8 bg-background" />
              </div>
            </form>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
          <nav className="flex-1 px-4 py-6">
            <ul className="grid gap-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

