import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamic import NavigationMenu to avoid hydration error (Radix UI random ID)
const NavigationMenu = dynamic(
  () =>
    import("@/components/ui/navigation-menu").then((mod) => ({
      default: mod.NavigationMenu,
    })),
  { ssr: false }
);
const NavigationMenuItem = dynamic(
  () =>
    import("@/components/ui/navigation-menu").then(
      (mod) => mod.NavigationMenuItem
    ),
  { ssr: false }
);
const NavigationMenuLink = dynamic(
  () =>
    import("@/components/ui/navigation-menu").then(
      (mod) => mod.NavigationMenuLink
    ),
  { ssr: false }
);
const NavigationMenuList = dynamic(
  () =>
    import("@/components/ui/navigation-menu").then(
      (mod) => mod.NavigationMenuList
    ),
  { ssr: false }
);

// HÀM classNameStyle
const classNameStyle = () =>
  cn(
    "group inline-flex h-9 w-max items-center justify-center rounded-full bg-transparent px-4 py-2 text-[15px] font-semibold transition-all duration-300 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary outline-none"
  );

// --- COMPONENT CHÍNH ---
export default function Nav() {
  return (
    <div className="flex justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/post" className={classNameStyle()}>
              Bài viết
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/questions" className={classNameStyle()}>
              Hỏi đáp
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/documents" className={classNameStyle()}>
              Tài liệu
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/events" className={classNameStyle()}>
              Sự kiện
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/apply" className={classNameStyle()}>
              Đăng ký
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

// --- COMPONENT HELPER (Từ docs của shadcn - cho desktop) ---
const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
