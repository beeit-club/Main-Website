import * as React from "react";
import dynamic from "next/dynamic";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import Account from "./account";
import { cn } from "@/lib/utils";

// Dynamic imports to avoid hydration errors
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
const SheetTrigger = dynamic(
    () => import("@/components/ui/sheet").then((mod) => mod.SheetTrigger),
    { ssr: false }
);

export default function HamburgerMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Mở menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="text-left">
                    <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-3 py-6">
                    <div className="sm:hidden pb-4 mb-2 border-b border-border/40">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 px-3">
                            Tài khoản
                        </p>
                        <div className="px-3">
                            <Account />
                        </div>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 px-3">
                        Khám phá
                    </p>
                    <MobileNavLink href="/post">Bài viết</MobileNavLink>
                    <MobileNavLink href="/questions">Hỏi đáp</MobileNavLink>
                    <MobileNavLink href="/documents">Tài liệu</MobileNavLink>
                    <MobileNavLink href="/events">Sự kiện</MobileNavLink>
                    <MobileNavLink href="/apply">Đăng ký</MobileNavLink>
                </div>
            </SheetContent>
        </Sheet>
    );
}

/**
 * Component link đơn cho mobile, tự động đóng Sheet khi click
 */
function MobileNavLink({ href, children }) {
    return (
        <SheetClose asChild>
            <a
                href={href}
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
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-primary [&[data-state=open]>svg]:rotate-180"
            >
                {title}
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent>
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
