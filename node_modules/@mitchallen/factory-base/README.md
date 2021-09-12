
@mitchallen/factory-base
==
Factory base class 
--
* * *
## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/factory-base --save
  
* * *

## Usage

	var _factory = require("@mitchallen/factory-base");
	var obj = _factory.create({});
    should.exist(obj);
    obj.health().should.eql("OK")

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/factory-base.git](https://bitbucket.org/mitchallen/factory-base.git)
* [github.com/mitchallen/factory-base.git](https://github.com/mitchallen/factory-base.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.0 

* initial release

* * *
