
@mitchallen/pen-svg
==
pen to svg file
--

<p align="left">
  
  <a href="https://npmjs.org/package/@mitchallen/pen-svg">
    <img src="http://img.shields.io/npm/v/@mitchallen/pen-svg.svg?style=flat-square" alt="Version">
  </a>
  
  <a href="https://npmjs.org/package/@mitchallen/pen-svg">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  </a>
  
</p>

## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/pen-svg --save
  
* * *

## Usage

```js
var penFactory = require("@mitchallen/pen"),
    psFactory = require("@mitchallen/pen-svg"),
    penSVG = psFactory.create({});

var pen1 = penFactory.create({
    color: 0xFF0000,    // red pen
    width: 2,           // pen width 
    alpha: 0.8          // pen alpha value
});

var pen2 = penFactory.create({
    color: 0x0000FF,    // blue pen
    width: 4,           // pen width 
    alpha: 0.8          // pen alpha value
});

pen1.up();
.goto({ x: 10, y: 15 })   // MoveTo x, y
    .down()
    .goto({ x: 20, y: 25 })   // LineTo x, y
    .goto({ x: 30, y: 35 });   // LineTo x, y

pen2.up()
    .goto({ x: 40, y: 45 })   // MoveTo x, y
    .down()
    .goto({ x: 50, y: 55 })   // LineTo x, y
    .goto({ x: 60, y: 65 });   // LineTo  x, y

penSVG.addPen(pen1)
    .addPen(
        pen2,
        {
            color: 0xFF0000,
            fill: 0x00FF00,
            width: 5,
            transform: {
                translate: {
                    x: 100,
                    y: 100
                },
                scale: {
                    x: 0.5,
                    y: 0.5
                },
            }
        }
    );

var svg = penSVG.writeSVG({ 
    filename: "test/output/write-test.svg" 
});
console.log("SVG: \n", svg);
```

* * * 

## Methods

### factory.create(*spec*)

Currently *spec* can be an empty option ({}).

	var psFactory = require("@mitchallen/pen-svg"),

	var penSVG = pSactory.create({});

### penSVG.addPen(*pen*)

The *pen* parameter must be of type __[@mitchallen/pen](https://www.npmjs.com/package/@mitchallen/pen)__.

    var penFactory = require("@mitchallen/pen");
    var penRed = penFactory.create({ color: 0xFF0000 });
    penSVG.addPen(penRed);

### penSVG.getSVG(*options*)

Translates the pen data and returns a string representing a __.svg__ file.

* options.width - defaults to "100"
* options.height - defaults to "100"
* options.title - defaults to "pen-svg file"
* options.desc - defaults to "code generated svg file"
* options.groupId - defaults to "g1"
* options.xScale - defaults to 1
* options.yScale - defaults to 1
* options.xTranslate - defaults to 0
* options.yTranslate - defaults to 0
* options.maxValve - defaults to 1000

Example:

	var svg = penSVG.getSVG({});
    console.log("SVG: \n", svg);

### svg = penSVG.writeSVG(*options*)

Returns a string containing the __.svg__ file that was written.

The *options* parameter must contain a __filename__ for a __.svg__ file to write to.

    var svg = penSVG.writeSVG({ filename: "test/output/write-test.svg" });
    console.log("SVG: \n", svg);

* * * 

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/pen-svg.git](https://bitbucket.org/mitchallen/pen-svg.git)
* [github.com/mitchallen/pen-svg.git](https://github.com/mitchallen/pen-svg.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.2.7

* added transform for rotate, skewX, skewY
* transform order now respected

#### Version 0.2.6

* addPen now allows overriding color, fill, width, transform translate and scale

#### Version 0.2.5

* cleaned up readme example

#### Version 0.2.4

* the addPen method is now chainable
* upgraded __@mitchallen/pen__ to 0.2.6 

#### Version 0.2.3

* upgraded __@mitchallen/pen__ to 0.2.5 to allow chaining of pen methods 

#### Version 0.2.2

* upgraded __@mitchallen/pen__ to 0.2.4 to handle fill 0

#### Version 0.2.1

* upgraded __@mitchallen/pen__ to 0.2.3 to support pen fill property

#### Version 0.1.4

* upgraded __@mitchallen/pen__ to 0.1.3 to get bug fix for min / max issues

#### Version 0.1.3

* writeSVG now passes all options directly to getSVG
* writeSVG skips pens with a path length of zero

#### Version 0.1.2 

* upgraded __@mitchallen/pen__ to 0.1.2 to get bug fix where __goto__ was returning null if x or y was zero

#### Version 0.1.1 

* fixed type-o in documentation

#### Version 0.1.0 

* initial release

* * *
