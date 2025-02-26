import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  CarTaxiFrontIcon,
  Factory,
  FactoryIcon,
  Home,
  LogOut,
  Package,
  PanelBottom,
  Settings,
  Settings2,
  ShoppingBag,
  ShoppingBasket,
  ShoppingBasketIcon,
  ShoppingCart,
  ShoppingCartIcon,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "../auth/user-button";
import Cart from "../cart/Cart";

export function Sidebar() {
  return (
    <div className="flex w-full flex-col bg-muted/40">
      <aside className="fixed flex-col inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Cart />

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Home</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Home</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/shop"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="sr-only">Loja</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Loja</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/costumer"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  <span className="sr-only">Cliente</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Cliente</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/product"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Produto</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Produto</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/factory"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Factory className="h-5 w-5" />
                  <span className="sr-only">Fábrica</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Fábrica</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Settings2 className="h-5 w-5" />
                  <span className="sr-only">Configurações</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Configurações</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="h-5 w-5 text-red-500" />
                  <span className="sr-only">Sair</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                Sair
              </TooltipContent>
            </Tooltip> */}
            <ModeToggle />
            <UserButton />
          </TooltipProvider>
        </nav>
      </aside>

      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex justify-between h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelBottom className="w-5 h-5" />
                  <span className="sr-only">Abrir / fechar menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side={"left"} className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href={"/dashboard"}
                    // className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <Home className="h-5 w-5 transition-all" />
                    Home
                  </Link>
                  <Link
                    href={"/shop"}
                    // className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <Package className="h-5 w-5 transition-all" />
                    Loja
                  </Link>
                  <Link
                    href={"/costumer"}
                    // className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <Users className="h-5 w-5 transition-all" />
                    Cliente
                  </Link>
                  <Link
                    href={"/product"}
                    // className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <Users className="h-5 w-5 transition-all" />
                    Produto
                  </Link>
                  <Link
                    href={"/factory"}
                    // className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <Users className="h-5 w-5 transition-all" />
                    Fábrica
                  </Link>
                  <Link
                    href={"/settings"}
                    // className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <Settings2 className="h-5 w-5 transition-all" />
                    Configurações
                  </Link>
                  <Link
                    href={"/settings"}
                    // className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <ShoppingCartIcon className="h-5 w-5 transition-all" />
                    <Cart />
                  </Link>

                  <ModeToggle />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          {/* <h2>Menu</h2> */}
          <div className="">
            <Cart />
          </div>
        </header>
      </div>
    </div>
  );
}
