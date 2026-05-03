import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { CategoryService } from '../category/services/category.service';
import { GroceryService } from '../grocery/services/grocery.service';

const CATEGORIES = [
    { name: 'Fruits & Vegetables', description: 'Fresh seasonal fruits and vegetables' },
    { name: 'Dairy & Eggs', description: 'Milk, cheese, yogurt, and eggs' },
    { name: 'Bread & Bakery', description: 'Freshly baked breads, pastries, and cakes' },
    { name: 'Beverages', description: 'Juices, sodas, water, and hot drinks' },
    { name: 'Snacks & Pantry', description: 'Chips, cereals, sauces, and pantry staples' },
];

const ITEMS_BY_CATEGORY: Record<string, { name: string; description: string; price: number; quantity: number }[]> = {
    'Fruits & Vegetables': [
        { name: 'Organic Apples', description: 'Crisp red apples, per kg', price: 3.99, quantity: 120 },
        { name: 'Bananas', description: 'Ripe yellow bananas, bunch of 6', price: 1.49, quantity: 200 },
        { name: 'Baby Spinach', description: 'Pre-washed baby spinach leaves, 200g', price: 2.79, quantity: 80 },
        { name: 'Roma Tomatoes', description: 'Firm roma tomatoes, per kg', price: 2.99, quantity: 150 },
        { name: 'Broccoli', description: 'Fresh broccoli crown, each', price: 1.99, quantity: 90 },
        { name: 'Strawberries', description: 'Sweet strawberries, 500g punnet', price: 4.49, quantity: 60 },
        { name: 'Carrots', description: 'Organic carrots, 1kg bag', price: 1.79, quantity: 110 },
        { name: 'Avocados', description: 'Hass avocados, each', price: 1.99, quantity: 75 },
        { name: 'Mangoes', description: 'Alphonso mangoes, each', price: 2.49, quantity: 50 },
        { name: 'Sweet Corn', description: 'Fresh sweet corn cob, each', price: 0.99, quantity: 180 },
    ],
    'Dairy & Eggs': [
        { name: 'Full Cream Milk', description: 'Fresh full cream milk, 2L', price: 3.29, quantity: 140 },
        { name: 'Free Range Eggs', description: 'Cage-free large eggs, dozen', price: 5.99, quantity: 100 },
        { name: 'Greek Yogurt', description: 'Plain Greek yogurt, 500g', price: 4.49, quantity: 70 },
        { name: 'Cheddar Cheese', description: 'Aged cheddar block, 500g', price: 6.99, quantity: 55 },
        { name: 'Butter', description: 'Salted butter, 250g', price: 3.79, quantity: 90 },
        { name: 'Mozzarella', description: 'Fresh mozzarella ball, 125g', price: 3.49, quantity: 65 },
        { name: 'Sour Cream', description: 'Full fat sour cream, 300ml', price: 2.99, quantity: 80 },
        { name: 'Cream Cheese', description: 'Philadelphia cream cheese, 250g', price: 4.29, quantity: 60 },
        { name: 'Skim Milk', description: 'Skim milk, 2L', price: 2.99, quantity: 120 },
        { name: 'Cottage Cheese', description: 'Low fat cottage cheese, 400g', price: 3.49, quantity: 45 },
    ],
    'Bread & Bakery': [
        { name: 'Sourdough Loaf', description: 'Artisan sourdough, whole loaf', price: 5.49, quantity: 40 },
        { name: 'Whole Wheat Bread', description: 'Sliced whole wheat bread, 700g', price: 3.29, quantity: 85 },
        { name: 'Croissants', description: 'Butter croissants, pack of 4', price: 4.99, quantity: 50 },
        { name: 'Bagels', description: 'Plain bagels, pack of 6', price: 3.99, quantity: 60 },
        { name: 'Blueberry Muffins', description: 'Fresh blueberry muffins, pack of 4', price: 5.29, quantity: 35 },
        { name: 'Baguette', description: 'Classic French baguette, each', price: 2.49, quantity: 45 },
        { name: 'Rye Bread', description: 'Dark rye bread, sliced, 600g', price: 4.49, quantity: 30 },
        { name: 'Cinnamon Rolls', description: 'Frosted cinnamon rolls, pack of 6', price: 6.99, quantity: 25 },
        { name: 'Pita Bread', description: 'Whole wheat pita, pack of 8', price: 2.99, quantity: 70 },
        { name: 'Brioche Buns', description: 'Soft brioche burger buns, pack of 4', price: 3.79, quantity: 55 },
    ],
    'Beverages': [
        { name: 'Orange Juice', description: 'Freshly squeezed orange juice, 1L', price: 4.99, quantity: 90 },
        { name: 'Sparkling Water', description: 'Natural sparkling water, 1.5L', price: 1.99, quantity: 150 },
        { name: 'Green Tea', description: 'Organic green tea bags, 50 pack', price: 5.49, quantity: 70 },
        { name: 'Cold Brew Coffee', description: 'Ready-to-drink cold brew, 500ml', price: 4.29, quantity: 55 },
        { name: 'Almond Milk', description: 'Unsweetened almond milk, 1L', price: 3.99, quantity: 80 },
        { name: 'Apple Juice', description: 'Clear apple juice, no added sugar, 1L', price: 3.29, quantity: 100 },
        { name: 'Coconut Water', description: 'Pure coconut water, 330ml can', price: 2.49, quantity: 120 },
        { name: 'Kombucha', description: 'Ginger lemon kombucha, 400ml', price: 4.79, quantity: 40 },
        { name: 'Oat Milk', description: 'Barista oat milk, 1L', price: 4.49, quantity: 65 },
        { name: 'Lemonade', description: 'Sparkling lemonade, 750ml', price: 2.99, quantity: 85 },
    ],
    'Snacks & Pantry': [
        { name: 'Mixed Nuts', description: 'Roasted mixed nuts, 400g', price: 8.99, quantity: 60 },
        { name: 'Dark Chocolate', description: '70% dark chocolate bar, 100g', price: 3.49, quantity: 90 },
        { name: 'Olive Oil', description: 'Extra virgin olive oil, 500ml', price: 9.99, quantity: 50 },
        { name: 'Pasta (Penne)', description: 'Bronze-cut penne pasta, 500g', price: 2.79, quantity: 110 },
        { name: 'Tomato Sauce', description: 'Basil tomato pasta sauce, 700g jar', price: 4.29, quantity: 80 },
        { name: 'Granola', description: 'Honey & almond granola, 500g', price: 6.49, quantity: 55 },
        { name: 'Rice Cakes', description: 'Lightly salted rice cakes, 120g', price: 2.49, quantity: 95 },
        { name: 'Peanut Butter', description: 'Smooth natural peanut butter, 350g', price: 5.99, quantity: 70 },
        { name: 'Honey', description: 'Raw organic honey, 500g', price: 7.49, quantity: 45 },
        { name: 'Quinoa', description: 'Organic white quinoa, 500g', price: 6.99, quantity: 40 },
    ],
};

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        private readonly userService: UserService,
        private readonly categoryService: CategoryService,
        private readonly groceryService: GroceryService,
    ) {}

    async onApplicationBootstrap() {
        await this.seed();
    }

    async seed(): Promise<{ message: string; summary: Record<string, number> }> {
        const summary: Record<string, number> = { admins: 0, categories: 0, items: 0 };

        try {
            const existingAdmin = await this.userService.findOne({ where: { email: 'admin@grocify.com' } });
            if (!existingAdmin) {
                await this.userService.registerAdmin({
                    name: 'Grocify Admin',
                    email: 'admin@grocify.com',
                    password: 'Admin123!',
                    phoneNumber: '+10000000000',
                });
                summary.admins = 1;
                this.logger.log('Admin user seeded');
            }

            for (const catData of CATEGORIES) {
                let category = await this.categoryService.findOne({ where: { name: catData.name } });

                if (!category) {
                    category = await this.categoryService.addCategory(catData);
                    summary.categories++;
                }

                const items = ITEMS_BY_CATEGORY[catData.name] ?? [];
                for (const itemData of items) {
                    const existing = await this.groceryService.findOne({ where: { name: itemData.name } });
                    if (!existing) {
                        await this.groceryService.addItem({ ...itemData, categoryId: category.id });
                        summary.items++;
                    }
                }
            }

            if (summary.categories > 0 || summary.items > 0) {
                this.logger.log(`Seeded ${summary.categories} categories, ${summary.items} items`);
            }
        } catch (err) {
            this.logger.error('Seed failed', err);
        }

        return { message: 'Seed completed', summary };
    }
}
