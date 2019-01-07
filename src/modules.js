// dom属性更改
var attrModule = {
    create(vnode) {
        var { elm } = vnode;
        vnode.props && Object.keys(vnode.props).forEach((key) => {
            elm.setAttribute(key, vnode.props[key]);
        });
    },
    update(preVnode, vnode) {
        var { elm } = vnode;
        if (vnode.props && preVnode.props) {
            Object.keys(vnode.props).forEach((key) => {
                if (preVnode.props[key] !== vnode.props[key] ) {
                    elm.setAttribute(key, vnode.props[key]);
                    delete preVnode.props[key];
                }
            });
            Object.keys(preVnode.props).forEach((key) => {
                elm.removeAttribute(key);
            });
        } else if (vnode.props) {
            Object.keys(vnode.props).forEach((key) => {
                elm.setAttribute(key, value);
            });
        } else if (preVnode.props) {
            Object.keys(preVnode.props).forEach((key) => {
                elm.removeAttribute(key);
            });
        }
    }
}

var eventModule = {
    create(vnode) {
        if (vnode.event) {
            Object.keys(vnode.event).forEach((event) => {
                vnode.elm.addEventListener(event, vnode.event[event]);
            });
        }
    },
    update(preVnode, vnode) {
        var { elm } = vnode;
        if (vnode.event && preVnode.event) {
            Object.keys(vnode.event).forEach((event) => {
                if (preVnode.event[event].toString() !== vnode.event[event].toString()) {
                    elm.addEventListener(event, vnode.event[event]);
                    delete preVnode.event[event];
                }
            });
            Object.keys(preVnode.event).forEach((event) => {
                elm.removeEventListener(event, vnode.event[event]);
            });
        } else if (vnode.event) {
            Object.keys(vnode.event).forEach((event) => {
                elm.addEventListener(event, value);
            });
        } else if (preVnode.event) {
            Object.keys(preVnode.event).forEach((event) => {
                elm.removeEventListener(event, vnode.event[event]);
            });
        }
    },
    remove(vnode) {
        if (vnode.event) {
            Object.keys(vnode.event).forEach((event) => {
                vnode.elm.removeEventListener(event, vnode.event[event]);
            });
        }
    },
}

Dom.injectModlue(attrModule, eventModule);
