'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CategoryApiService, CreateCategoryInput } from '@/lib/services/api';

interface AddCategoryDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddCategoryDialog({ open, onClose, onSuccess }: AddCategoryDialogProps) {
    const [form, setForm] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);

    const reset = () => setForm({ name: '', description: '' });

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }
        setLoading(true);
        try {
            const payload: CreateCategoryInput = {
                name: form.name.trim(),
                description: form.description.trim() || undefined,
            };
            const res = await CategoryApiService.create(payload);
            if (!res.success) {
                toast.error(res.message || 'Failed to create category');
                return;
            }
            toast.success('Category created successfully');
            reset();
            onSuccess();
        } catch {
            toast.error('Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        label="Name *"
                        placeholder="e.g. Fruits & Vegetables"
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
                        <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
