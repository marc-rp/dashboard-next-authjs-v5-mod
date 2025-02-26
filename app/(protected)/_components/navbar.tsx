"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleGate } from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { UserRole } from "@prisma/client";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Navbar = () => {
  const user = useCurrentUser();
  const pathname = usePathname();

  return (
    // <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl shadow-sm">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/server" ? "default" : "outline"}
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
        {user?.isOAuth === false && user?.role === "ADMIN" && (
          <Button
            asChild
            variant={pathname === "/products/create" ? "default" : "outline"}
          >
            <Link href="/product/create">Create Product</Link>
          </Button>
        )}
        {user?.isOAuth === false && user?.role === "ADMIN" && (
          <Button
            asChild
            variant={pathname === "/product" ? "default" : "outline"}
          >
            <Link href="/product">List Products</Link>
          </Button>
        )}

        <UserButton />
      </div>
    </nav>
  );
};
