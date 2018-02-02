'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// import Tip from './Tip.js';

function TipLable(options) {
    this.options = options;
    var map = options.map;
    var point = options.point;
    this.point = point;
    var name = options.name;
    var offset = options.offset;

    this.map = map;
    // var tip = this.tip = new Tip(options);

    var marker = this.marker = new BMap.Marker(this.point);

    var label = new BMap.Label(name, offset);

    marker.setLabel(label);

    var self = this;
    marker.addEventListener('dragging', function () {
        self.point = marker.point;
        // tip.setPosition(marker.point)
        options.change && options.change();
    });
    marker.addEventListener('dragend', function () {
        options.changePosition && options.changePosition(self.point);
    });
    marker.enableDragging();
}

TipLable.prototype.show = function () {
    this.map.addOverlay(this.marker);
    // this.map.addOverlay(this.tip);
    if (this.options.isShowTipArrow === false) {
        this.tip.hideArrow();
    }
};

TipLable.prototype.hide = function () {
    this.map.removeOverlay(this.marker);
    // this.map.removeOverlay(this.tip);
};

TipLable.prototype.setNumberLeft = function () {
    this.tip.setNumberLeft();
};

TipLable.prototype.setNumberRight = function () {
    this.tip.setNumberRight();
};

TipLable.prototype.hideNumber = function () {
    this.tip.hideNumber();
};

exports.default = TipLable;