/**
 * @file 地图主文件
 * @author kyle(hinikai@gmail.com)
 */

import React from 'react';
import Component from './component';
import {isString} from '../utils/common';

export default class Map extends Component {

    constructor(args) {
        super(args);
    }

    /**
     * 设置默认的props属性
     */
    static get defaultProps() {
        return {
            style: {
                // height: '350px'
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

        var styleOptions = {
            strokeColor: this.props.strokeColor || "red",    //边线颜色。
            fillColor: this.props.fillColor || "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: this.props.strokeWeight || 3,       //边线的宽度，以像素为单位。
            strokeOpacity: this.props.strokeOpacity || 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: this.props.fillOpacity || 0.6,      //填充的透明度，取值范围0 - 1。
            strokeStyle: this.props.strokeStyle || 'solid' //边线的样式，solid或dashed。
        };


        var overlays = [];

        //实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
                drawingModes: [BMAP_DRAWING_POLYGON],
            },
            polygonOptions: styleOptions, //多边形的样式
        });
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('polygoncomplete', (e, overlay) => {

            for (var i = 0; i < overlays.length; i++) {
                map.removeOverlay(overlays[i]);
            }

            overlays.length = 0
            overlays.push(overlay);

            this.props.polygoncomplete && this.props.polygoncomplete(overlay.getPath());
        });


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
        return (
            <div style={style}>
                <div ref='map' className={this.props.className} style={{height: '100%'}}>
                    加载地图中...
                </div>
                {this.renderChildren()}
                {this.onRender()}
            </div>
        );
    }
}
