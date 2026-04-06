import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
