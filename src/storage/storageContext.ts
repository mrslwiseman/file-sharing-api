export interface StorageStrategy {
  getReadStream(file: string): any;
  getWriteStream(file: string): any;
  delete(file: string): void;
}

class StorageContext {
  private strategy: StorageStrategy;

  constructor(strategy: StorageStrategy) {
    this.strategy = strategy;
  }

  getReadStream(file: string): any {
    return this.strategy.getReadStream(file);
  }

  getWriteStream(file: string): any {
    return this.strategy.getWriteStream(file);
  }

  async delete(file: string): Promise<string | void> {
    return this.strategy.delete(file);
  }
}

export default StorageContext;
