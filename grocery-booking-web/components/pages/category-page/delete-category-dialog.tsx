'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CategoryApiService } from '@/lib/services/api';
import { CategoryEntity } from '@/lib/models/entities';

interface DeleteCategoryDialogProps {
    category: CategoryEntity | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function DeleteCategoryDialog({ category, open, onClose, onSuccess }: DeleteCategoryDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!category) return;
        setLoading(true);
        try {
            await CategoryApiService.delete(category.id);
            toast.success('Category deleted');
            onSuccess();
        } catch {
            toast.error('Failed to delete category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-foreground">{category?.name}</span>? Items in this category
                    will be unlinked but not deleted.
                </p>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
