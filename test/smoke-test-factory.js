/**
    Module: @mitchallen/pen-svg
      Test: smoke-test-factory
    Author: Mitch Allen
*/

"use strict";

let Chance = require('chance');
let chance = new Chance();

let request = require('supertest'),
    should = require('should'),
    penFactory = require("@mitchallen/pen"),
    modulePath = "../index-factory";

describe('module factory smoke test', () => {

    var _factory = null;

    before( done => {
        // Call before all tests
        delete require.cache[require.resolve(modulePath)];
        _factory = require(modulePath);
        done();
    });

    after( done => {
        // Call after all tests
        done();
    });

    beforeEach( done => {
        // Call before each test
        done();
    });

    afterEach( done => {
        // Call after eeach test
        done();
    });

    it('module should exist', done => {
        should.exist(_factory);
        done();
    })

    it('create method with no spec should return null', done => {
        let obj = _factory.create();
        should.not.exist(obj);
        done();
    });

    it('create method with spec should return object', done => {
        let obj = _factory.create({});
        should.exist(obj);
        done();
    });

    it('health method should return ok', done => {
        let obj = _factory.create({});
        should.exist(obj);
        obj.health().should.eql("OK");
        done();
    });

    it('getSVG should return svg for a pen', done => {
        let obj = _factory.create({});
        should.exist(obj);

        let pen = penFactory.create({ 
            color: 0xFF0000,    // red pen
            width: 2,           // pen width 
            alpha: 0.8          // pen alpha value
        });

        pen.up();
        pen.goto( { x: 10, y: 15 } );   // MoveTo 50, 50
        pen.down();
        pen.goto( { x: 20, y: 25 } );   // LineTo 10, 20
        pen.goto( { x: 30, y: 35 } );   // LineTo 15, 30
        pen.goto( { x: 40, y: 45 } );   // LineTo 45, 60
        pen.up();
        pen.goto( { x: 50, y: 55 } );   // MoveTo 30, 40
        pen.down();
        pen.goto( { x: 60, y: 65 } );   // LineTo 10, 20

        obj.addPen(pen);

        let svg = obj.getSVG({});
        // console.log("SVG: \n", svg);
        done();
    });

    it('getSVG should return svg for a multiple pens', done => {
        let obj = _factory.create({});
        should.exist(obj);

        let pen1 = penFactory.create({ 
            color: 0xFF0000,    // red pen
            width: 2,           // pen width 
            alpha: 0.8          // pen alpha value
        });

        let pen2 = penFactory.create({ 
            color: 0x0000FF,    // blue pen
            width: 4,           // pen width 
            alpha: 0.8          // pen alpha value
        });

        pen1.up();
        pen1.goto( { x: 10, y: 15 } );   // MoveTo 50, 50
        pen1.down();
        pen1.goto( { x: 20, y: 25 } );   // LineTo 10, 20
        pen1.goto( { x: 30, y: 35 } );   // LineTo 15, 30
        
        pen2.up();
        pen2.goto( { x: 40, y: 45 } );   // LineTo 45, 60
        pen2.down();
        pen2.goto( { x: 50, y: 55 } );   // MoveTo 30, 40
        pen2.goto( { x: 60, y: 65 } );   // LineTo 10, 20

        obj.addPen(pen1);
        obj.addPen(pen2);

        let svg = obj.getSVG({});
        // console.log("SVG: \n", svg);
        done();
    });

    it('writeSVG should write svg for a multiple pens', done => {
        let obj = _factory.create({});
        should.exist(obj);

        let pen1 = penFactory.create({ 
            color: 0xFF0000,    // red pen
            width: 2,           // pen width 
            alpha: 0.8          // pen alpha value
        });

        let pen2 = penFactory.create({ 
            color: 0x0000FF,    // blue pen
            width: 4,           // pen width 
            alpha: 0.8          // pen alpha value
        });

        pen1.up();
        pen1.goto( { x: 10, y: 15 } );   // MoveTo 50, 50
        pen1.down();
        pen1.goto( { x: 20, y: 25 } );   // LineTo 10, 20
        pen1.goto( { x: 30, y: 35 } );   // LineTo 15, 30
        
        pen2.up();
        pen2.goto( { x: 40, y: 45 } );   // LineTo 45, 60
        pen2.down();
        pen2.goto( { x: 50, y: 55 } );   // MoveTo 30, 40
        pen2.goto( { x: 60, y: 65 } );   // LineTo 10, 20

        obj.addPen(pen1);
        obj.addPen(pen2);

        let svg = obj.writeSVG({ filename: "test/output/write-test.svg" });
        // console.log("SVG: \n", svg);
        done();
    });

    // random

    it('writeSVG should write random walk svg', done => {
        let obj = _factory.create({});
        should.exist(obj);

        let pen0 = penFactory.create({ 
            color: 0xFFFFFF,    
            fill: 0xFFFFFF,
            width: 2,           // pen width 
            alpha: 1.0,          // pen alpha value
        });

        let pen1 = penFactory.create({ 
            color: 0xFF0000,    // red pen
            width: 2,           // pen width 
            alpha: 0.8          // pen alpha value
        });

        let pen2 = penFactory.create({ 
            color: 0x0000FF,    // blue pen
            width: 4,           // pen width 
            alpha: 0.8          // pen alpha value
        });

        let size = 2048;
        let padding = 50;
        let cursor1 = { x: size / 2 , y: size / 2 };
        let cursor2 = cursor1;
        let distance = 100;
        let limit = 2000;

        pen0.up();
        pen0.goto( { x: 0, y: 0 });  
        pen0.down();
        pen0.goto( { x: size, y: 0 } );
        pen0.goto( { x: size, y: size } );
        pen0.goto( { x: 0, y: size } );

        pen1.up();
        pen1.goto( cursor1 );  
        pen1.down();

        pen2.up();
        pen2.goto( cursor2 );  
        pen2.down();

        for( let i = 0; i < limit; i++ ) {

            let c1 = cursor1;
            c1.x += chance.integer( { min: -distance, max: distance });
            c1.y += chance.integer( { min: -distance, max: distance });
            if( 
                c1.x > padding 
                && c1.x < (size - padding) 
                && c1.y > padding 
                && c1.y < (size - padding)
            ) {
                cursor1 = c1;
                pen1.goto( cursor1 );
            }

            let c2 = cursor2;
            c2.x += chance.integer( { min: -distance, max: distance });
            c2.y += chance.integer( { min: -distance, max: distance });
            if( 
                c2.x > padding 
                && c2.x < (size - padding) 
                && c2.y > padding 
                && c2.y < (size - padding)
            ) {
                cursor2 = c2;
                pen2.goto( cursor2 );
            }

        }

        obj.addPen(pen0);
        obj.addPen(pen1);
        obj.addPen(pen2);

        let svg = obj.writeSVG({ 
            width: 2048,
            height: 2048,
            filename: "test/output/random-test.svg" 
        });
        // console.log("SVG: \n", svg);
        done();
    });


});
