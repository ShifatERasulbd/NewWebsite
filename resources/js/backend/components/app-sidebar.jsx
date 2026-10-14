import {
    ChevronRight,
    Gauge,
    LogOut,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/backend/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/backend/components/ui/sidebar';
import { useAppContext } from '@/backend/context/AppContext';
import { fetchMenus } from '@/backend/pages/Menu/api';

const getMenuPath = (menu) => `/menus/${menu.id}`;

// Active on the exact path or any nested path (e.g. /menus/1/items/add)
const isPathActive = (pathname, path) =>
    pathname === path || pathname.startsWith(`${path}/`);

const userAccessItems = [
    { title: 'Users', icon: Users, path: '/users' },
];

export function AppSidebar(props) {
    const navigate = useNavigate();
    const location = useLocation();
    useAppContext();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [menus, setMenus] = useState([]);
    const [isMenusLoading, setIsMenusLoading] = useState(true);

    // Fetch the created menus
    useEffect(() => {
        let ignore = false;

        async function loadMenus() {
            setIsMenusLoading(true);

            try {
                const data = await fetchMenus();
                if (!ignore) {
                    setMenus(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (!ignore) {
                    setMenus([]);
                }
            } finally {
                if (!ignore) {
                    setIsMenusLoading(false);
                }
            }
        }

        loadMenus();

        return () => {
            ignore = true;
        };
    }, []);

    const homeItems = useMemo(
        () => [
            { title: 'Dashboard', icon: Gauge, path: '/dashboard' },
            { title: 'Pages', icon: Gauge, path: '/pages' },
            {
                title: 'Menus',
                icon: Gauge,
                path: '/menus',
                items: menus.map((menu) => ({
                    title: menu.title,
                    path: getMenuPath(menu),
                })),
            },
        ],
        [menus],
    );

    const visibleHomeItems = homeItems;
    const visibleUserAccessItems = userAccessItems;

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            await fetch('/sanctum/csrf-cookie', {
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
        } finally {
            setIsLoggingOut(false);
            navigate('/');
        }
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar" {...props}>
            <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
                <div className="flex items-center gap-2 px-1">
                    <span className="inline-flex size-4 rounded-full border border-sidebar-foreground/60" />
                    <span className="text-sm font-semibold">AVANT</span>
                </div>
            </SidebarHeader>

            <SidebarContent className="scrollbar-hidden py-3">
                {visibleHomeItems.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Home</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {visibleHomeItems.map((item) => {
                                    const hasSubItems = Array.isArray(item.items);
                                    const isSubActive =
                                        hasSubItems &&
                                        item.items.some((sub) =>
                                            isPathActive(location.pathname, sub.path),
                                        );
                                    // Parent is active only on its own page, not on child menu pages
                                    const isParentActive = location.pathname === item.path;

                                    if (!hasSubItems) {
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    tooltip={item.title}
                                                    isActive={isParentActive}
                                                >
                                                    <Link to={item.path}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    }

                                    return (
                                        <Collapsible
                                            key={item.title}
                                            asChild
                                            defaultOpen={isSubActive || isParentActive}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                {/* Text + icon → navigates */}
                                                <SidebarMenuButton
                                                    asChild
                                                    tooltip={item.title}
                                                    isActive={isParentActive}
                                                >
                                                    <Link to={item.path}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>

                                                {/* Chevron → toggles only */}
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                        <ChevronRight />
                                                        <span className="sr-only">Toggle {item.title}</span>
                                                    </SidebarMenuAction>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items.length === 0 ? (
                                                            <SidebarMenuSubItem>
                                                                <span className="px-2 py-1 text-xs text-sidebar-foreground/60">
                                                                    {isMenusLoading ? 'Loading...' : 'No menus yet'}
                                                                </span>
                                                            </SidebarMenuSubItem>
                                                        ) : (
                                                            item.items.map((subItem) => (
                                                                <SidebarMenuSubItem key={subItem.path}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isPathActive(
                                                                            location.pathname,
                                                                            subItem.path,
                                                                        )}
                                                                    >
                                                                        <Link to={subItem.path}>
                                                                            <span>{subItem.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ))
                                                        )}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {/* user access */}
                {visibleUserAccessItems.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>User Access</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {visibleUserAccessItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={location.pathname === item.path}
                                        >
                                            <Link to={item.path}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Logout" onClick={handleLogout} disabled={isLoggingOut}>
                            <LogOut />
                            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}