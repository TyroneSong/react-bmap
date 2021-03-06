'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @file
 */

/* global map BMap */

var roadColor = {
    0: '#fff',
    1: '#00dc35',
    2: '#f3e032',
    3: '#ff6c6c',
    4: '#900000'
};

var mapLine = {
    /**
     * roads ["116,40,117,59","116,40,117,59",...]
     */
    drawRoads: function drawRoads(map, ctx, roads) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        var zoom = map.getZoom();
        var lineWidth = options.lineWidth || 5;
        var level = options.level === undefined ? 1 : options.level;
        var pointTem = null;
        var dep = 0;
        var lineTotalDepth = 0;

        // arrow info
        var points = [];
        var allPoints = [];
        var arrowPoint = [];
        var arrpwTotalDepth = 0;
        var totalDepth = 0;
        //

        ctx.beginPath();
        var pixel;

        var zoomUnit = Math.pow(2, 18 - map.getZoom());
        var projection = map.getMapType().getProjection();
        var mcCenter = projection.lngLatToPoint(map.getCenter());
        var nwMc = new BMap.Pixel(mcCenter.x - map.getSize().width / 2 * zoomUnit, mcCenter.y + map.getSize().height / 2 * zoomUnit); //左上角墨卡托坐标

        roads.forEach(function (item, index) {
            var startPos = null;
            pointTem = null;
            var path = item.split(',');
            for (var k = 0; k < path.length; k += 2) {
                var point = new BMap.Point(path[k], path[k + 1]);
                allPoints.push(point);
                if (options.coordType === 'bd09mc') {
                    pixel = {
                        x: (point.lng - nwMc.x) / zoomUnit,
                        y: (nwMc.y - point.lat) / zoomUnit
                    };
                } else {
                    pixel = map.pointToPixel(point);
                }
                var arrowInfo = void 0;
                if (pointTem) {
                    var deltaX = pixel.x - pointTem.x;
                    var deltaY = pixel.y - pointTem.y;
                    dep = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    lineTotalDepth += dep;
                    // arrow
                    if (options.arrow) {
                        arrpwTotalDepth += dep;
                        totalDepth += dep;
                        arrowInfo = {
                            start: pointTem,
                            end: pixel,
                            offset: 50 - (arrpwTotalDepth - dep),
                            depth: dep,
                            totalDepth: totalDepth
                        };
                        points.push(arrowInfo);
                        if (arrpwTotalDepth >= 50) {
                            arrowPoint.push(arrowInfo);
                            arrpwTotalDepth %= 50;
                        }
                    }
                    //
                }

                pointTem = pixel;
                // console.log(pixel, k)
                if (k === 0) {
                    startPos = startPos || pixel;
                    ctx.moveTo(pixel.x, pixel.y);
                } else if (lineTotalDepth > 15 || k >= path.length - 2) {
                    lineTotalDepth = 0;
                    ctx.lineTo(pixel.x, pixel.y);
                }
            }

            // for arrow
            // if the line is too short
            if (options.arrow) {
                if (index === item.length - 1 && totalDepth < 100) {
                    var center = points[Math.ceil(points.length / 2)];
                    for (var i in points) {
                        if (points[i].totalDepth >= totalDepth / 2) {
                            center = points[i + 1] ? points[i + 1] : points[i];
                            break;
                        }
                    }
                    var end = points[points.length - 1];
                    center.end = end.end;
                    arrowPoint = [];
                    arrowPoint.push(center);
                }
            }
        });

        if (options.line) {
            ctx.lineCap = options.lineCap || 'round';
            ctx.lineJoin = 'round';
            if (options.border) {
                ctx.strokeStyle = options.border.color || 'white';
                ctx.lineWidth = (zoom <= 13 ? lineWidth - 2 : lineWidth) + (options.border.lineWidth * 2 || 4);
                ctx.stroke();
            }

            ctx.strokeStyle = options.color || roadColor[level] || '#fc2c2b';
            ctx.lineWidth = zoom <= 13 ? lineWidth - 2 : lineWidth;
            // console.log(ctx);
            ctx.stroke();
        }

        //
        if (options.arrow) {
            //if (zoom > 13) {
            this.drawArrow(ctx, arrowPoint, options);
            //}
        }
        return allPoints;
    },
    drawArrow: function drawArrow(ctx, arrowPoint, options) {
        // draw active arrow
        ctx.beginPath();
        arrowPoint.forEach(function (item) {
            var startX = item.start.x;
            var startY = item.start.y;
            var endX = item.end.x;
            var endY = item.end.y;
            var depthX = endX - startX;
            var depthY = endY - startY;

            var vOrigin = [0, -1];
            var vItem = [item.end.x - item.start.x, item.end.y - item.start.y];
            var angleVar1 = vOrigin[0] * vItem[0] + vOrigin[1] * vItem[1];
            var angleVar2 = Math.sqrt(vOrigin[0] * vOrigin[0] + vOrigin[1] * vOrigin[1]);
            var angleVar3 = Math.sqrt(vItem[0] * vItem[0] + vItem[1] * vItem[1]);
            var angle = Math.acos(angleVar1 / (angleVar2 * angleVar3));

            if (vItem[0] < 0) {
                angle = Math.PI * 2 - angle;
            }

            var width = options.arrow.width / 2 || 2;
            var height = options.arrow.height || width;
            var loop = 0;
            while (item.offset + 50 * loop <= item.depth) {
                var offset = item.offset + 50 * loop;
                var offsetPresent = offset / item.depth;
                ctx.save();
                ctx.translate(startX + depthX * offsetPresent, startY + depthY * offsetPresent);
                ctx.rotate(angle);
                ctx.moveTo(-width * 1.618, height);
                ctx.lineTo(0, 0);
                ctx.lineTo(width * 1.618, height);
                ctx.restore();
                loop += 1;
            }
            if (arrowPoint.length === 1 && item.offset > item.depth) {
                ctx.save();
                ctx.translate(startX, startY);
                ctx.rotate(angle);
                ctx.moveTo(-width * 1.618, height);
                ctx.lineTo(0, 0);
                ctx.lineTo(width * 1.618, height);
                ctx.restore();
            }
        });
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
};

exports.default = mapLine;