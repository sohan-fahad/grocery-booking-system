export type GroceryItemImage = {
    id: string;
    link: string;
    key: string;
};

export type GroceryItemCategory = {
    id: string;
    name: string;
};

export type GroceryItemEntity = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    quantity: number;
    imageId: string | null;
    image: GroceryItemImage | null;
    categoryId: string | null;
    category: GroceryItemCategory | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};
