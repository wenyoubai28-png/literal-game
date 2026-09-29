const Inventory = {
    items: [],
    init() {},
    addItem(item) {},
    removeItem(itemId) {},
    hasItem(itemId) { return false; },
    getItems() { return this.items; }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Inventory;
}