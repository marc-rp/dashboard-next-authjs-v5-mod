import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Factory, ShoppingBag, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="sm:ml-16 mt-4 mr-4 p-4">
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                Cliente
              </CardTitle>
              <Users className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>Cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">Cliente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                Pedido
              </CardTitle>
              <ShoppingBag className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>Pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">Pedido</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                Fábrica
              </CardTitle>
              <Factory className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>Fábrica</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">Fábrica</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                Produto
              </CardTitle>
              <Factory className="ml-auto w-4 h-4" />
            </div>
            <CardDescription>Produto</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold">Produto</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
