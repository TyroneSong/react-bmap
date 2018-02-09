import React, { Component } from 'react';
import {Map, MarkLabel} from '../../../src'
import {simpleMapStyle} from './mapstyle'

export default class App extends Component {
    render() {
        return <Map center = {{
                lng: 116.404556,
                lat: 39.91582
            }} 
            style={{
                height: '500px'
            }} 
            zoom = '12' 
            mapStyle={simpleMapStyle}>
            <MarkLabel data={[
                {
                    name: '阜成门',
                    point: {
                        lng: 116.35629191343,
                        lat: 39.923656708429
                    }
                },
                {
                    style: { backgroundColor: '#0f0', color: '#fff', fontWeight: 'bold' },
                    offset: {offset:new BMap.Size(20,-10)},
                    name: '东大桥00000',
                    point: {
                        lng: 116.45165158593,
                        lat: 39.922979382266
                    }
                },
                {
                    name: '复兴门',
                    point: {
                        lng: 116.3566138544,
                        lat: 39.907146730611
                    }
                },
                {
                    name: '国贸',
                    point: {
                        lng: 116.46007926258,
                        lat: 39.908464623343
                    }
                },
                {
                    name: '青年路',
                    point: {
                        lng: 116.5174653022,
                        lat: 39.923132911536
                    }
                },
                {
                    name: '宋家庄',
                    point: {
                        lng: 116.4283725021,
                        lat: 39.84602609593
                    }
                },
                {
                    name: '西直门',
                    point: {
                        lng: 116.3555775438,
                        lat: 39.940171435273
                    }
                },
                {
                    name: '苏州街',
                    point: {
                        lng: 116.30623351961,
                        lat: 39.975748497825
                    }
                },
                {
                    name: '团结湖',
                    point: {
                        lng: 116.46174509945,
                        lat: 39.933704360624
                    }
                },
                {
                    name: '人民大学',
                    point: {
                        lng: 116.32148092791,
                        lat: 39.967049268766
                    }
                }
            ]}
            changePosition={(point, index) => {
                console.log(point, index);
            }}
            />
        </Map>
    }
}
