import {
  LayoutDashboard,
  Store,
  Tags,
  Package,
  CalendarRange,
  Upload,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Analytics",
    items: [
      { href: "/overview", label: "Sales Overview", icon: LayoutDashboard },
      { href: "/stores", label: "Per Store", icon: Store },
      { href: "/brands", label: "Brand & Kategori", icon: Tags },
      { href: "/products", label: "Top Products", icon: Package },
      { href: "/weeks", label: "Week-over-Week", icon: CalendarRange },
    ],
  },
  {
    title: "Kelola",
    items: [
      { href: "/upload", label: "Upload Data", icon: Upload, adminOnly: true },
      { href: "/users", label: "Manajemen User", icon: Users, adminOnly: true },
      { href: "/settings", label: "Pengaturan", icon: Settings },
    ],
  },
];

export const FLAT_NAV: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
