import { itemManager, ItemCategory, ItemStatus, type Item, type QueryCondition } from './itemManager';

// 物品管理工具
export const itemTools = {
    createItem: {
        beforeLoadingText: '正在创建物品...',
        afterLoadingText: '物品创建成功！继续执行任务...',
        func: (args: { items: Item[] }) => {
            return itemManager.createItem(args.items)
        }
    },
    updateItem: {
        beforeLoadingText: '正在更新物品...',
        afterLoadingText: '物品更新成功！继续执行任务...',
        func: (args: { id: string, updates: Partial<Item> }) => {
            return itemManager.updateItem(args.id, args.updates)
        }
    },
    deleteItem: {
        beforeLoadingText: '正在删除物品...',
        afterLoadingText: '物品删除成功！继续执行任务...',
        func: (args: { id: string }) => {
            return itemManager.deleteItem(args.id)
        }
    },
    queryItems: {
        beforeLoadingText: '正在查询物品...',
        afterLoadingText: '物品查询成功！继续执行任务...',
        func: (args: { condition: QueryCondition }) => {
            return itemManager.queryItems(args.condition)
        }
    },
    getExpiredItems: {
        beforeLoadingText: '正在查询过期物品...',
        afterLoadingText: '过期物品查询成功！继续执行任务...',
        func: () => {
            return itemManager.getExpiredItems()
        }
    },
    getLowStockItems: {
        beforeLoadingText: '正在查询库存不足物品...',
        afterLoadingText: '库存不足物品查询成功！继续执行任务...',
        func: (args: { threshold: number }) => {
            return itemManager.getLowStockItems(args.threshold)
        }
    },
}

// 定义 Function Calling 的接口
export const tools = [
    {
        "type": "function",
        "function": {
            "name": "createItem",
            "description": "批量创建新的物品记录",
            "parameters": {
                "type": "object",
                "properties": {
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": { "type": "string", "description": "物品名称" },
                                "category": { "type": "string", "enum": Object.values(ItemCategory), "description": "物品分类" },
                                "location": { "type": "string", "description": "存放位置" },
                                "price": { "type": "number", "description": "价格" },
                                "purchaseDate": { "type": "string", "description": "购买日期" },
                                "productionDate": { "type": "string", "description": "生产日期" },
                                "expiryDate": { "type": "string", "description": "过期日期" },
                                "description": { "type": "string", "description": "物品描述" },
                                "quantity": { "type": "number", "description": "数量" },
                                "unit": { "type": "string", "description": "单位" },
                                "status": { "type": "string", "enum": Object.values(ItemStatus), "description": "状态" },
                                "brand": { "type": "string", "description": "品牌" },
                                "notes": { "type": "string", "description": "备注" }
                            },
                            "required": ["name", "category", "location", "price", "purchaseDate", "quantity", "unit", "status"]
                        },
                        "description": "要创建的物品数组"
                    }
                },
                "required": ["items"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "queryItems",
            "description": "查询物品列表",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": { "type": "string", "description": "物品名称关键词" },
                    "category": { "type": "string", "enum": Object.values(ItemCategory), "description": "物品分类" },
                    "location": { "type": "string", "description": "存放位置" },
                    "status": { "type": "string", "enum": Object.values(ItemStatus), "description": "状态" },
                    "startDate": { "type": "string", "description": "开始日期" },
                    "endDate": { "type": "string", "description": "结束日期" },
                    "minPrice": { "type": "number", "description": "最低价格" },
                    "maxPrice": { "type": "number", "description": "最高价格" }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "updateItem",
            "description": "更新物品信息，应先查询queryItems，获取物品ID，然后调用此函数",
            "parameters": {
                "type": "object",
                "properties": {
                    "id": { "type": "string", "description": "物品ID" },
                    "updates": {
                        "type": "object",
                        "properties": {
                            "name": { "type": "string", "description": "物品名称" },
                            "category": { "type": "string", "enum": Object.values(ItemCategory), "description": "物品分类" },
                            "location": { "type": "string", "description": "存放位置" },
                            "price": { "type": "number", "description": "价格" },
                            "purchaseDate": { "type": "string", "description": "购买日期" },
                            "productionDate": { "type": "string", "description": "生产日期" },
                            "expiryDate": { "type": "string", "description": "过期日期" },
                            "description": { "type": "string", "description": "物品描述" },
                            "quantity": { "type": "number", "description": "数量" },
                            "unit": { "type": "string", "description": "单位" },
                            "status": { "type": "string", "enum": Object.values(ItemStatus), "description": "状态" },
                            "brand": { "type": "string", "description": "品牌" },
                            "notes": { "type": "string", "description": "备注" }
                        }
                    }
                },
                "required": ["id", "updates"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "deleteItem",
            "description": "删除物品，应先查询queryItems，获取物品ID，然后调用此函数",
            "parameters": {
                "type": "object",
                "properties": {
                    "id": { "type": "string", "description": "物品ID" }
                },
                "required": ["id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "getExpiredItems",
            "description": "获取过期物品列表",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "getLowStockItems",
            "description": "获取库存不足物品列表",
            "parameters": {
                "type": "object",
                "properties": {
                    "threshold": { "type": "number", "description": "库存阈值" }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "getCurrentTimestamp",
            "description": "获取当前时间戳",
        }
    }
];
