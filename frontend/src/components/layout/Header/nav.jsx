import * as React from "react";
import dynamic from "next/dynamic";

// Import Zustand store (không cần dùng nữa vì đã bỏ dropdown categories)
// import {
//   useCategoriesStore,
//   buildCategoryTree,
// } from "@/stores/categoriesStore";

// Import Collapsible components (không cần dynamic vì không dùng Radix ID)
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Import Button và Icons
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";

// Import tiện ích `cn` để gộp class
import { cn } from "@/lib/utils";

// Dynamic import NavigationMenu để tránh hydration error (Radix UI tạo ID ngẫu nhiên)
const NavigationMenu = dynamic(
  () =>
    import("@/components/ui/navigation-menu").then((mod) => ({
      default: mod.NavigationMenu,
    })),
  { ssr: false }
);
const NavigationMenuContent = dynamic(
  () =>
    import("@/components/ui/navigation-menu").then(
      (mod) => mod.NavigationMenuContent
    ),
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
const NavigationMenuTrigger = dynamic(
  () =>
    import("@/components/ui/navigation-menu").then(
      (mod) => mod.NavigationMenuTrigger
    ),
  { ssr: false }
);

// Import navigationMenuTriggerStyle trực tiếp (không phải component nên không cần dynamic)
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

// Dynamic import Sheet để tránh hydration error
const Sheet = dynamic(
  () => import("@/components/ui/sheet").then((mod) => mod.Sheet),
  { ssr: false }
);
const SheetClose = dynamic(
  () => import("@/components/ui/sheet").then((mod) => mod.SheetClose),
  { ssr: false }
);
const SheetContent = dynamic(
  () => import("@/components/ui/sheet").then((mod) => mod.SheetContent),
  { ssr: false }
);
// SheetHeader và SheetTitle cần được import trực tiếp để đảm bảo accessibility (Radix UI requirement)
// Không dùng dynamic import vì Radix UI cần chúng ngay từ đầu để tạo proper ARIA attributes
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
const SheetTrigger = dynamic(
  () => import("@/components/ui/sheet").then((mod) => mod.SheetTrigger),
  { ssr: false }
);

// HÀM classNameStyle
const classNameStyle = () => `${navigationMenuTriggerStyle()} text-[16px]`;

// --- COMPONENT CHÍNH ---
export default function Nav() {
  // Lấy categories từ Zustand store (không cần dùng nữa vì đã bỏ dropdown)
  // const { categories, isLoading } = useCategoriesStore();

  return (
    // Sử dụng div bọc ngoài để chứa cả 2 phiên bản
    <div className=" p-0 lg:p-4">
      {/* --- 1. PHIÊN BẢN DESKTOP (NAVIGATION MENU) --- */}
      {/* ... (Code desktop giữ nguyên) ... */}
      <div className="hidden lg:flex justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {/* Mục 2: Link đơn "Bài viết" */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/post"
                className={`${classNameStyle()} `}
              >
                Bài viết
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Mục 3: Link đơn "Hỏi đáp" */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/questions"
                className={`${classNameStyle()} `}
              >
                Hỏi đáp
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Mục 4: Link đơn "Tài liệu" */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/documents"
                className={`${classNameStyle()} `}
              >
                Tài liệu
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Mục 5: Link đơn "Sự kiện" */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/events"
                className={`${classNameStyle()} `}
              >
                Sự kiện
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Mục 6: Link đơn "Đăng ký" */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/apply"
                className={`${classNameStyle()} `}
              >
                Đăng ký
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* --- 2. PHIÊN BẢN MOBILE (SHEET) --- */}
      {/* ... (Code SheetTrigger giữ nguyên) ... */}
      <div className="flex lg:hidden justify-start">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 py-4">
              {/* Render các link đơn */}
              <MobileNavLink href="/questions">Hỏi đáp</MobileNavLink>
              <MobileNavLink href="/documents">Tài liệu</MobileNavLink>
              <MobileNavLink href="/events">Sự kiện</MobileNavLink>
              <MobileNavLink href="/apply">Đăng ký</MobileNavLink>

              {/* Bài viết - Link đơn */}
              <MobileNavLink href="/post">Bài viết</MobileNavLink>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

// --- COMPONENT HELPER MỚI CHO MOBILE ---

/**
 * Component link đơn cho mobile, tự động đóng Sheet khi click
 */
function MobileNavLink({ href, children }) {
  return (
    <SheetClose asChild>
      <a
        href={href}
        // ---- SỬA ĐỔI ----
        // Thêm px-3 py-2, rounded-md và hover:bg-accent
        className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-primary"
      >
        {children}
      </a>
    </SheetClose>
  );
}

/**
 * Component nhóm menu (Collapsible) cho mobile, có thể lồng nhau
 */
function MobileNavGroup({ title, items, slugPrefix }) {
  return (
    <Collapsible>
      <CollapsibleTrigger
        // ---- SỬA ĐỔI ----
        // Thêm px-3 py-2, rounded-md và hover:bg-accent
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-primary [&[data-state=open]>svg]:rotate-180"
      >
        {title}
        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {/* ---- SỬA ĐỔI ----
          - Thêm mt-2 (margin-top)
          - Đổi pl-4 (padding left) thành pl-6 để thụt vào sâu hơn
          - Thêm pr-2 (padding right)
          - Đổi space-y-2 và py-2 thành space-y-1 và py-1 (vì link con đã có padding)
        */}
        <ul className="mt-2 flex flex-col space-y-1 py-1 pl-6 pr-2">
          {/* Link "Tất cả" cho mục cha */}
          <li>
            <MobileNavLink href={`${slugPrefix}`}>
              Tất cả trong "{title}"
            </MobileNavLink>
          </li>

          {/* Map qua các mục con */}
          {items.map((item) => (
            <li key={item.id}>
              {/* Nếu item này KHÔNG có con, render link đơn */}
              {item.children.length === 0 && (
                <MobileNavLink href={`${slugPrefix}?category=${item.slug}`}>
                  {item.name}
                </MobileNavLink>
              )}

              {/* Nếu item này CÓ con, render lồng chính nó (đệ quy) */}
              {item.children.length > 0 && (
                <MobileNavGroup
                  title={item.name}
                  items={item.children}
                  slugPrefix={slugPrefix}
                />
              )}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

// --- COMPONENT HELPER (Từ docs của shadcn - cho desktop) ---
// ... (Component ListItem giữ nguyên) ...
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
