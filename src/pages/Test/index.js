import React from 'react';
import '../../global.css';
let index;
let key;
let list = [
    {
        name : 'Name1',
        age : 22,
        address : '上海',
    },
    {
        name : 'Name2',
        age : 23,
        address : '北京',
    },
    {
        name : 'Name3',
        age : 25,
        address : '南京',
    },
    {
        name : 'Name4',
        age : 19,
        address : '广州',
    },
]
let obj = null
class Test extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value : '',
            obj : '',
            result : ''
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.handleSend = this.handleSend.bind(this)
        this.fetchClassic = this.fetchClassic.bind(this)
    }
    componentDidMount(){
        index = document.getElementById("index");
        key = document.getElementById("key");
    }
    handleSend(){
        if(obj !=null){
            fetch("http://szhtonpal.aiyongbao.com/Szh/encrypt?name="+obj.name
            ).then(res => {
            return res.json();
            }).then(json => {
                this.fetchClassic(json[0])
            });
            //window.location.href='http://szhtonpal.aiyongbao.com/szh.html';
        }
    }
    async fetchClassic(name) {
        const res = await fetch('http://szhtonpal.aiyongbao.com/Szh/setSession?name='+name)
        const json = await res.json()
        if(json[0]){
            window.location.href=json[1];
        }else{
            this.setState({
                result : json[1]
            })
        }
        
    }
    handleSearch(){
        const indexValue = Number(index.value)-1;
        const keyValue = key.value;
        obj = list[indexValue];
        var data = new FormData();
        data.append('method', 'aiyong.foreigntrade.social.getIndexData');
        data.append('namespace','sss')
        data.append('index', indexValue);
        data.append('key', keyValue);
        data.append('list',JSON.stringify(list));
        data.append('obj', JSON.stringify(obj));
        fetch('http://szhtonpal.aiyongbao.com/api', {
            method: 'post',
            body:  data,
        }).then(res => {
        return res.json();
        }).then(json => {
            let value = `${json[0]}`;
            let objTest = `${json[1].name}-${json[1].age}-${json[1].address}`;
            this.setState({
                value : value,
                obj : objTest
            })
            console.log(json);
        });
    }
    render(){
        return (
            <div>
                    <select id="index">
                        <option style={{display: "none"}} defaultValue>索引</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <select id="key">
                        <option style={{display: "none"}} defaultValue>字段</option>
                        <option value="name">姓名</option>
                        <option value="age">年龄</option>
                        <option value="address">地址</option>
                    </select>
                    <button id="search" onClick={this.handleSearch}>查询</button>
                    <button id="send" onClick={this.handleSend}>发送</button>
                    <p>{this.state.value}</p>
                    <p>{this.state.obj}</p>
                    <p id="result">发送结果:{this.state.result}</p>
            </div>
        )
    }
}
export default Test;