'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ItemApiService, UpdateItemInput } from '@/lib/services/api';
import { GroceryItemEntity, CategoryEntity } from '@/lib/models/entities';

interface EditItemDialogProps {
    item: GroceryItemEntity | null;
    open: boolean;
    categories: CategoryEntity[];
    onClose: () => void;
    onSuccess: () => void;
}

export function EditItemDialog({ item, open, categories, onClose, onSuccess }: EditItemDialogProps) {
    const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setForm({
                name: item.name,
                description: item.description ?? '',
                price: String(item.price),
                categoryId: item.categoryId ?? '',
            });
        }
    }, [item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;
        setLoading(true);
        try {
            const payload: UpdateItemInput = {
                name: form.name.trim() || undefined,
                description: form.description.trim() || undefined,
                price: form.price ? parseFloat(form.price) : undefined,
                categoryId: form.categoryId || undefined,
            };
            const res = await ItemApiService.update(item.id, payload);
            if (!res.success) {
                toast.error(res.message || 'Failed to update item');
                return;
            }
            toast.success('Item updated successfully');
            onSuccess();
        } catch {
            toast.error('Failed to update item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        label="Name"
                        placeholder="Item name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Description</label>
                        <Textarea
                            placeholder="Short product description"
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            className="min-h-20"
                        />
                    </div>
                    <Input
                        label="Price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={form.price}
                        onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Category</label>
                        <Select
                            value={form.categoryId}
                            onValueChange={(v) => setForm((p) => ({ ...p, categoryId: v }))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a category (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
