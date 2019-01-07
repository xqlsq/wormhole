class Model {
    constructor(data, callback) {
        this._data = data;
        this._callback = callback;
        this._canRender = false;
    }

    get data() {
        return this._data;
    }

    set(obj) {
        this._canRender = true;
        Object.assign(this._data, obj);
        Promise.resolve().then(() => {
            if (this._canRender) {
                this._callback();
            }
            this._canRender = false;
        });
    }
}
window.Model = Model;