'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 图形基类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author kyle(hinikai@gmail.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Graphy = function (_Component) {
    _inherits(Graphy, _Component);

    function Graphy(args) {
        _classCallCheck(this, Graphy);

        return _possibleConstructorReturn(this, (Graphy.__proto__ || Object.getPrototypeOf(Graphy)).call(this, args));
    }

    _createClass(Graphy, [{
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
            this.props.map.removeOverlay(this.overlay);
            this.overlay = null;
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var map = this.props.map;
            if (!map) {
                return;
            }

            this.destroy();

            this.overlay = this.getOverlay();
            this.bindEvent(this.overlay, this.events);
            map.addOverlay(this.overlay);

            var path = this.overlay.getPath();
            if (path && path.length > 0 && this.props.autoViewport === true) {
                map.setViewport(path, this.props.viewportOptions);
            }
        }
    }, {
        key: 'getOverlay',
        value: function getOverlay() {
            return null;
        }
    }, {
        key: 'options',
        get: function get() {
            return ['strokeColor', 'fillColor', 'strokeWeight', 'strokeOpacity', 'fillOpacity', 'strokeStyle', 'enableMassClear', 'enableEditing', 'enableClicking'];
        }

        /**
         * 获取可以绑定的事件名
         */

    }, {
        key: 'events',
        get: function get() {
            return ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseout', 'mouseover', 'remove', 'lineupdate'];
        }
    }]);

    return Graphy;
}(_component2.default);

exports.default = Graphy;