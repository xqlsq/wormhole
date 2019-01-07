const Good = props => {
    return Dom.vnode(
        'div',
        null,
        props.data
    );
};

const Goods = props => {
    const [datas, setDatas] = useState([1, 2, 3]);
    console.log(datas, datas.concat(datas.length + 1));
    return Dom.vnode(
        'div',
        null,
        datas.map((data, key) => Dom.vnode(Good, { key: data, data: data })),
        Dom.vnode(
            'button',
            { onClick: () => setDatas(datas.concat(datas.length + 1)) },
            '\u589E\u52A0'
        )
    );
};

Dom.render(Dom.vnode(Goods, null), document.getElementById('root'));