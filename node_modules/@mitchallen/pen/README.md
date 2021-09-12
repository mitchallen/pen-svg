
@mitchallen/pen
==
pen object that returns drawing path information
--
* * *
## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/pen --save
  
* * *

## Usage

    "use strict";
    
	var penFactory = require("@mitchallen/pen");

	var pen = penFactory.create({ 
		color: 0xFF0000,	// red pen
		width: 2,			// pen width 
		alpha: 0.8			// pen alpha value
	});
	
	pen.up();
	pen.goto( { x: 50, y: 50 } );	// MoveTo 50, 50
	pen.down();
	pen.goto( { x: 10, y: 20 } );	// LineTo 10, 20
	pen.goto( { x: 15, y: 30 } );	// LineTo 15, 30
	pen.goto( { x: 45, y: 60 } );	// LineTo 45, 60
	pen.up();
	pen.goto( { x: 30, y: 40 } );	// MoveTo 30, 40
	pen.goto( { x: 10, y: 20 } );	// LineTo 10, 20
	
	var path = pen.path();
	
* * * 

 
## Methods


### penFactory = factory.create(spec)

Factory method that returns a pen object. 

It takes one spec parameter can contain optional parameters:

* __color__ - default if missing is 0x000000 - hex RGB color value
* __width__ - default if missing is 1
* __alpha__ - default if missing is 1.0 - valid values between 0.0 and 1.0

The method will return null if create fails, such as with bad parameters. You can call create multiple times to create multiple mazes.

    var penFactory = require("@mitchallen/maze-generator");

    var pen1 = penFactory.create({ 
		color: 0xFF0000,	// red pen
		width: 2,			// pen width 
		alpha: 0.8			// pen alpha value
	});
    var pen2 = penFactory.create( { 
		color: 0x0000FF,	// blue pen
		width: 3,			// pen width 
		alpha: 0.6			// pen alpha value
	});

    if(!pen1 || !pen2) ...

### pen.down()

Logical pen down. 

    pen.down();
    
### pen.up()

Logical pen up. 

    pen.up();
    
### pen.isDown()

Returns if pen is down. 

    if( pen.isDown() ) ...
    
### pen.goto( { x: *number*, y: *number* } )

Maps path drawing operation. If the pen is up it generates a MoveTo. If the pen is down it generatea a LineTo. If this is the first operation it inserts a MoveTo (0,0). 

	pen.up();
	pen.goto( { x: 50, y: 50 } );	// MoveTo 50, 50
	pen.down();
	pen.goto( { x: 10, y: 20 } );	// LineTo 10, 20
	pen.goto( { x: 15, y: 30 } );	// LineTo 15, 30
	
### pen.color()

Return RGB value of pen, either default or what was passed to __create__ method. 

    var color = pen.color();
    
### pen.width()

Return width value of pen, either default or what was passed to __create__ method. 

    var width = pen.width();
    
### pen.alpha()

Return alpha value of pen, either default or what was passed to __create__ method. 

    var alpha = pen.alpha();
    
### pen.path()

Returns drawing path info in the form of an array.  The array contains a series of drawing operation objects. Each operation contains an __op__, __x__ and __y__ parameter. 

    var path = pen.path();
    
Example result:

	[ { op: "M", x: 10, y: 20 }, { op: "L", x: 20, y: 30 } ]
	
### pen.viewPort()

Loops through the path values and returns an object containing the following properties:

* __xMin__ - Returns minimum x position visited via __goto__. Rounded to a whole number.
* __yMin__ - Returns minimum y position visited via __goto__. Rounded to a whole number.
* __xMax__ - Returns maximum x position visited via __goto__. Rounded to a whole number.
* __yMax__ - Returns maximum y position visited via __goto__. Rounded to a whole number.

Example:

	var vp = pen.viewPort();
	console.log( "xMin: ", vp.xMin );
  
* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test 
 
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/pen.git](https://bitbucket.org/mitchallen/pen.git)
* [github.com/mitchallen/pen.git](https://github.com/mitchallen/pen.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.2.0

* min / max methods replaced with viewPort method 

#### Version 0.1.3 

* min / max values now rounded and compared to whole numbers

#### Version 0.1.2 

* fixed bug where goto returned null if x or y was zero

#### Version 0.1.1 

* updated description in package.json

#### Version 0.1.0 

* initial release

* * *
