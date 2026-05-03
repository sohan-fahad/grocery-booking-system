import type { GroceryItemEntity } from './grocery-item.entity';

export type OrderCustomerSummary = {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
};

export type OrderItemEntity = {
    id: string;
    orderId: string;
    groceryItemId: string;
    quantity: number;
    unitPrice: number;
    groceryItem: GroceryItemEntity;
    createdAt: string;
    updatedAt: string;
};

export type OrderEntity = {
    id: string;
    userId: string;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    items: OrderItemEntity[];
    user?: OrderCustomerSummary;
    createdAt: string;
    updatedAt: string;
};
