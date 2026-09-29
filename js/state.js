window.state = {
    day: 1,
    money: 20,
    energy: 100,
    reputation: 0
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.state;
}