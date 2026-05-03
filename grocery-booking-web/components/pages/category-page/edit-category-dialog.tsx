'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CategoryApiService, UpdateCategoryInput } from '@/lib/services/api';
import { CategoryEntity } from '@/lib/models/entities';

interface EditCategoryDialogProps {
    category: CategoryEntity | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditCategoryDialog({ category, open, onClose, onSuccess }: EditCategoryDialogProps) {
    const [form, setForm] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setForm({
                name: category.name,
                description: category.description ?? '',
            });
        }
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) return;
        setLoading(true);
        try {
            const payload: UpdateCategoryInput = {
                name: form.name.trim() || undefined,
                description: form.description.trim() || undefined,
            };
            const res = await CategoryApiService.update(category.id, payload);
            if (!res.success) {
                toast.error(res.message || 'Failed to update category');
                return;
            }
            toast.success('Category updated successfully');
            onSuccess();
        } catch {
            toast.error('Failed to update category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        label="Name"
                        placeholder="Category name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Description</label>
                        <Textarea
                            placeholder="Short category description"
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            className="min-h-20"
                        />
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
