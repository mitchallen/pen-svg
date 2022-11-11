/**
    Module: @mitchallen/pen-svg
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

var fs = require('fs'),
    util = require('util'),
    demand = require('@mitchallen/demand'),
    fuseFactory = require("@mitchallen/fuse-svg-path"),
    fuse = fuseFactory.create({});

module.exports.create = (spec) => {
    if (!spec) {
        return null;
    }
    // private 
    let _package = "@mitchallen/pen-svg";
    let _pens = [];
    return {
        // public 
        package: () => _package,
        health: () => "OK",

        addPen: function (pen, settings = {}) {
            _pens.push({ pen, settings });
            return this;
        },

        getSVG: function (options = {}) {

            if (!options) {
                return null;
            }

            let svgWidth = options.width || "100";
            let svgHeight = options.height || "100";
            let title = options.title || "pen-svg file";
            let desc = options.desc || "code generated svg file";
            let groupId = options.groupId || "g1";
            let xScale = options.xScale || 1;
            let yScale = options.yScale || 1;
            let xTranslate = options.xTranslate || 0;
            let yTranslate = options.yTranslate || 0;
            let maxValve = options.maxValve || 1000;

            // Generate file content

            let fd = util.format('<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s">\n', svgWidth, svgHeight);

            fd += util.format('  <title>%s</title>\n', title);
            fd += util.format('  <desc>%s</desc>\n', desc);

            fd += util.format(
                '  <g id="%s" transform="scale(%d,%d) translate(%d,%d)">\n', groupId, xScale, yScale, xTranslate, yTranslate);

            function zfill(strNum, len) { return (Array(len).join("0") + strNum).slice(-len); }

            _pens.forEach(el => {

                let {
                    pen,
                    settings = {},
                } = el;

                let {
                    color = pen.color(),
                    fill = pen.fill(),
                    width = pen.width(),
                    transform = {},
                } = settings;

                // fd += util.format('    <path fill="none" stroke="#F00" stroke-width="0.25px" d="%s" />\n', path );

                // Don't bother writing empty paths
                if (pen.path().length === 0) {
                    // This is in a function, not a loop
                    return;
                }

                var sPath = "";

                let penPath = fuse.removeDupes({
                    path: pen.path(),
                    maxValve: maxValve
                });

                for (var key in penPath) {
                    let point = penPath[key];
                    sPath += util.format("%s%d %d%s",
                        point.op == "L" ? "" : point.op,
                        point.x, point.y,
                        key == penPath.length - 1 ? "" : " ");
                }

                // TODO: stroke-linecap, stroke-linejoin

                let hexColor = '#' + zfill(color.toString(16), 6);
                let fillColor = 'none';
                if (fill !== undefined) {
                    fillColor = '#' + zfill(fill.toString(16), 6);
                }

                let {
                    translate,
                    scale,
                } = transform;

                let tf = "";

                for (const [key, value] of Object.entries(transform)) {
                    switch (key) {
                        case "translate":
                        case "scale":
                            {
                                let { x = 1, y = 1 } = value;
                                tf += tf.length > 0 ? " " : "";
                                tf += `${key}(${x} ${y})`;
                            }
                            break;
                        case "rotate":
                            {
                                let { angle = 0, x, y } = value;
                                let sx = x ? ` ${x}` : "";
                                let sy = y ? ` ${y}` : "";
                                tf += tf.length > 0 ? " " : "";
                                tf += `${key}(${angle}${sx}${sy})`;
                            }
                            break;
                        case "skewX":
                        case "skewY":
                            {
                                let { angle = 0, x, y } = value;
                                tf += tf.length > 0 ? " " : "";
                                tf += `${key}(${angle})`;
                            }
                            break;

                        default:
                            break;
                    }
                }

                let tString = "";
                if (tf.length > 0) {
                    tString = `transform="${tf}"`;
                }

                fd += util.format(
                    '    <path %s fill="%s" stroke="%s" stroke-width="%d" d="%s" />\n',
                    tString.length > 0 ? tString : "",
                    fillColor,
                    hexColor,
                    width,
                    sPath);

            });

            fd += '  </g>\n';
            fd += '</svg>';

            return fd;
        },

        writeSVG: function (options) {
            demand.notNull(options, "writeSVG method requires parameters");
            demand.notNull(options.filename, "writeSVG method requires spec.filename parameter");
            // demand.notNull(options.width,"writeSVG method requires spec.width parameter");
            var filename = options.filename;
            var stream = fs.createWriteStream(filename);
            var fData = this.getSVG(options);
            stream.write(fData);
            // stream.close();  // would randomly gen bad descriptor message
            stream.end();
            console.log("data written to: ", filename);
            return fData;

        }

    };
};
