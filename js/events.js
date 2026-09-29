const Events = {
    list: [],
    init() {},
    getRandomEvent() { return null; },
    checkEventConditions() { return false; }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Events;
}