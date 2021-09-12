
@mitchallen/fuse-svg-path
==
Fuse MoveTo LineTo paths, such as those used in SVG files
--
* * *
## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/fuse-svg-path --save
  
* * *

## Introduction

An SVG path is made up of a series of MoveTo (M) and LineTo (L) calls. If one path ends where another path starts, there won't be a smooth transition. In the resulting image, you may see the end caps of both paths intersecting. 

For example look at this path:

    <path d="M 10 20 L 30 40 M 30 40 L 25 35"/> 
    
For convenience sake, any part of the __d__ string that start with __M__ and ends with __L__ before another __M__ or the end of the string will be referred to as a *path* __*segment*__.
    
In the example above, the last L in the first path segment has the same values a the first M in the next segment (30 40).  So they can be combined like this to provide one smooth line:

    <path d="M 10 20 L 30 40 L 25 35"/>

Note that the two segments don't need to be next to each other. The module will search all other path segments for a match.

### Reversed Segments 

Consider this path:

    <path d="M 10 20 L 30 40 M 25 35 L 30 40"/>
    
The end of the first path segment matches the end of the second segment. 

In a case like this, the second segment is reversed internally like so:

    <path d="M 10 20 L 30 40 M 30 40 L 25 35"/>
    
Which can be combined into a final result like this:
    
	<path d="M 10 20 L 30 40 L 25 35"/>
	
### Unfused Paths

A path like this cannot be fused:

    <path d="M 10 20 L 30 40 M 40 50 L 60 70"/>
    
So the original path would be returned.

### Parsing

Currently there is no parsing of strings or files done. Any such sources must be converted to an array of path operators in this format:

    let input = [
        { op: "M", x: 10, y: 20 },
        { op: "L", x: 30, y: 40 },
        { op: "M", x: 30, y: 40 },
        { op: "L", x: 25, y: 35 }
    ];
    
### First Path Only

Currently only the first path segment in the array is fused on to. If remaining path segments can be fused together into additional paths, they are currently just returned in the original format.

You could change the order of the resulting path (putting result[0] at the bottom) and run it again. The trick would be to figure out when all options for fusing have been exhausted.

This will be dealt with in future releases.

### Other Languages

Even though SVG is used as an example, there is no reason that the result cannot be converted to another format. Many other language drawing routines use MoveTo / LineTo path construction.

* * *

## Usage

    "use strict";

    var fuseFactory = require("@mitchallen/fuse-svg-path");

    var fuse = fuseFactory.create({});
    
    let options = {
        verbose: false,
        path: [
            { op: "M", x: 10, y: 20 },
            { op: "L", x: 30, y: 40 },
            { op: "M", x: 30, y: 40 },
            { op: "L", x: 25, y: 35 }
        ]
    };

	// Return fused path.

    var path = fuse.fuse(options);
	
    let expected = [
        { op: "M", x: 10, y: 20 },
        { op: "L", x: 30, y: 40 },
        { op: "L", x: 25, y: 35 }
    ];
    
	path.should.eql(expected);

* * *

## Methods


### fuseFactory = factory.create(spec)

Factory method that returns a fusing object. 

Currently there are no parameter. Set spec to '__{}__'. It cannot be null. This is left this way for the allowance of additional parameters in the future.

The method will return null if create fails.

    var fuseFactory = require("@mitchallen/fuse-svg-path");

    var fuse = fuseFactory.create({});
    
### fuseFactory = factory.fuse(options.path)

Takes a series of MoveTo (M) and LineTo (L) records and attempts to consolidate them into a smaller, combined path.

    let options = {
        verbose: false,
        path: [
            { op: "M", x: 10, y: 20 },
            { op: "L", x: 30, y: 40 },
            { op: "M", x: 30, y: 40 },
            { op: "L", x: 25, y: 35 }
        ]
    };

	// Get fused path.

    var path = fuse.fuse(options);
    
    let expected = [
        { op: "M", x: 10, y: 20 },
        { op: "L", x: 30, y: 40 },
        { op: "L", x: 25, y: 35 }
    ];
    
	path.should.eql(expected);

### fuseFactory = factory.fuse(options.verbose)

If set to __true__, will log debug info to console.

    let options = {
        verbose: true,	// log debug info
        path: [
            { op: "M", x: 10, y: 20 },
            { op: "L", x: 30, y: 40 }
        ]
    };

    var path = fuse.fuse(options);
    
### fuseFactory = factory.fuse(options.maxValve)

The __fuse__ method has an internal safety valve counter to prevent infinite looping. In case that turns out not to be enough, you can set the __maxValve__ value to a higher number.

If the valve is blown (to prevent infinite looping) that would result in a path with missing values being returned. So a null is returned instead.

    let options = {
        verbose: true,	
        maxValve: 10000,	// Set max valve
        path: [
            { op: "M", x: 10, y: 20 },
            { op: "L", x: 30, y: 40 }
        ]
    };

    var path = fuse.fuse(options);

* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/fuse-svg-path.git](https://bitbucket.org/mitchallen/fuse-svg-path.git)
* [github.com/mitchallen/fuse-svg-path.git](https://github.com/mitchallen/fuse-svg-path.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.4 

* fixed issue when removeDupes encounters path segment with only one op

#### Version 0.1.3 

* added experimental removeDupes method (same format as fuse)

#### Version 0.1.2 

* rolled back dupe handling and test cases

#### Version 0.1.1 

* added duplicate point removal in fuse method

#### Version 0.1.0 

* initial release

* * *
