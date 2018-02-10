/**
 * @file 文本标注组件
 * @author kyle(hinikai@gmail.com)
 */

import React from 'react';
import { render } from 'react-dom';
import Component from './component';
import TipLable from '../overlay/TipLable';

export default class App extends Component {

    constructor(args) {
        super(args);
        this.state = {
        };
        this.tips = [];
    }

    /**
     * 设置默认的props属性
     */
    static get defaultProps() {
        return {
        }
    }

    componentDidUpdate(prevProps) {
        this.initialize();
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        this.tips.forEach((tip) => {
            tip.hide();
        });
        this.tips = [];
    }

    initialize() {

        var map = this.props.map;
        if (!map) {
            return;
        }

        this.destroy();


        if (this.props.data) {
            var points = [];
            this.props.data.forEach((item, index) => {
                var tip = new TipLable({
                    isShowTipArrow: true,
                    changePosition: (point) => {
                        this.props.changePosition && this.props.changePosition(point, index);
                    },
                    map: map,
                    numberDirection: item.numberDirection,
                    isShowNumber: item.isShowNumber,
                    point: item.point,
                    name: item.name,
                    offset: item.offset,
                    index: item.index !== undefined ? item.index : index + 1, 
                    color: item.color,
                    style: item.style,
                    icon: item.icon,
                    // change: function() {}
                });
                points.push(item.point);
                tip.show();
                this.tips.push(tip);
            });

            if (this.props.autoViewport) {
                map.setViewport(points, this.props.viewportOptions);
            }
        }
    }

}
