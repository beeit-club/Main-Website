"use client";
import React from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthHook } from "@/hooks/useAuth";

function useLogin(user, logout) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.avatar_url || user?.avatar || ""} />
          <AvatarFallback>
            {user?.fullname?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`absolute -right-2 top-4 w-60`}>
        <DropdownMenuLabel>{`${user?.name ?? user?.fullname ?? ""}`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Trang cá nhân
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Đăng Xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default function Account() {
  const { user, isLogin } = useAuthStore();
  const { logout } = useAuthHook();
  return (
    <div className="flex items-center">
      {isLogin ? (
        useLogin(user, logout)
      ) : (
        <Link href={"/login"}>
          <User />
        </Link>
      )}
    </div>
  );
}
