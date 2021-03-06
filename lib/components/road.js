'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _mapv = require('mapv');

var _mapLine = require('../utils/map-line');

var _mapLine2 = _interopRequireDefault(_mapLine);

var _geoUtils = require('../utils/geo-utils');

var _geoUtils2 = _interopRequireDefault(_geoUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 道路组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * nikai@baidu.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var App = function (_Component) {
    _inherits(App, _Component);

    function App(args) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, args));

        _this.state = {};
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            this.initialize();
        }
    }, {
        key: 'getRoadPoints',
        value: function getRoadPoints(roadPath) {
            var projection = this.props.map.getMapType().getProjection();
            var points = [];
            for (var i = 0; i < roadPath.length; i++) {
                var tmp = roadPath[i].split(',');
                for (var j = 0; j < tmp.length; j += 2) {
                    if (this.props.coordType === 'bd09mc') {
                        points.push(projection.pointToLngLat(new BMap.Pixel(tmp[j], tmp[j + 1])));
                    } else {
                        points.push(new BMap.Point(tmp[j], tmp[j + 1]));
                    }
                }
            }
            return points;
        }
    }, {
        key: 'updateViewport',
        value: function updateViewport() {
            var _this2 = this;

            var roadPath = this.props.roadPath;
            var points = [];

            if (this.props.roadPaths) {
                this.props.roadPaths.forEach(function (roadPath) {
                    points = points.concat(_this2.getRoadPoints(roadPath));
                });
            } else if (this.props.roadPath) {
                points = points.concat(this.getRoadPoints(this.props.roadPath));
            }

            if (points.length > 0 && this.props.autoViewport !== false) {
                this.props.map.setViewport(points, this.props.viewportOptions);
            }
        }
    }, {
        key: 'getRoadGroup',
        value: function getRoadGroup(roadPath, category, splitList) {
            var roadPath = roadPath;
            var category = category;
            var splitList = splitList;
            var data = {};
            var allPath = [];
            if (category) {
                for (var i = 0; i < category.length; i++) {
                    if (!data[category[i]]) {
                        data[category[i]] = {
                            roadPath: [],
                            color: splitList[category[i]]
                        };
                    }
                    allPath.push(roadPath[i]);
                    data[category[i]].roadPath.push(roadPath[i]);
                }
            } else {
                data[0] = {
                    roadPath: roadPath,
                    color: this.props.color || '#1495ff'
                };
            }
            return {
                group: data,
                allPath: _geoUtils2.default.mergeRoadPath(roadPath)
            };
        }
    }, {
        key: 'isClick',
        value: function isClick(map, pixel, roadPath) {
            var ctx = this.canvasLayer.canvas.getContext('2d');
            var roadGroup = this.getRoadGroup(roadPath);
            ctx.beginPath();
            var lineWidth = this.props.lineWidth || 10;
            _mapLine2.default.drawRoads(map, ctx, roadGroup.allPath, {
                color: '#fff',
                lineWidth: lineWidth + 4,
                lineCap: 'butt',
                arrow: false,
                line: false
            });
            ctx.lineWidth = lineWidth + 6;
            var isPointInStroke = ctx.isPointInStroke(pixel.x * window.devicePixelRatio, pixel.y * window.devicePixelRatio);
            return isPointInStroke;
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var _this3 = this;

            var map = this.props.map;
            if (!map) {
                return;
            }

            var _update = this.canvasLayerUpdate.bind(this);
            if (this.canvasLayer) {
                this.canvasLayer.draw();
            } else {
                this.canvasLayer = new _mapv.baiduMapCanvasLayer({
                    zIndex: this.props.zIndex,
                    map: map,
                    update: function update() {
                        _update(this);
                    }
                });
                if (this.props.onClick) {
                    map.addEventListener('click', function (e) {

                        var isClick = false;
                        if (_this3.props.roadPaths) {
                            for (var i = 0; i < _this3.props.roadPaths.length; i++) {
                                var roadPath = _this3.props.roadPaths[i];
                                isClick = _this3.isClick(map, e.pixel, roadPath);
                                if (isClick) {
                                    _this3.props.onClick(i);
                                }
                            };
                        } else if (_this3.props.roadPath) {
                            isClick = _this3.isClick(map, e.pixel, _this3.props.roadPath);
                            if (isClick) {
                                _this3.props.onClick();
                            }
                        }
                    });
                }
            }

            this.updateViewport();
        }
    }, {
        key: 'canvasLayerUpdate',
        value: function canvasLayerUpdate(canvasLayer) {
            var _this4 = this;

            var ctx = canvasLayer.canvas.getContext('2d');
            if (!ctx) {
                return false;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            var roadPath = this.props.roadPath;
            var roadPaths = this.props.roadPaths;

            var lineWidth = this.props.lineWidth || 10;

            if (roadPaths) {
                roadPaths.forEach(function (roadPath, index) {
                    if (_this4.props.lineWidths) {
                        lineWidth = _this4.props.lineWidths[index];
                    }
                    _this4.drawRoad(ctx, roadPath, _this4.props.category, _this4.props.splitList, lineWidth);
                });
            } else if (roadPath) {
                this.drawRoad(ctx, this.props.roadPath, this.props.category, this.props.splitList, lineWidth);
            }
        }
    }, {
        key: 'drawRoad',
        value: function drawRoad(ctx, roadPath, category, splitList, lineWidth) {
            var roadGroup = this.getRoadGroup(roadPath, category, splitList);
            var data = roadGroup.group;

            _mapLine2.default.drawRoads(this.props.map, ctx, roadGroup.allPath, {
                color: '#fff',
                coordType: this.props.coordType,
                lineWidth: lineWidth + 4,
                lineCap: 'butt',
                arrow: false,
                line: true
            });

            for (var key in data) {
                var item = data[key];
                var roadPath = _geoUtils2.default.mergeRoadPath(item.roadPath);
                _mapLine2.default.drawRoads(this.props.map, ctx, roadPath, {
                    color: item.color,
                    coordType: this.props.coordType,
                    line: true,
                    lineWidth: lineWidth,
                    lineCap: 'butt',
                    arrow: false
                });
            };

            _mapLine2.default.drawRoads(this.props.map, ctx, roadGroup.allPath, {
                color: item.color,
                coordType: this.props.coordType,
                lineWidth: lineWidth,
                border: {},
                lineCap: 'butt',
                arrow: this.props.isShowArrow !== false ? {
                    width: 5,
                    height: 3
                } : false
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.initialize();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.canvasLayer.hide();
        }
    }]);

    return App;
}(_component2.default);

exports.default = App;