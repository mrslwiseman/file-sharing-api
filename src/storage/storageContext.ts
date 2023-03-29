import { Stream } from "node:stream";

export interface StorageStrategy {
    getReadStream(file: string): any,
    getWriteStream(file: string): any
}

class StorageContext {
    private strategy: StorageStrategy;

    constructor(strategy: StorageStrategy) {
        this.strategy = strategy;
    }

    getReadStream(file: string): any {
        return this.strategy.getReadStream(file)
    }

    getWriteStream(file: string): any {
        return this.strategy.getWriteStream(file)
    }
}

export default StorageContext;