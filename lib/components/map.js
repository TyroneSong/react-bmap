'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _common = require('../utils/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 地图主文件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author kyle(hinikai@gmail.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Map = function (_Component) {
    _inherits(Map, _Component);

    function Map(args) {
        _classCallCheck(this, Map);

        return _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, args));
    }

    /**
     * 设置默认的props属性
     */


    _createClass(Map, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.initMap();
            this.forceUpdate();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var preCenter = prevProps.center;
            var center = this.props.center;

            if ((0, _common.isString)(center)) {
                // 可以传入城市名
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
    }, {
        key: 'initMap',
        value: function initMap() {
            var _this2 = this;

            // 创建Map实例
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

            if ((0, _common.isString)(this.props.center)) {
                // 可以传入城市名
                map.centerAndZoom(this.props.center);
            } else {
                // 正常传入经纬度坐标
                var center = new BMap.Point(this.props.center.lng, this.props.center.lat);
                map.centerAndZoom(center, zoom); // 初始化地图,设置中心点坐标和地图级别
            }

            this.bindToggleMeghods(map, this.toggleMethods);
            this.bindEvent(map, this.events);

            var lastZoom = zoom;
            map.addEventListener('zoomend', function () {
                var zoom = map.getZoom();
                _this2.props.zoom_changed && _this2.props.zoom_changed(zoom, lastZoom);
                lastZoom = zoom;
            });
        }
    }, {
        key: 'renderChildren',
        value: function renderChildren() {
            var _this3 = this;

            var children = this.props.children;


            if (!children || !this.map) return;

            return _react2.default.Children.map(children, function (child) {

                if (!child) {
                    return;
                }

                if (typeof child.type === 'string') {
                    return child;
                } else {
                    return _react2.default.cloneElement(child, {
                        map: _this3.map
                    });
                }
            });
        }
    }, {
        key: 'onRender',
        value: function onRender() {

            if (!this.props.render || !this.map) {
                return;
            }

            return this.props.render(this.map);
        }
    }, {
        key: 'render',
        value: function render() {
            var style = {
                height: '100%',
                position: 'relative'
            };
            for (var key in this.props.style) {
                style[key] = this.props.style[key];
            }
            return _react2.default.createElement(
                'div',
                { style: style },
                _react2.default.createElement(
                    'div',
                    { ref: 'map', className: this.props.className, style: { height: '100%' } },
                    '\u52A0\u8F7D\u5730\u56FE\u4E2D...'
                ),
                this.renderChildren(),
                this.onRender()
            );
        }
    }, {
        key: 'events',


        /**
         * 获取可以给地图绑定的事件名
         */
        get: function get() {
            return ['click', 'dblclick', 'rightclick', 'rightdblclick', 'maptypechange', 'mousemove', 'mouseover', 'mouseout', 'movestart', 'moving', 'moveend', 'zoomstart', 'zoomend', 'addoverlay', 'addcontrol', 'removecontrol', 'removeoverlay', 'clearoverlays', 'dragstart', 'dragging', 'dragend', 'addtilelayer', 'removetilelayer', 'load', 'resize', 'hotspotclick', 'hotspotover', 'hotspotout', 'tilesloaded', 'touchstart', 'touchmove', 'touchend', 'longpress'];
        }
    }, {
        key: 'toggleMethods',
        get: function get() {
            return {
                enableScrollWheelZoom: ['enableScrollWheelZoom', 'disableScrollWheelZoom'],
                enableDragging: ['enableDragging', 'disableDragging'],
                enableDoubleClickZoom: ['enableDoubleClickZoom', 'disableDoubleClickZoom'],
                enableKeyboard: ['enableKeyboard', 'disableKeyboard'],
                enableInertialDragging: ['enableInertialDragging', 'disableInertialDragging'],
                enableContinuousZoom: ['enableContinuousZoom', 'disableContinuousZoom'],
                enablePinchToZoom: ['enablePinchToZoom', 'disablePinchToZoom'],
                enableAutoResize: ['enableAutoResize', 'disableAutoResize']
            };
        }
    }, {
        key: 'options',
        get: function get() {
            return ['minZoom', 'maxZoom', 'mapType', 'enableMapClick'];
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {
                style: {
                    height: '350px'
                }
                /*
                center: {
                    lng: 105.403119,
                    lat: 38.028658
                },
                zoom: 5
                */
            };
        }
    }]);

    return Map;
}(_component2.default);

exports.default = Map;