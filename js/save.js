const Save = (function() {
    const STORAGE_KEY = 'literal-game-save';
    const MAX_SAVES = 5;

    function getSaveData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('读取存档失败:', e);
            return null;
        }
    }

    function setSaveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('保存存档失败:', e);
            return false;
        }
    }

    function getAllSaves() {
        try {
            const data = localStorage.getItem(STORAGE_KEY + '-list');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function setAllSaves(saves) {
        try {
            localStorage.setItem(STORAGE_KEY + '-list', JSON.stringify(saves));
            return true;
        } catch (e) {
            console.error('保存存档列表失败:', e);
            return false;
        }
    }

    function generateSaveInfo(state) {
        return {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            displayTime: new Date().toLocaleString('zh-CN'),
            day: state.day || 1,
            money: state.money || 0,
            energy: state.energy || 0,
            reputation: state.reputation || 0
        };
    }

    function save(state) {
        if (!state) return false;

        const saveInfo = generateSaveInfo(state);
        const saveData = {
            ...state,
            _saveInfo: saveInfo
        };

        const success = setSaveData(saveData);

        if (success) {
            const saves = getAllSaves();
            saves.unshift(saveInfo);
            if (saves.length > MAX_SAVES) {
                saves.pop();
            }
            setAllSaves(saves);
        }

        return success;
    }

    function load() {
        return getSaveData();
    }

    function deleteSave(saveId) {
        const saves = getAllSaves();
        const filtered = saves.filter(s => s.id !== saveId);
        return setAllSaves(filtered);
    }

    function clearAll() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY + '-list');
        return true;
    }

    function hasSave() {
        return getSaveData() !== null;
    }

    function getSaveList() {
        return getAllSaves();
    }

    function exportSave() {
        const data = getSaveData();
        if (!data) return null;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `literal-game-save-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        return true;
    }

    function importSave(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data && typeof data === 'object') {
                    const success = setSaveData(data);
                    if (success && data._saveInfo) {
                        const saves = getAllSaves();
                        saves.unshift(data._saveInfo);
                        if (saves.length > MAX_SAVES) saves.pop();
                        setAllSaves(saves);
                    }
                    callback?.(success, data);
                } else {
                    callback?.(false, null);
                }
            } catch (err) {
                console.error('导入存档失败:', err);
                callback?.(false, null);
            }
        };
        reader.readAsText(file);
    }

    return {
        save,
        load,
        deleteSave,
        clearAll,
        hasSave,
        getSaveList,
        exportSave,
        importSave
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Save;
}