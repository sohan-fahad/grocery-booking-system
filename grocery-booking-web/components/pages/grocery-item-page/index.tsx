'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Pencil, Trash2, PackagePlus, Search, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { CategoryApiService } from '@/lib/services/api';
import { GroceryItemEntity, CategoryEntity } from '@/lib/models/entities';
import { useAdminGroceryItemsPickerQuery } from '@/lib/hooks/queries/useAdminGroceryItemsQuery';
import { useDashboardItems } from '../../../lib/hooks/queries/useDashboardItems';
import { cn } from '@/lib/utils/utils';
import { AddItemDialog } from './add-item-dialog';
import { EditItemDialog } from './edit-item-dialog';
import { DeleteItemDialog } from './delete-item-dialog';
import { InventoryDialog } from './inventory-dialog';

export function ItemsPage() {
    const [categories, setCategories] = useState<CategoryEntity[]>([]);
    const {
        search,
        setSearch,
        page,
        setPage,
        items,
        total,
        totalPages,
        isPending,
        isError,
        refetch,
        invalidateList,
    } = useDashboardItems();

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GroceryItemEntity | null>(null);

    const { data: pickerItems = [] } = useAdminGroceryItemsPickerQuery({ enabled: inventoryOpen });

    const fetchCategories = useCallback(async () => {
        try {
            const res = await CategoryApiService.getAll({ limit: 100 });
            if (res.success) setCategories(res.data ?? []);
        } catch {
            // non-critical
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const openEdit = (item: GroceryItemEntity) => {
        setSelectedItem(item);
        setEditOpen(true);
    };

    const openDelete = (item: GroceryItemEntity) => {
        setSelectedItem(item);
        setDeleteOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Grocery Items</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {total} item{total !== 1 ? 's' : ''} total
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isPending}>
                        <RefreshCw className={`w-4 h-4 mr-1.5 ${isPending ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setInventoryOpen(true)}>
                        <PackagePlus className="w-4 h-4 mr-1.5" />
                        Update Inventory
                    </Button>
                    <Button size="sm" onClick={() => setAddOpen(true)}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Item
                    </Button>
                </div>
            </div>

            <div className="max-w-sm">
                <Input
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                />
            </div>

            <div className="rounded-xl border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    Loading items...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-destructive">
                                    Failed to load items.
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    {search ? 'No items match your search.' : 'No items yet. Add your first grocery item.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.image?.url ? (
                                            <img
                                                src={item.image.url}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        {item.category ? (
                                            <Badge variant="outline">{item.category.name}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                item.quantity === 0
                                                    ? 'text-destructive font-medium'
                                                    : item.quantity <= 10
                                                        ? 'text-amber-500 font-medium'
                                                        : ''
                                            }
                                        >
                                            {item.quantity}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.isActive ? 'default' : 'secondary'}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button size="icon-sm" variant="ghost" onClick={() => openEdit(item)}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                size="icon-sm"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => openDelete(item)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 1) setPage((p) => p - 1);
                                }}
                                className={cn(page <= 1 && 'pointer-events-none opacity-50')}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="px-4 text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page < totalPages) setPage((p) => p + 1);
                                }}
                                className={cn(page >= totalPages && 'pointer-events-none opacity-50')}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <AddItemDialog
                open={addOpen}
                categories={categories}
                onClose={() => setAddOpen(false)}
                onSuccess={() => {
                    setAddOpen(false);
                    invalidateList();
                }}
            />
            <EditItemDialog
                item={selectedItem}
                open={editOpen}
                categories={categories}
                onClose={() => {
                    setEditOpen(false);
                    setSelectedItem(null);
                }}
                onSuccess={() => {
                    setEditOpen(false);
                    setSelectedItem(null);
                    invalidateList();
                }}
            />
            <DeleteItemDialog
                item={selectedItem}
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedItem(null);
                }}
                onSuccess={() => {
                    setDeleteOpen(false);
                    setSelectedItem(null);
                    invalidateList();
                }}
            />
            <InventoryDialog
                items={pickerItems}
                open={inventoryOpen}
                onClose={() => setInventoryOpen(false)}
                onSuccess={() => {
                    setInventoryOpen(false);
                    invalidateList();
                }}
            />
        </div>
    );
}
