interface UserDto {
    init(): Promise<void>;
    register(user: Required<Omit<User, "id" | "salt">>): Promise<number>;
    getUser(userId: number): Promise<Omit<User, 'password' | 'salt'>>;
    authenticate(email: string, password: string): Promise<number>;
};