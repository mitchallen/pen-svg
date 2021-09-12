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
    if(!spec) {
        return null;
    }
    // private 
    let _package = "@mitchallen/pen-svg";
    var _pen = [];
    return {
        // public 
        package: () => _package,
        health: () => "OK",

        addPen: p => _pen.push(p),

        getSVG: function(options) {

            if(!options) {
                return null;
            }

            let fill = options.fill || "none";
            let svgWidth  = options.width   || "100";
            let svgHeight = options.height  || "100";
            let title     = options.title   || "pen-svg file";
            let desc      = options.desc    || "code generated svg file";
            let groupId   = options.groupId || "g1";
            let xScale    = options.xScale  || 1;
            let yScale    = options.yScale  || 1;
            let xTranslate = options.xTranslate  || 0;
            let yTranslate = options.yTranslate  || 0;
            let maxValve = options.maxValve  || 1000;

            // Generate file content

            let fd = util.format('<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s">\n', svgWidth, svgHeight);

            fd += util.format('  <title>%s</title>\n', title );
            fd += util.format('  <desc>%s</desc>\n', desc );

            fd += util.format(
                '  <g id="%s" transform="scale(%d,%d) translate(%d,%d)">\n', groupId, xScale, yScale, xTranslate, yTranslate );

            function zfill(strNum, len) {return (Array(len).join("0") + strNum).slice(-len);}

            _pen.forEach( item => {
                // fd += util.format('    <path fill="none" stroke="#F00" stroke-width="0.25px" d="%s" />\n', path );

                // Don't bother writing empty paths
                if(item.path().length === 0) {
                    // This is in a function, not a loop
                    return;
                }

                var sPath = "";

                let penPath = fuse.removeDupes( { 
                    path: item.path(),
                    maxValve: maxValve 
                });

                for( var key in penPath ) {
                    let point = penPath[key];
                    sPath += util.format("%s%d %d%s", 
                    point.op == "L" ? "" : point.op, 
                    point.x, point.y, 
                    key == penPath.length - 1 ? "" : " ");
                }

                // TODO: stroke-linecap, stroke-linejoin


                let hexColor = zfill( item.color().toString(16), 6);

                fd += util.format(
                    '    <path fill="none" stroke="#%s" stroke-width="%d" d="%s" />\n', hexColor, item.width(), sPath );

            });
     
            fd += '  </g>\n';
            fd += '</svg>';

            return fd;
        },

        writeSVG: function(options) {
            demand.notNull(options,"writeSVG method requires parameters");
            demand.notNull(options.filename,"writeSVG method requires spec.filename parameter");
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
