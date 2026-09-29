const Characters = {
    npcs: {},
    init() {},
    getNPC(id) { return this.npcs[id]; },
    changeAffection(id, amount) {}
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Characters;
}