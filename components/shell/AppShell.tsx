'use client';

/**
 * OUTREACH WINDOW PLANNER - App Shell
 * 
 * Main layout component inspired by Cursor's dashboard.
 * Provides navigation, context, and ethical disclaimers.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  CalendarClock,
  Layers,
  Beaker,
  Info,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Overview',
    icon: <LayoutDashboard className="h-4 w-4" />,
    description: 'Dashboard summary and upcoming windows',
  },
  {
    href: '/planner',
    label: 'Planner',
    icon: <CalendarClock className="h-4 w-4" />,
    description: 'Timeline view and outreach planning',
  },
  {
    href: '/signals',
    label: 'Signals',
    icon: <Layers className="h-4 w-4" />,
    description: 'Browse and filter temporal signals',
  },
  {
    href: '/scenario',
    label: 'Scenario',
    icon: <Beaker className="h-4 w-4" />,
    description: 'Speculative planning mode',
  },
];

interface AppShellProps {
  children: React.ReactNode;
  scenarioMode?: boolean;
  onScenarioToggle?: (enabled: boolean) => void;
}

export function AppShell({ 
  children, 
  scenarioMode = false,
  onScenarioToggle,
}: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside 
          className={cn(
            "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
            collapsed ? "w-16" : "w-64"
          )}
        >
          {/* Logo / Brand */}
          <div className="flex h-14 items-center border-b border-sidebar-border px-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-sidebar-primary flex items-center justify-center">
                  <CalendarClock className="h-4 w-4 text-sidebar-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-sidebar-foreground">
                    Outreach Window
                  </span>
                  <span className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">
                    Planner
                  </span>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="mx-auto h-7 w-7 rounded-md bg-sidebar-primary flex items-center justify-center">
                <CalendarClock className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
            )}
          </div>

          {/* Context Badge */}
          {!collapsed && (
            <div className="px-4 py-3">
              <div className="text-xs text-sidebar-foreground/60 mb-1">Focus Area</div>
              <Badge variant="outline" className="text-xs">
                Los Angeles / Koreatown
              </Badge>
            </div>
          )}

          <Separator className="bg-sidebar-border" />

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              const navLink = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
              
              if (collapsed) {
                return (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      {navLink}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </TooltipContent>
                  </Tooltip>
                );
              }
              
              return navLink;
            })}
          </nav>

          {/* Scenario Mode Indicator */}
          {scenarioMode && !collapsed && (
            <div className="mx-2 mb-2 p-2 rounded-lg bg-[var(--window-caution)]/10 border border-[var(--window-caution)]/20">
              <div className="flex items-center gap-2 text-xs text-[var(--window-caution)]">
                <Beaker className="h-3 w-3" />
                <span>Scenario Mode Active</span>
              </div>
            </div>
          )}

          <Separator className="bg-sidebar-border" />

          {/* Footer */}
          <div className="p-2">
            {!collapsed && (
              <div className="mb-2 px-3 py-2 rounded-lg bg-sidebar-accent/30">
                <div className="flex items-start gap-2 text-xs text-sidebar-foreground/70">
                  <Info className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>
                    Prototype tool for planning. Data is simulated/delayed.
                  </span>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4 mx-auto" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-2">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Ethical Disclaimer Banner */}
          <div className="bg-muted/50 border-b border-border px-4 py-2">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>
                  <strong>Organization-only planning tool.</strong> No real-time data. No enforcement tracking. No individual surveillance.
                </span>
              </div>
              <a 
                href="#ethics" 
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Learn more
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

