'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CategoryApiService } from '@/lib/services/api';
import { CategoryEntity } from '@/lib/models/entities';
import { AddCategoryDialog } from './add-category-dialog';
import { EditCategoryDialog } from './edit-category-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';

export function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryEntity[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryEntity | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await CategoryApiService.getAll({ searchTerm: search || undefined, page: 1, limit: 50 });
            if (res.success) {
                setCategories(res.data ?? []);
                setTotal(res.meta?.total ?? 0);
            } else {
                toast.error(res.message || 'Failed to load categories');
            }
        } catch {
            toast.error('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(fetchCategories, 300);
        return () => clearTimeout(t);
    }, [fetchCategories]);

    const openEdit = (cat: CategoryEntity) => {
        setSelectedCategory(cat);
        setEditOpen(true);
    };

    const openDelete = (cat: CategoryEntity) => {
        setSelectedCategory(cat);
        setDeleteOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Categories</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {total} categor{total !== 1 ? 'ies' : 'y'} total
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchCategories} disabled={isLoading}>
                        <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button size="sm" onClick={() => setAddOpen(true)}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Category
                    </Button>
                </div>
            </div>

            <div className="max-w-sm">
                <Input
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                />
            </div>

            <div className="rounded-xl border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                    Loading categories...
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                    {search
                                        ? 'No categories match your search.'
                                        : 'No categories yet. Add your first category.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground max-w-xs truncate">
                                        {cat.description ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={cat.isActive ? 'default' : 'secondary'}>
                                            {cat.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(cat.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button size="icon-sm" variant="ghost" onClick={() => openEdit(cat)}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                size="icon-sm"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => openDelete(cat)}
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

            <AddCategoryDialog
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onSuccess={() => { setAddOpen(false); fetchCategories(); }}
            />
            <EditCategoryDialog
                category={selectedCategory}
                open={editOpen}
                onClose={() => { setEditOpen(false); setSelectedCategory(null); }}
                onSuccess={() => { setEditOpen(false); setSelectedCategory(null); fetchCategories(); }}
            />
            <DeleteCategoryDialog
                category={selectedCategory}
                open={deleteOpen}
                onClose={() => { setDeleteOpen(false); setSelectedCategory(null); }}
                onSuccess={() => { setDeleteOpen(false); setSelectedCategory(null); fetchCategories(); }}
            />
        </div>
    );
}
