interface UserDto {
    init(): Promise<void>;
    register(user: Required<Omit<User, "id" | "salt">>): Promise<number>;
    getUser(userId: number): Promise<Omit<User, 'password' | 'salt'>>;
    authenticate(email: string, password: string): Promise<number>;
};

interface ProductDto {
    init(): Promise<void>;
    register(product: Required<Omit<Product, "id">>): Promise<number>;
    getProductsByUser(userId: number): Promise<Required<Product>[]>;
    delete(product: number | { id: number }): Promise<void>;
};

interface PriceHistoryDto {
    init(): Promise<void>;
    getProductPriceHistory(product: number): Promise<PriceHistory[]>;
};