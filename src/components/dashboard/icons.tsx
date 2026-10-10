import {
  BadgeCheck, Globe, Inbox, CircleHelp, Columns3, FolderKanban, Handshake, Home, Images, Info, LayoutGrid, Megaphone,
  PanelBottom, Phone, Settings, Sparkles, TrendingUp, Wrench, type LucideIcon,
} from "lucide-react";

export const sectionIcons: Record<string, LucideIcon> = {
  settings: Settings,
  home: Home,
  ticker: Columns3,
  about: Info,
  stats: TrendingUp,
  services: Wrench,
  products: LayoutGrid,
  clients: Handshake,
  why: Sparkles,
  gallery: Images,
  projects: FolderKanban,
  quality: BadgeCheck,
  faq: CircleHelp,
  cta: Megaphone,
  contact: Phone,
  footer: PanelBottom,
  messages: Inbox,
  seo: Globe,
};
