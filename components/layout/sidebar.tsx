"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, FileText, GraduationCap, BookOpen, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Update sidebar with bilingual labels
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 text-brand-blue" />,
    },
    {
      title: "Exams",
      href: "/exams",
      icon: <FileText className="h-5 w-5 text-brand-orange" />,
    },
    {
      title: "Scholarships",
      href: "/scholarships",
      icon: <GraduationCap className="h-5 w-5 text-brand-blue" />,
    },
    {
      title: "Guides",
      href: "/guides",
      icon: <BookOpen className="h-5 w-5 text-brand-orange" />,
    },
  ]

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center px-4 border-b bg-brand-blue-light">
        <Link href="/dashboard" className="flex items-center gap-3 font-heading">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-brand-orange" />
          </div>
          <span className="text-lg font-bold text-brand-blue">PubCam Admin</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => logout()}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <>
      {isMobile && (
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50" onClick={toggleSidebar}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {isMobile ? (
        <div
          className={cn(
            "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className,
          )}
        >
          <div className="flex h-full w-64 flex-col bg-background border-r">{sidebarContent}</div>
          <div className="absolute inset-0 bg-black/50 -z-10" onClick={() => setIsOpen(false)} />
        </div>
      ) : (
        <div className={cn("flex h-full w-64 flex-col bg-background border-r", className)}>{sidebarContent}</div>
      )}
    </>
  )
}
