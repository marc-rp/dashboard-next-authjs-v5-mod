"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormSuccess } from "@/components/form-success";
import Product from "@/core/model/Product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTransition } from "react";
import { TableActions } from "@/components/customer/TableActions";
import { Customer } from "@/core/model/Customer";

interface ListCustomerProps {
  customers: Customer[];
  onClick?: (customer: Customer) => void;
  success?: string;
  remove: (id: string) => void;
  // Adicione também groupRemove para exclusão em lote
  groupRemove: (ids: string[]) => Promise<void>;
}

export const getColumns = (
  remove: (id: string) => void,
  onClick?: (customer: Customer) => void,
): ColumnDef<Customer>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        // Impede que o clique no checkbox acione o onClick da linha
        onClick={(e) => e.stopPropagation()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        // Impede que o clique no checkbox acione o onClick da linha
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "cnpj",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          // Impede que o clique no botão de ordenação acione o onClick da linha
          e.stopPropagation();
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        CNPJ <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("cnpj")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          // Impede que o clique no botão de ordenação acione o onClick da linha
          e.stopPropagation();
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Nome <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("name")}</div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          // Impede que o clique no botão de ordenação acione o onClick da linha
          e.stopPropagation();
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Endereço <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("address")}</div>
      );
    },
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          // Impede que o clique no botão de ordenação acione o onClick da linha
          e.stopPropagation();
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Cidade <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("city")}</div>
      );
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          // Impede que o clique no botão de ordenação acione o onClick da linha
          e.stopPropagation();
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Estado <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("state")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <TableActions
          customer={customer}
          onEdit={(customer) => onClick?.(customer)}
          remove={remove}
        />
      );
    },
  },
];

export default function ListCustomer({
  customers,
  onClick,
  remove,
  groupRemove,
  success,
}: ListCustomerProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Estado para controlar o diálogo de exclusão em lote
  const [isGroupDialogOpen, setIsGroupDialogOpen] = React.useState(false);
  // Guarda os IDs dos registros selecionados para exclusão
  const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);

  const columns = React.useMemo(
    () => getColumns(remove, onClick),
    [onClick, remove],
  );

  const data = React.useMemo<Customer[]>(
    () =>
      customers.map((customer) => ({
        id: customer.id,
        cnpj: customer.cnpj,
        name: customer.name,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        cart: customer.cart,
      })),
    [customers],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Função que abre o diálogo de exclusão em lote
  const handleGroupDelete = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    const ids = selectedRows.map((row) => row.original.id);
    setIdsToDelete(ids);
    setIsGroupDialogOpen(true);
  };

  // Função que efetua a exclusão em lote
  const confirmGroupDelete = async () => {
    await groupRemove(idsToDelete);
    table.resetRowSelection();
    setIsGroupDialogOpen(false);
  };

  return (
    <div className="w-full p-4">
      <FormSuccess message={success} />
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          onClick={(e) => e.stopPropagation()}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  // Impede a propagação do clique para evitar conflitos
                  onClick={(e) => e.stopPropagation()}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onClick && onClick(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        {/* Botão para exclusão em lote */}
        <Button variant="destructive" size="sm" onClick={handleGroupDelete}>
          Excluir Selecionados
        </Button>
      </div>

      {/* Diálogo de Exclusão em Lote */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {idsToDelete.length} registro(s)?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsGroupDialogOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                confirmGroupDelete();
              }}
            >
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
