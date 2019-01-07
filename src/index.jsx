const Good = (props) => {
    return (
        <div>{props.data}</div>
    );
}

const Goods = (props) => {
    const [datas, setDatas] = useState([1,2,3]);
    console.log(datas, datas.concat(datas.length+1));
    return (
        <div>
            {datas.map((data, key) => (<Good key={data} data={data} />))}
            <button onClick={() => setDatas(datas.concat(datas.length+1))}>增加</button>
        </div>
    )
};

Dom.render(<Goods />, document.getElementById('root'));
