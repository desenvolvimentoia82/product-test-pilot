
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Package, 
  Rocket, 
  TestTube, 
  ClipboardList, 
  PlayCircle,
  Users,
  User,
  LogOut,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Produtos",
    url: "/products",
    icon: Package,
  },
  {
    title: "Releases",
    url: "/releases",
    icon: Rocket,
  },
  {
    title: "Suites de Teste",
    url: "/test-suites",
    icon: TestTube,
  },
  {
    title: "Planos de Teste",
    url: "/test-plans",
    icon: ClipboardList,
  },
  {
    title: "Execuções",
    url: "/executions",
    icon: PlayCircle,
  },
];

const adminMenuItems = [
  {
    title: "Usuários",
    url: "/users",
    icon: Users,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { selectedProduct } = useProduct();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email || 'Usuário';
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <TestTube className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold">Test Manager</h1>
            {selectedProduct && (
              <p className="text-xs text-muted-foreground">{selectedProduct.name}</p>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <Separator />
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4" />
            <div className="flex-1">
              <p className="font-medium">{getUserDisplayName()}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
