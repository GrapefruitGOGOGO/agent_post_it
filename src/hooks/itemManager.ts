import dayjs from "dayjs";

// 物品分类枚举
export enum ItemCategory {
    FOOD = '食品',
    DAILY_NECESSITIES = '日用品',
    ELECTRONICS = '电器',
    CLOTHING = '衣物',
    MEDICINE = '药品',
    OTHER = '其他'
}

// 物品状态枚举
export enum ItemStatus {
    IN_USE = '在用',
    FINISHED = '已用完',
    EXPIRED = '已过期',
    STORED = '已存储'
}

// 物品接口定义
export interface Item {
    id: string;
    name: string;
    category: ItemCategory;
    location: string;
    price: number;
    purchaseDate: string;
    productionDate: string;
    expiryDate: string;
    createDate: string;
    updateDate: string;
    description: string;
    quantity: number;
    unit: string;
    status: ItemStatus;
    brand: string;
    notes: string;
}

// 查询条件接口
export interface QueryCondition {
    name?: string;
    category?: ItemCategory;
    location?: string;
    status?: ItemStatus;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
}

class ItemManager {
    private static instance: ItemManager;
    private readonly STORAGE_KEY = 'home_items';
    private items: Item[] = [];

    private constructor() {
        this.loadItems();
    }

    public static getInstance(): ItemManager {
        if (!ItemManager.instance) {
            ItemManager.instance = new ItemManager();
        }
        return ItemManager.instance;
    }

    // 加载数据
    private loadItems(): void {
        const storedData = localStorage.getItem(this.STORAGE_KEY);
        if (storedData) {
            try {
                this.items = JSON.parse(storedData);
            } catch (error) {
                console.error('加载数据失败:', error);
                this.items = [];
            }
        }
    }

    // 保存数据
    private saveItems(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }

    // 创建物品
    public async createItem(item: Omit<Item, 'id' | 'createDate' | 'updateDate'> | Omit<Item, 'id' | 'createDate' | 'updateDate'>[]): Promise<Item | Item[]> {
        // 处理数组输入
        if (Array.isArray(item)) {
            const newItems: Item[] = item.map(singleItem => ({
                ...singleItem,
                id: crypto.randomUUID(),
                createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updateDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }));

            this.items.push(...newItems);
            this.saveItems();
            return newItems;
        }

        // 处理单个物品输入
        const newItem: Item = {
            ...item,
            id: crypto.randomUUID(),
            createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            updateDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };

        this.items.push(newItem);
        this.saveItems();
        return newItem;
    }

    // 更新物品
    public async updateItem(id: string, updates: Partial<Item>): Promise<Item | null> {
        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) return null;

        this.items[index] = {
            ...this.items[index],
            ...updates,
            updateDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };

        this.saveItems();
        return this.items[index];
    }

    // 删除物品
    public async deleteItem(id: string): Promise<boolean> {
        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) return false;

        this.items.splice(index, 1);
        this.saveItems();
        return true;
    }

    // 查询物品
    public async queryItems(condition: QueryCondition = {}): Promise<Item[]> {
        return this.items.filter(item => {
            if (condition.name && !item.name.includes(condition.name)) return false;
            if (condition.category && item.category !== condition.category) return false;
            if (condition.location && !item.location.includes(condition.location)) return false;
            if (condition.status && item.status !== condition.status) return false;

            if (condition.startDate && new Date(item.purchaseDate) < new Date(condition.startDate)) return false;
            if (condition.endDate && new Date(item.purchaseDate) > new Date(condition.endDate)) return false;

            if (condition.minPrice !== undefined && item.price < condition.minPrice) return false;
            if (condition.maxPrice !== undefined && item.price > condition.maxPrice) return false;

            return true;
        });
    }

    // 获取单个物品
    public async getItem(id: string): Promise<Item | null> {
        return this.items.find(item => item.id === id) || null;
    }

    // 获取所有物品
    public async getAllItems(): Promise<Item[]> {
        return [...this.items];
    }

    // 获取过期物品
    public async getExpiredItems(): Promise<Item[]> {
        const now = dayjs();
        return this.items.filter(item =>
            dayjs(item.expiryDate).isBefore(now) && item.status !== ItemStatus.EXPIRED
        );
    }

    // 获取库存不足物品
    public async getLowStockItems(threshold: number = 1): Promise<Item[]> {
        return this.items.filter(item => item.quantity <= threshold);
    }

    // 导出数据
    public async exportData(): Promise<string> {
        return JSON.stringify(this.items, null, 2);
    }

    // 导入数据
    public async importData(data: string): Promise<boolean> {
        try {
            const importedItems = JSON.parse(data);
            if (!Array.isArray(importedItems)) return false;

            this.items = importedItems;
            this.saveItems();
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
}

export const itemManager = ItemManager.getInstance(); 