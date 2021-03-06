'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _CustomOverlay = require('../overlay/CustomOverlay');

var _CustomOverlay2 = _interopRequireDefault(_CustomOverlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 地图标注组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author kyle(hinikai@gmail.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var defaultIconUrl = 'http://webmap1.map.bdstatic.com/wolfman/static/common/images/markers_new2x_fbb9e99.png';

var icons = {
    'simple_red': new BMap.Icon(defaultIconUrl, new BMap.Size(42 / 2, 66 / 2), {
        imageOffset: new BMap.Size(-454 / 2, -378 / 2),
        anchor: new BMap.Size(42 / 2 / 2, 66 / 2),
        imageSize: new BMap.Size(600 / 2, 600 / 2)
    }),
    'simple_blue': new BMap.Icon(defaultIconUrl, new BMap.Size(42 / 2, 66 / 2), {
        imageOffset: new BMap.Size(-454 / 2, -450 / 2),
        anchor: new BMap.Size(42 / 2 / 2, 66 / 2),
        imageSize: new BMap.Size(600 / 2, 600 / 2)
    }),
    'loc_red': new BMap.Icon(defaultIconUrl, new BMap.Size(46 / 2, 70 / 2), {
        imageOffset: new BMap.Size(-400 / 2, -378 / 2),
        anchor: new BMap.Size(46 / 2 / 2, 70 / 2),
        imageSize: new BMap.Size(600 / 2, 600 / 2)
    }),
    'loc_blue': new BMap.Icon(defaultIconUrl, new BMap.Size(46 / 2, 70 / 2), {
        imageOffset: new BMap.Size(-400 / 2, -450 / 2),
        anchor: new BMap.Size(46 / 2 / 2, 70 / 2),
        imageSize: new BMap.Size(600 / 2, 600 / 2)
    }),
    'start': new BMap.Icon(defaultIconUrl, new BMap.Size(50 / 2, 80 / 2), {
        imageOffset: new BMap.Size(-400 / 2, -278 / 2),
        anchor: new BMap.Size(50 / 2 / 2, 80 / 2),
        imageSize: new BMap.Size(600 / 2, 600 / 2)
    }),
    'end': new BMap.Icon(defaultIconUrl, new BMap.Size(50 / 2, 80 / 2), {
        imageOffset: new BMap.Size(-450 / 2, -278 / 2),
        anchor: new BMap.Size(50 / 2 / 2, 80 / 2),
        imageSize: new BMap.Size(600 / 2, 600 / 2)
    })
};

for (var i = 1; i <= 10; i++) {
    icons['red' + i] = new BMap.Icon(defaultIconUrl, new BMap.Size(42 / 2, 66 / 2), {
        imageOffset: new BMap.Size(0 - 42 / 2 * (i - 1), 0),
        anchor: new BMap.Size(42 / 2 / 2, 66 / 2 / 2),
        imageSize: new BMap.Size(600 / 2, 600 / 2)
    });
}

var App = function (_Component) {
    _inherits(App, _Component);

    function App(args) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, args));

        _this.state = {};
        return _this;
    }

    /**
     * 设置默认的props属性
     */


    _createClass(App, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            this.initialize();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.initialize();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destroy();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.props.map.removeOverlay(this.marker);
            this.marker = null;
        }
    }, {
        key: 'initialize',
        value: function initialize() {

            var map = this.props.map;
            if (!map) {
                return;
            }

            this.destroy();

            var icon;
            var propsIcon = this.props.icon;

            if (propsIcon && propsIcon instanceof BMap.Icon) {
                icon = propsIcon;
            } else {
                if (propsIcon && icons[propsIcon]) {
                    icon = icons[propsIcon];
                } else {
                    icon = icons.simple_red;
                }
            }

            if (this.props.coordType === 'bd09mc') {
                var projection = map.getMapType().getProjection();
                var position = projection.pointToLngLat(new BMap.Pixel(this.props.position.lng, this.props.position.lat));
            } else {
                var position = new BMap.Point(this.props.position.lng, this.props.position.lat);
            }

            if ('children' in this.props) {
                this.contentDom = document.createElement('div');
                var child = this.props.children;
                (0, _reactDom.render)(_react2.default.createElement(
                    'div',
                    null,
                    child
                ), this.contentDom);
                this.marker = new _CustomOverlay2.default(position, this.contentDom, this.props.offset);
                map.addOverlay(this.marker);
            } else {
                var options = this.getOptions(this.options);
                options.icon = icon;
                this.marker = new BMap.Marker(position, options);
                if (this.props.isTop) {
                    this.marker.setTop(true);
                }
                this.bindEvent(this.marker, this.events);

                map.addOverlay(this.marker);
                this.bindToggleMeghods(this.marker, this.toggleMethods);
            }

            if (this.props.autoViewport) {
                map.panTo(position);
            }

            if (this.props.autoCenterAndZoom) {
                map.setViewport([position], this.props.centerAndZoomOptions);
            }
        }
    }, {
        key: 'events',


        /**
         * 获取可以给marker绑定的事件名
         */
        get: function get() {
            return ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseout', 'mouseover', 'remove', 'infowindowclose', 'infowindowopen', 'dragstart', 'dragging', 'dragend', 'rightclick'];
        }
    }, {
        key: 'toggleMethods',
        get: function get() {
            return {
                enableMassClear: ['enableMassClear', 'disableMassClear'],
                enableDragging: ['enableDragging', 'disableDragging']
            };
        }
    }, {
        key: 'options',
        get: function get() {
            return ['offset', 'icon', 'enableMassClear', 'enableDragging', 'enableClicking', 'raiseOnDrag', 'draggingCursor', 'rotation', 'shadow', 'title'];
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {};
        }
    }]);

    return App;
}(_component2.default);

exports.default = App;