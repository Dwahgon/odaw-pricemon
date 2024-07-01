interface PriceHistory {
    url: string,
    priceHistory: {
        price: number,
        timestamp: Date,
    }[]
}