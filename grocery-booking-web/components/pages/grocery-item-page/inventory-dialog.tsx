'use client';

import { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ItemApiService, InventoryCircularItemInput } from '@/lib/services/api';
import { GroceryItemEntity } from '@/lib/models/entities';

interface CircularRow extends InventoryCircularItemInput {
    _key: number;
}

interface InventoryDialogProps {
    items: GroceryItemEntity[];
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function InventoryDialog({ items, open, onClose, onSuccess }: InventoryDialogProps) {
    const [title, setTitle] = useState('');
    const [reason, setReason] = useState('');
    const [rows, setRows] = useState<CircularRow[]>([
        { _key: 0, groceryItemId: '', action: 'add', quantity: 1 },
    ]);
    const [loading, setLoading] = useState(false);
    const keyRef = useRef(1);

    const handleClose = () => {
        setTitle('');
        setReason('');
        setRows([{ _key: 0, groceryItemId: '', action: 'add', quantity: 1 }]);
        onClose();
    };

    const addRow = () => {
        setRows((prev) => [
            ...prev,
            { _key: keyRef.current++, groceryItemId: '', action: 'add', quantity: 1 },
        ]);
    };

    const removeRow = (key: number) => {
        setRows((prev) => prev.filter((r) => r._key !== key));
    };

    const updateRow = (key: number, patch: Partial<InventoryCircularItemInput>) => {
        setRows((prev) => prev.map((r) => (r._key === key ? { ...r, ...patch } : r)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }
        const validRows = rows.filter((r) => r.groceryItemId && r.quantity > 0);
        if (validRows.length === 0) {
            toast.error('Add at least one valid inventory row');
            return;
        }
        setLoading(true);
        try {
            const res = await ItemApiService.updateInventory({
                title: title.trim(),
                reason: reason.trim() || undefined,
                items: validRows.map(({ groceryItemId, action, quantity }) => ({
                    groceryItemId,
                    action,
                    quantity,
                })),
            });
            if (!res.success) {
                toast.error(res.message || 'Failed to update inventory');
                return;
            }
            toast.success('Inventory updated successfully');
            handleClose();
            onSuccess();
        } catch {
            toast.error('Failed to update inventory');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Update Inventory</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Circular Title *"
                        placeholder="e.g. Weekly stock restock"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Reason (optional)</label>
                        <Textarea
                            placeholder="Why are you updating the inventory?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-16"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground">Items</label>
                            <Button type="button" size="sm" variant="outline" onClick={addRow}>
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                Add Row
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {rows.map((row) => (
                                <div key={row._key} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                                    <Select
                                        value={row.groceryItemId}
                                        onValueChange={(v) => updateRow(row._key, { groceryItemId: v })}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue placeholder="Select item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {items.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={row.action}
                                        onValueChange={(v) =>
                                            updateRow(row._key, { action: v as 'add' | 'subtract' | 'set' })
                                        }
                                    >
                                        <SelectTrigger className="w-28 h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="add">Add</SelectItem>
                                            <SelectItem value="subtract">Subtract</SelectItem>
                                            <SelectItem value="set">Set</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Qty"
                                        className="w-20"
                                        value={String(row.quantity)}
                                        onChange={(e) =>
                                            updateRow(row._key, { quantity: parseInt(e.target.value, 10) || 0 })
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                        onClick={() => removeRow(row._key)}
                                        disabled={rows.length === 1}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Applying...' : 'Apply Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
