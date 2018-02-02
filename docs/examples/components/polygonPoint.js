import React, {Component} from 'react';
import {PolygonPoints, NavigationControl} from '../../../src';

// 自定义组件
function CustomComponent(props) {
    return <div style={{position: 'absolute', left: '0', top: '0',  color: 'white'}}>自定义组件</div>;
}

export default class App extends Component {
    getEvents() {
        return {
            polygoncomplete: () => {
                console.log(e.point, e.type);
            },
            dblclick: (e) => {
                console.log(e.point, e.type);
            },
            click: (e) => {
                // console.log(e.point, e.type);
                // console.log('map click event', e, type);
            },
            rightclick: (e) => {
            console.log(e.point, e.type);
            // console.log('map click event', e, type);
                },
        }
    }

    render() {
        return <PolygonPoints
            fillColor='red'
            strokeColor='yellow'
            style={{height: '250px'}}
            enableScrollWheelZoom={false}
            center={{lng: '116.503981', lat: '39.927773'}}
            zoom='13'
            events={this.getEvents()} // 为地图添加各类监听事
            polygoncomplete={(e) => console.log(e)}
        >
            <CustomComponent />
            <NavigationControl/>
        </PolygonPoints>
    }
}

