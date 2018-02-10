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
    var style = options.style;
    var icon = options.icon;

    this.map = map;
    // var tip = this.tip = new Tip(options);
    var myIcon = icon ? new BMap.Icon(icon.url, new BMap.Size(icon.size.width, icon.size.height), { //小车图片
        //offset: new BMap.Size(0, -5),    //相当于CSS精灵
        imageOffset: new BMap.Size(0, 0) //图片的偏移量。为了是图片底部中心对准坐标点。
    }) : {};
    var marker = this.marker = icon ? new BMap.Marker(this.point, { icon: myIcon }) : new BMap.Marker(this.point);

    var label = new BMap.Label(name, offset);
    label.setStyle(style);

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
    // marker.enableDragging();
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