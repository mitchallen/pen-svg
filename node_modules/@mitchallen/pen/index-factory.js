/**
    Module: @mitchallen/pen
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

module.exports.create = (spec) => {
    if(!spec) {
        return null;
    }
    // private 
    let _package = "@mitchallen/pen";
    let _verbose = spec.verbose || false;
    // some pen properties can't be changed once set
    let _color = spec.color || 0x000000;
    let _width = spec.width || 1;
    let _alpha = spec.alpha || 1.0;

    var _down = false,
        _path = [],
        _xMin = 0, 
        _yMin = 0,
        _xMax = 0,
        _yMax = 0;

    return {
        // public 
        package: () => _package,
        health: () => "OK",

        color: () => _color,
        width: () => _width,
        alpha: () => _alpha,
        path: () => _path,

        down: () => _down = true,
        up: () => _down = false,
        isDown: () => _down,

        viewPort: function() {

            var vp = {
                xMin: 0,
                yMin: 0,
                xMax: 0,
                yMax: 0
            };

            if( _path.length > 0 ) {

                vp.xMin = vp.xMax = _path[0].x;
                vp.yMin = vp.yMax = _path[0].y;

                _path.forEach( op => {

                    let px = Math.round(op.x);
                    let py = Math.round(op.y);

                    vp.xMin = Math.min(px, vp.xMin);
                    vp.yMin = Math.min(py, vp.yMin);

                    vp.xMax = Math.max(px, vp.xMax);
                    vp.yMax = Math.max(py, vp.yMax);

                });
            }

            return vp;
        },

        goto: (point) => {
            
            if(!point) {
                return null;
            }

            if( point.x === null || point.y === null) {
                return null;
            }

            var op = _down ? "L" : "M";

            if(_path.length === 0 && op != "M" ) {
                // Insert starting point
                _path.push( { op: "M", x: 0, y: 0 } );
            }

            _path.push( { op: op, x: point.x, y: point.y } ); 
        }
    };
};
