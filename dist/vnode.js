function isSameVnode(oldVnode, vnode) {
    return oldVnode.tag === vnode.tag && oldVnode.key === vnode.key;
}

function isEmptyChildren(children) {
    return !children || children.length === 0;
}

function isPrimitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}

function getComponentVnode(vnode, isCreate) {
    componentVnode = vnode;
    isCreate && (firstRun = true) && (vnode.state = []) && (vnode.setters = []);
    cursor = 0;
    var _vnode = vnode.tag(vnode.props);
    firstRun = false;
    cursor = 0;
    componentVnode = null;
    return _vnode;
}
function createElm(vnode) {
    if (vnode.tag === undefined) {
        vnode.elm = document.createTextNode(vnode.text || '');
    } else {
        if (typeof vnode.tag === 'function') {
            // 创建新dom 判断如果是组件，自带一个更新功能
            var componentVnode = getComponentVnode(vnode, true);
            vnode.updater = new Dom(componentVnode);
            return vnode.elm = createElm(componentVnode);
        }
        vnode.elm = document.createElement(vnode.tag);
        if (vnode.text !== undefined) {
            vnode.elm.textContent = vnode.text;
        } else if (!isEmptyChildren(vnode.children)) {
            vnode.children.forEach(_vnode => {
                vnode.elm.appendChild(createElm(_vnode));
            });
        }
    }
    Dom.hook.create.forEach(create => {
        create(vnode);
    });
    return vnode.elm;
}

class Dom {

    constructor(vnode) {
        this.oldVnode = vnode;
    }

    getIdents(vnodes) {
        return vnodes.reduce((total, vnode, index) => {
            if (total[vnode.tag + (vnode.key || '')]) {
                total[vnode.tag + (vnode.key || '')].push(index);
            } else {
                total[vnode.tag + (vnode.key || '')] = [index];
            }
            return total;
        }, {});
    }

    createElm(vnode) {
        return createElm(vnode);
    }

    insertBeforeVnode(elm, insertElm) {
        insertElm.parentNode.insertBefore(elm, insertElm);
    }

    insertAfterVnode(elm, insertElm) {
        const parent = insertElm.parentNode;
        if (parent.lastChild === insertElm) {
            parent.appendChild(elm);
        } else {
            parent.insertBefore(elm, insertElm.nextSibling);
        }
    }

    removeVnode(parent, vnode) {
        Dom.hook.remove.forEach(remove => {
            remove(vnode);
        });
        parent.removeChild(vnode.elm);
    }

    updateChildren(parentElement, oldVnodes, vnodes) {
        const oldIdents = this.getIdents(oldVnodes);
        vnodes.forEach((vnode, index) => {
            let key = vnode.tag + (vnode.key || '');
            if (oldIdents[key]) {
                var oldVnode = oldVnodes[oldIdents[key][0]];
                this.patchVnode(oldVnode, vnode);
                index && this.insertAfterVnode(oldVnode.elm, vnodes[index - 1].elm);
                oldIdents[key].shift();
            } else {
                index ? this.insertAfterVnode(this.createElm(vnode), vnodes[index - 1].elm) : this.insertBeforeVnode(this.createElm(vnode), oldVnodes[0].elm);
            }
        });
        for (var keys in oldIdents) {
            oldIdents[keys].forEach(key => this.removeVnode(parentElement, oldVnodes[key]));
        }
    }

    patchVnode(oldVnode, vnode) {
        const elm = vnode.elm = oldVnode.elm;
        if (typeof vnode.tag === 'function') {
            vnode.updater = oldVnode.updater;
            vnode.state = oldVnode.state;
            vnode.setters = oldVnode.setters;
            return vnode.updater.render(getComponentVnode(vnode));
        }
        const newChildren = vnode.children;
        const oldChildren = oldVnode.children;
        Dom.hook.update.forEach(update => {
            update(oldVnode, vnode);
        });
        if (oldVnode.text === undefined && vnode.text === undefined) {
            if (!isEmptyChildren(oldChildren) && !isEmptyChildren(newChildren)) this.updateChildren(elm, oldChildren, newChildren);else if (!isEmptyChildren(oldChildren)) elm.textContent = ''; // 清空
            else if (!isEmptyChildren(newChildren)) newChildren.forEach(_vnode => elm.appendChild(this.createElm(_vnode)));else return;
        } else {
            elm.textContent = vnode.text || '';
        }
    }

    patch(oldVnode, vnode) {
        if (isSameVnode(oldVnode, vnode)) {
            this.patchVnode(oldVnode, vnode);
        } else {
            const parent = oldVnode.elm.parentNode;
            this.insertBeforeVnode(this.createElm(vnode), oldVnode.elm);
            this.removeVnode(parent, oldVnode);
        }
        return vnode;
    }

    render(vnode) {
        if (this.oldVnode) {
            this.patch(this.oldVnode, vnode);
        }
        return this.oldVnode = vnode;
    }
}

Dom.render = function (vnode, elm) {
    var componentVnode = getComponentVnode(vnode, true);
    vnode.elm = createElm(componentVnode);
    vnode.updater = new Dom(componentVnode);
    elm.appendChild(vnode.elm);
};

Dom.vnode = function (tag, props, ...children) {
    if (typeof tag === 'function') {
        // 如果是自定义组件
        props && children.length && (props.children = children);
        return {
            tag,
            props,
            key: props && props.key
        };
    }
    var event = {};
    var key;
    var _children = [];
    children && (_children = []) && children.forEach(c => {
        if (Array.isArray(c)) _children = _children.concat(c);else _children.push(c);
    });
    if (props) {
        props.className && (props['class'] = props.className);
        delete props.className;
        key = props.key;
        delete props.key;
        Object.keys(props).forEach(key => {
            if (key.slice(0, 2) === 'on') {
                event[key.toLowerCase().slice(2)] = props[key];
                delete props[key];
            }
        });
    }
    return {
        tag,
        text: children.length === 1 && isPrimitive(children[0]) ? children[0] : undefined,
        children: _children,
        props,
        event,
        key
    };
};

Dom.hook = {
    create: [],
    update: [],
    remove: []
};

Dom.injectModlue = function (...modules) {
    modules.forEach(module => {
        Object.keys(module).forEach(key => {
            Dom.hook[key].push(module[key]);
        });
    });
};