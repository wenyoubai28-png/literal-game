const UI = (function() {
    const elements = {
        day: null,
        money: null,
        energy: null,
        reputation: null,
        storyText: null,
        actionButtons: null,
        btnSave: null,
        btnLoad: null,
        btnReset: null
    };

    let actionHandlers = {};
    let saveHandler = null;
    let loadHandler = null;
    let resetHandler = null;

    function cacheElements() {
        elements.day = document.getElementById('day');
        elements.money = document.getElementById('money');
        elements.energy = document.getElementById('energy');
        elements.reputation = document.getElementById('reputation');
        elements.storyText = document.getElementById('story-text');
        elements.actionButtons = document.getElementById('action-buttons');
        elements.btnSave = document.getElementById('btn-save');
        elements.btnLoad = document.getElementById('btn-load');
        elements.btnReset = document.getElementById('btn-reset');
    }

    function bindEvents() {
        if (elements.btnSave) {
            elements.btnSave.addEventListener('click', () => saveHandler?.());
        }
        if (elements.btnLoad) {
            elements.btnLoad.addEventListener('click', () => loadHandler?.());
        }
        if (elements.btnReset) {
            elements.btnReset.addEventListener('click', () => resetHandler?.());
        }
    }

    function init() {
        cacheElements();
        bindEvents();
        renderState(window.state || {});
        renderStory('欢迎来到文字游戏世界！请选择你的行动开始冒险。');
        renderActions(getDefaultActions());
    }

    function renderState(state) {
        if (!state) return;
        updateElement(elements.day, state.day);
        updateElement(elements.money, state.money);
        updateElement(elements.energy, state.energy);
        updateElement(elements.reputation, state.reputation);
    }

    function updateElement(el, value) {
        if (el && value !== undefined) {
            el.textContent = value;
        }
    }

    function renderStory(text) {
        if (elements.storyText) {
            elements.storyText.textContent = text;
            elements.storyText.style.animation = 'none';
            elements.storyText.offsetHeight;
            elements.storyText.style.animation = 'fade-in 0.4s ease-out';
        }
    }

    function renderActions(actions) {
        if (!elements.actionButtons) return;

        elements.actionButtons.innerHTML = '';

        if (!actions || actions.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'no-actions';
            emptyMsg.style.cssText = 'text-align:center;color:var(--text-muted);padding:20px;';
            emptyMsg.textContent = '暂无可用行动';
            elements.actionButtons.appendChild(emptyMsg);
            return;
        }

        actions.forEach((action, index) => {
            const btn = createActionButton(action, index);
            elements.actionButtons.appendChild(btn);
        });
    }

    function createActionButton(action, index) {
        const btn = document.createElement('button');
        btn.className = `action-btn ${action.type || ''}`;
        btn.textContent = action.label || '未知行动';
        btn.disabled = action.disabled === true;

        if (action.description) {
            btn.title = action.description;
        }

        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            const handler = actionHandlers[action.id];
            if (handler) {
                handler(action);
            }
        });

        btn.style.animation = `fade-in 0.3s ease-out ${index * 0.05}s both`;
        return btn;
    }

    function getDefaultActions() {
        return [
            { id: 'work', label: '💼 工作', type: 'primary', description: '消耗 20 体力，获得 10 金钱' },
            { id: 'rest', label: '😴 休息', type: 'success', description: '恢复 30 体力，消耗 1 天' },
            { id: 'wander', label: '🚶 闲逛', type: 'warning', description: '消耗 10 体力，可能触发随机事件' }
        ];
    }

    function setActionHandler(actionId, handler) {
        actionHandlers[actionId] = handler;
    }

    function removeActionHandler(actionId) {
        delete actionHandlers[actionId];
    }

    function setSaveHandler(handler) {
        saveHandler = handler;
    }

    function setLoadHandler(handler) {
        loadHandler = handler;
    }

    function setResetHandler(handler) {
        resetHandler = handler;
    }

    function showMessage(message, type = 'info') {
        renderStory(message);
    }

    function disableAction(actionId) {
        const btn = elements.actionButtons?.querySelector(`[data-action-id="${actionId}"]`);
        if (btn) btn.disabled = true;
    }

    function enableAction(actionId) {
        const btn = elements.actionButtons?.querySelector(`[data-action-id="${actionId}"]`);
        if (btn) btn.disabled = false;
    }

    return {
        init,
        renderState,
        renderStory,
        renderActions,
        setActionHandler,
        removeActionHandler,
        setSaveHandler,
        setLoadHandler,
        setResetHandler,
        showMessage,
        disableAction,
        enableAction
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}