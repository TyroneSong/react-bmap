/**
 * @file 地图主文件
 * @author kyle(hinikai@gmail.com)
 */

import React from 'react';
import Component from './component';
import {isString} from '../utils/common';

export default class LuShu extends Component {

    constructor(args) {
        super(args);
    }

    /**
     * 设置默认的props属性
     */
    static get defaultProps() {
        return {
            style: {
                height: '600px'
            },
            /*
            center: {
                lng: 105.403119,
                lat: 38.028658
            },
            zoom: 5
            */
        }
    }

    /**
     * 获取可以给地图绑定的事件名
     */
    get events() {
        return [
            'click',
            'dblclick',
            'rightclick',
            'rightdblclick',
            'maptypechange',
            'mousemove',
            'mouseover',
            'mouseout',
            'movestart',
            'moving',
            'moveend',
            'zoomstart',
            'zoomend',
            'addoverlay',
            'addcontrol',
            'removecontrol',
            'removeoverlay',
            'clearoverlays',
            'dragstart',
            'dragging',
            'dragend',
            'addtilelayer',
            'removetilelayer',
            'load',
            'resize',
            'hotspotclick',
            'hotspotover',
            'hotspotout',
            'tilesloaded',
            'touchstart',
            'touchmove',
            'touchend',
            'longpress'
        ];
    }

    get toggleMethods() {
        return {
            enableScrollWheelZoom: ['enableScrollWheelZoom', 'disableScrollWheelZoom'],
            enableDragging: ['enableDragging', 'disableDragging'],
            enableDoubleClickZoom: ['enableDoubleClickZoom', 'disableDoubleClickZoom'],
            enableKeyboard: ['enableKeyboard', 'disableKeyboard'],
            enableInertialDragging: ['enableInertialDragging', 'disableInertialDragging'],
            enableContinuousZoom: ['enableContinuousZoom', 'disableContinuousZoom'],
            enablePinchToZoom: ['enablePinchToZoom', 'disablePinchToZoom'],
            enableAutoResize: ['enableAutoResize', 'disableAutoResize'],
        }
    }

    get options() {
        return [
            'minZoom',
            'maxZoom',
            'mapType',
            'enableMapClick'
        ]
    }

    componentDidMount() {
        this.initMap();
        this.forceUpdate();
    }

    componentDidUpdate(prevProps) {
        var preCenter = prevProps.center;
        var center = this.props.center;

        if (isString(center)) { // 可以传入城市名
            if (preCenter != center) {
                this.map.centerAndZoom(center);
            }
        } else {
            var isCenterChanged = preCenter && center && preCenter.lng != center.lng || preCenter.lat != center.lat || this.props.forceUpdate;
            var isZoomChanged = prevProps.zoom !== this.props.zoom && this.props.zoom || this.props.forceUpdate;
            var center = new BMap.Point(center.lng, center.lat);
            if (isCenterChanged && isZoomChanged) {
                this.map.centerAndZoom(center, this.props.zoom);
            } else if (isCenterChanged) {
                this.map.setCenter(center);
            } else if (isZoomChanged) {
                this.map.zoomTo(this.props.zoom);
            }
        }

    }

    initMap() {
        // 百度地图API功能
        var options = this.options;
        options = this.getOptions(options);
        if (this.props.enableMapClick !== true) {
            options.enableMapClick = false;
        }
        var map = new BMap.Map(this.refs.map, options);

        this.map = map;

        if (this.props.mapStyle) {
            map.setMapStyle(this.props.mapStyle);
        }

        var zoom = this.props.zoom;

        if (isString(this.props.center)) { // 可以传入城市名
            map.centerAndZoom(this.props.center);
        } else { // 正常传入经纬度坐标
            var center = new BMap.Point(this.props.center.lng, this.props.center.lat);
            map.centerAndZoom(center, zoom);  // 初始化地图,设置中心点坐标和地图级别
        }

        this.bindToggleMeghods(map, this.toggleMethods);
        this.bindEvent(map, this.events);

        var path = this.props.speedPath || [];

        const bdPoints = path.map(item => new BMap.Point(item.lng,item.lat));

        map.addOverlay(new BMap.Polyline(bdPoints, {
            strokeColor: this.props.strokeColor || '#0ff',
            strokeOpacity: this.props.strokeOpacity || 0.8,
            strokeWeight: this.props.strokeWeight || '6',
        }));
        map.setViewport(path);

        var lushu = new BMapLib.LuShu(map,path,{
            length: path.length,
            defaultContent:"",
            autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
            icon  : new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)}),
            speed: 450,
            enableRotation:true,//是否设置marker随着道路的走向进行旋转
            landmarkPois: [],
        });

        $("run").onclick = function(){
            console.log('start')
            lushu.start();
        }
        $("stop").onclick = function(){
            console.log('stop')
            lushu.stop();
        }
        $("pause").onclick = function(){
            console.log('pause')
            lushu.pause();
        }
        $("hide").onclick = function(){
            lushu.hideInfoWindow();
        }
        $("show").onclick = function(e){
            console.log(e);
            lushu.showInfoWindow(e);
        }
        function $(element){
            return document.getElementById(element);
        }
    }

    renderChildren() {

        const {children} = this.props;

        if (!children || !this.map) return;

        return React.Children.map(children, child => {

            if (!child) {
                return;
            }

            if (typeof child.type === 'string') {
                return child;
            } else {
                return React.cloneElement(child, {
                    map: this.map
                });
            }

        })

    }

    onRender() {

        if (!this.props.render || !this.map) {
            return;
        }

        return this.props.render(this.map);
    }

    render() {
        var style = {
            height: '100%',
            position: 'relative'
        };
        for (var key in this.props.style) {
            style[key] = this.props.style[key];
        }
        const showInfo = this.props.showInfo || false;
        return (
            <div style={style}>
                <div ref='map' className={this.props.className} style={{height: '100%'}}>
                    加载地图中...
                </div>
                {this.renderChildren()}
                {this.onRender()}
                <button id="run">开始</button>
                <button id="stop">停止</button>
                <button id="pause">暂停</button>
                {showInfo && <button id="hide">隐藏信息窗口</button>}
                {showInfo && <button id="show">展示信息窗口</button>}
            </div>
        );
    }
}
