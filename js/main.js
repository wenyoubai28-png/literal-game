function initGame() {
    if (typeof State !== 'undefined' && State.init) State.init();
    if (typeof Events !== 'undefined' && Events.init) Events.init();
    if (typeof Characters !== 'undefined' && Characters.init) Characters.init();
    if (typeof Inventory !== 'undefined' && Inventory.init) Inventory.init();
    if (typeof UI !== 'undefined' && UI.init) UI.init();
    if (typeof Save !== 'undefined' && Save.init) Save.init();

    setupActionHandlers();
}

function setupActionHandlers() {
    if (typeof UI === 'undefined') return;

    UI.setActionHandler('work', () => {
        if (window.state && (window.state.energy || 0) >= 20) {
            window.state.money = (window.state.money || 0) + 10;
            window.state.energy = Math.max(0, (window.state.energy || 0) - 20);
            UI.renderState(window.state);
            UI.renderStory('你努力工作了一天，获得了 10 金钱，消耗了 20 体力。');
        } else if (window.state) {
            UI.showMessage('⚠️ 体力不足！至少需要 20 体力才能工作。', 'warning');
        }
    });

    UI.setActionHandler('rest', () => {
        if (window.state) {
            window.state.energy = Math.min(100, (window.state.energy || 0) + 30);
            window.state.day = (window.state.day || 1) + 1;
            UI.renderState(window.state);
            UI.renderStory('你休息了一天，恢复了 30 体力，第二天到来了。');
        }
    });

    UI.setActionHandler('wander', () => {
        if (window.state && (window.state.energy || 0) >= 10) {
            window.state.energy = Math.max(0, (window.state.energy || 0) - 10);
            UI.renderState(window.state);
            UI.renderStory('你在街上闲逛，消耗了 10 体力，不过没有发生什么特别的事。');
        } else if (window.state) {
            UI.showMessage('⚠️ 体力不足！至少需要 10 体力才能闲逛。', 'warning');
        }
    });

    UI.setSaveHandler(() => {
        if (typeof Save !== 'undefined' && window.state) {
            const success = Save.save(window.state);
            UI.showMessage(success ? '💾 游戏已保存！' : '❌ 保存失败', success ? 'success' : 'error');
        }
    });

    UI.setLoadHandler(() => {
        if (typeof Save !== 'undefined') {
            const data = Save.load();
            if (data) {
                window.state = data;
                UI.renderState(window.state);
                UI.renderStory('📂 游戏已读取！');
            } else {
                UI.showMessage('❌ 没有找到存档', 'error');
            }
        }
    });

    UI.setResetHandler(() => {
        if (confirm('确定要重新开始吗？这将清除当前进度。')) {
            window.state = {
                day: 1,
                money: 20,
                energy: 100,
                reputation: 0
            };
            UI.renderState(window.state);
            UI.renderStory('🔄 游戏已重置，欢迎重新开始冒险！');
        }
    });
}

function render() {
    if (typeof UI !== 'undefined' && window.state) {
        UI.renderState(window.state);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initGame, render };
}