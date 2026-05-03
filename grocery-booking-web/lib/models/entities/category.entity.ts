export type CategoryEntity = {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type CategoryWithProductsEntity = CategoryEntity & {
    products: import('./grocery-item.entity').GroceryItemEntity[];
};
