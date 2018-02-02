import React, {Component} from 'react';
import {LuShu, NavigationControl, Map} from '../../../src';
import {pathes} from './lushPath';

// 自定义组件
export default class App extends Component {
    getEvents() {
        return {
            click: (e) => {
                console.log('map click event', e, type);
            }
        }
    }

    render() {
        console.log(pathes);
        return <LuShu
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
    }
}

