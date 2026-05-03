'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ItemApiService } from '@/lib/services/api';
import { GroceryItemEntity } from '@/lib/models/entities';

interface DeleteItemDialogProps {
    item: GroceryItemEntity | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function DeleteItemDialog({ item, open, onClose, onSuccess }: DeleteItemDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!item) return;
        setLoading(true);
        try {
            await ItemApiService.delete(item.id);
            toast.success('Item deleted');
            onSuccess();
        } catch {
            toast.error('Failed to delete item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete Item</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-foreground">{item?.name}</span>? This action cannot be undone.
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
