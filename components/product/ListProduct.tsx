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
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
} from "../ui/dialog";
import { TableActions } from "./TableActions";

interface ListProductProps {
  products: Product[];
  onClick?: (product: Product) => void;
  success?: string;
  remove: (id: string) => void;
  // Função para exclusão em lote
  groupRemove: (ids: string[]) => Promise<void>;
}

export const getColumns = (
  remove: (id: string) => void,
  onClick?: (product: Product) => void,
): ColumnDef<Product>[] => [
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
        onClick={(e) => e.stopPropagation()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Código
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Nome <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Descrição <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Preço <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <TableActions
          product={product}
          onEdit={(product) => onClick?.(product)}
          remove={remove}
        />
      );
    },
  },
];

export default function ListProduct({
  products,
  onClick,
  remove,
  groupRemove,
  success,
}: ListProductProps) {
  const PAGE_SIZE = 5;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Estado para controle do diálogo de exclusão em lote
  const [isGroupDialogOpen, setIsGroupDialogOpen] = React.useState(false);
  const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);

  const columns = React.useMemo(
    () => getColumns(remove, onClick),
    [onClick, remove],
  );

  const data = React.useMemo<Product[]>(
    () =>
      products.map((product) => ({
        id: product.id,
        code: product.code,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
      })),
    [products],
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
    initialState: {
      pagination: {
        pageSize: PAGE_SIZE,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Controle para o input de página específica
  const [pageInput, setPageInput] = React.useState(
    table.getState().pagination.pageIndex + 1,
  );

  // Sincroniza o input com a página atual da tabela
  React.useEffect(() => {
    const { pageIndex } = table.getState().pagination;
    setPageInput(pageIndex + 1);
  }, [table.getState().pagination.pageIndex]);

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
      {/* Renderiza os controles de paginação somente se houver mais de uma página */}
      {table.getPageCount() > 1 && (
        <>
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
          <div className="flex items-center justify-end space-x-2 pb-4">
            <span className="text-sm text-muted-foreground">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
            <Input
              type="number"
              min={1}
              max={table.getPageCount()}
              value={pageInput}
              onChange={(e) => setPageInput(Number(e.target.value))}
              className="w-16"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(pageInput - 1)}
              disabled={pageInput < 1 || pageInput > table.getPageCount()}
            >
              Ir
            </Button>
          </div>
        </>
      )}
      <div className="flex justify-end py-4">
        <Button variant="destructive" size="sm" onClick={handleGroupDelete}>
          Excluir Selecionados
        </Button>
      </div>

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
