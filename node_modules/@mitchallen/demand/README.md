@mitchallen/demand
===============================

A module to throw errors if conditions aren't met.
----------------------------------------------------

* * *

## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/demand --save
  
* * *

## Usage

    var demand = require('@mitchallen/demand');

 	database.connect(uri, function(err,db) {

 		demand.notError(err);

		demand.notNull(db,"ERROR: db is null");
 	});


* * * 

## Methods

### notNull(object, message)

Will throw an error containing the *message* parameter if the *object* parameter is null;

### notError(err)

Will throw an error if the *err* object is not null. The error will use the string from __err.message__.

* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/demand.git](https://bitbucket.org/mitchallen/demand.git)
* [github.com/mitchallen/demand.git](https://github.com/mitchallen/demand.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.3 release notes

* __notNull__ now distinguishes between null and zero

#### Version 0.1.2 release notes

* Added pushTo to Gruntfile

#### Version 0.1.1 release notes

* Fixed type-o in README example

#### Version 0.1.0 release notes

* Initial release