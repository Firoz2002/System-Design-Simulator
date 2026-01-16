"use client"

import * as React from "react"
import {
  Server,
  Shield,
  HardDrive,
  Network, // Used for Load Balancer
  LogOut,
  ChevronsUpDown,
  Moon,
  Sun,
  Terminal,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useTheme } from "next-themes"

// ------------------------------------------------------------------
// 1. THE HARDWARE PALETTE DATA
// ------------------------------------------------------------------
const hardwareItems = [
  {
    title: "Server Node",
    type: "SERVER",
    icon: Server,
    desc: "Compute Unit (CPU/RAM)",
    cost: "$50/mo",
  },
  {
    title: "Load Balancer",
    type: "LOAD_BALANCER",
    icon: Network, // Network icon represents distribution
    desc: "Distribute Traffic",
    cost: "$20/mo",
  },
  {
    title: "Firewall",
    type: "FIREWALL",
    icon: Shield,
    desc: "Security Filter",
    cost: "$10/mo",
  },
  {
    title: "Ext. Storage",
    type: "EXT_STORAGE",
    icon: HardDrive,
    desc: "Object Store (S3)",
    cost: "$0.02/GB",
  },
]

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Use a mock session or your actual auth hook here
  const session = { user: { name: "System Arch", email: "player@devops.game", image: "" } }

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* -----------------------------------------------------------
          HEADER: Game Title / Status
      ----------------------------------------------------------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Terminal className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">DevOps Tycoon</span>
                <span className="truncate text-xs text-muted-foreground">Mission 1: The Basics</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* -----------------------------------------------------------
          CONTENT: The Draggable Hardware Palette
      ----------------------------------------------------------- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hardware Palette</SidebarGroupLabel>
          <SidebarMenu>
            {hardwareItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="cursor-grab active:cursor-grabbing"
                >
                  {/* CRITICAL: The onDragStart event needed for React Flow 
                     We attach the 'nodeType' to the data transfer so the canvas knows what was dropped.
                  */}
                  <div
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("application/reactflow", item.type)
                      event.dataTransfer.effectAllowed = "move"
                    }}
                  >
                    <item.icon />
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.cost}</span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* -----------------------------------------------------------
          FOOTER: User Profile & Theme Toggle
      ----------------------------------------------------------- */}
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

// ------------------------------------------------------------------
// USER FOOTER COMPONENT (Simplified)
// ------------------------------------------------------------------
function NavUser({ session }: { session: any }) {
  const { isMobile } = useSidebar()
  const { setTheme, theme } = useTheme()

  const user = session?.user || { name: "Guest", email: "", avatar: "" }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">SA</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">SA</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              Toggle Theme
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}