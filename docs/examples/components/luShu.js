import React, {Component} from 'react';
import {LuShu, NavigationControl, Map} from '../../../src';
import {pathes} from './lushPath';

// 自定义组件
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCurrent: false,
            state: 1,
            speed: 2,
        };
    }

    componentDidMount() {
        this.timer = setTimeout(
            () => { this.timeHandle(this); },
            1000,
        );
    }

    timeHandle() {
        this.setState({
            isCurrent: !this.state.isCurrent,
        });

        this.timer = setTimeout(
            () => this.timeHandle(this),
            10000,
        );
    }

    getEvents() {
        return {
            click: (e) => {
                console.log('map click event', e, type);
            }
        }
    }

    onButtonClicke(){
        this.setState({
            isCurrent: !this.state.isCurrent
        })
    }

    render() {
        console.log(this.state.isCurrent);
        return (
            <div>
                <button onClick={this.onButtonClicke}>按钮</button>
                <LuShu
                    isCurrent={this.state.isCurrent}
                    state={this.state.state}
                    speed={this.state.speed}
                    showInfo
                    speedPath={pathes}
                    style={{height: '250px'}}
                    enableScrollWheelZoom={false}
                    center={{lng: '116.403981', lat: '39.927773'}}
                    zoom='13'
                    // mapStyle={{style: 'midnight'}} // 个性化底图配置
                    events={this.getEvents()} // 为地图添加各类监听事件
                    render={(map)=>{
                        return <div style={{
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                            background: 'red',
                        }}>自定义render</div>
                    }}
                >
                    <NavigationControl/>
                </LuShu>
            </div>
        )
    }
}

