import { access, readFile,writeFile } from "fs/promises";
import path from "path";
import { Category, CategoryList } from "../books.scrapper.types";


export class ItemsService {
    private filePath: string;
    constructor() {
        this.filePath = path.join(__dirname, "categories.json")
    }
    
    checkFileExists = async (): Promise<boolean> => {
        try {
            await access(this.filePath);
            return true;
        } catch (error) {
            return false;
        }
    }

    createFile = async (): Promise<void> => {
        const defaultData: CategoryList = { categoryList: [] };
        await writeFile(this.filePath, JSON.stringify(defaultData, null, 2));
    }


    getItemsService = async (): Promise<CategoryList> => {
        const exists = await this.checkFileExists();
        if (!exists) {
            await this.createFile();
        }
        
        const items = await readFile(this.filePath, "utf8");
        const parsed = JSON.parse(items);
        
        if (Array.isArray(parsed)) {
            return { categoryList: parsed };
        }
        
        return parsed.categoryList ? parsed : { categoryList: [] };
    }
    
    saveItemsService = async (items: CategoryList): Promise<void> => {
        await writeFile(this.filePath, JSON.stringify(items, null, 2));
    }
    
    getCategoryService = async (id?: number, name?: string): Promise<Category | null> => {
        const items = await this.getItemsService();

        if (!items.categoryList || items.categoryList.length === 0) {
            return null;
        }
        
        if(id !== undefined && id !== null) {
            const idNumber = Number(id);
            const category = items.categoryList.find(category => category.id === idNumber);
            return category || null;
        }
        if(name) {
            const category = items.categoryList.find(category => category.name === name);
            return category || null;
        }
        return null;
    }
}


