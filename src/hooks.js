var firstRun = true;
var cursor = 0;

function createSetter(cursor) {
    var vnode = componentVnode;
    return function setterWithCursor(newVal) {
        vnode.state[cursor] = newVal;
        vnode.updater.render(getComponentVnode(vnode));
    };
}

function useState(initVal) {
    if (firstRun) {
        componentVnode.state.push(initVal);
        componentVnode.setters.push(createSetter(cursor));
    }

    const setter = componentVnode.setters[cursor];
    const value = componentVnode.state[cursor];

    cursor++;
    console.log(componentVnode);
    return [value, setter];
}