'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ItemApiService, CreateItemInput } from '@/lib/services/api';
import { CategoryEntity } from '@/lib/models/entities';

interface AddItemDialogProps {
    open: boolean;
    categories: CategoryEntity[];
    onClose: () => void;
    onSuccess: () => void;
}

export function AddItemDialog({ open, categories, onClose, onSuccess }: AddItemDialogProps) {
    const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '', categoryId: '' });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const reset = () => {
        setForm({ name: '', description: '', price: '', quantity: '', categoryId: '' });
        setFile(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.quantity) {
            toast.error('Name, price, and quantity are required');
            return;
        }
        setLoading(true);
        try {
            const payload: CreateItemInput = {
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                price: parseFloat(form.price),
                quantity: parseInt(form.quantity, 10),
                file: file ?? undefined,
                categoryId: form.categoryId || undefined,
            };
            const res = await ItemApiService.create(payload);
            if (!res.success) {
                toast.error(res.message || 'Failed to add item');
                return;
            }
            toast.success('Item added successfully');
            reset();
            onSuccess();
        } catch {
            toast.error('Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Grocery Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        label="Name *"
                        placeholder="e.g. Organic Apples"
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
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Price *"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={form.price}
                            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                        />
                        <Input
                            label="Quantity *"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={form.quantity}
                            onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
                        />
                    </div>
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
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Image (optional)</label>
                        <div
                            className="flex items-center gap-3 rounded-lg border border-dashed border-input p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => fileRef.current?.click()}
                        >
                            <ImageIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                            <span className="text-sm text-muted-foreground truncate flex-1">
                                {file ? file.name : 'Click to select an image'}
                            </span>
                            {file && (
                                <button
                                    type="button"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
