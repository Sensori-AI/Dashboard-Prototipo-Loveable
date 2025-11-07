import { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
};

// Componente separado para o conteúdo principal
function MainContent({ children }: { children: ReactNode }) {
  const { state, isMobile } = useSidebar();

  return (
    <main
      className="flex-1 overflow-auto transition-all duration-200"
      style={{
        marginLeft: !isMobile
          ? state === "expanded"
            ? "var(--sidebar-width)"
            : "var(--sidebar-width-icon)"
          : "0px",
      }}
    >
      {children}
    </main>
  );
}
