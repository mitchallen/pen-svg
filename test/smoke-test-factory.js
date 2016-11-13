/**
    Module: @mitchallen/pen-svg
      Test: smoke-test-factory
    Author: Mitch Allen
*/

"use strict";

var request = require('supertest'),
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
        var obj = _factory.create();
        should.not.exist(obj);
        done();
    });

    it('create method with spec should return object', done => {
        var obj = _factory.create({});
        should.exist(obj);
        done();
    });

    it('health method should return ok', done => {
        var obj = _factory.create({});
        should.exist(obj);
        obj.health().should.eql("OK");
        done();
    });

    it('getSVG should return svg for a pen', done => {
        var obj = _factory.create({});
        should.exist(obj);

        var pen = penFactory.create({ 
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

        var svg = obj.getSVG({});
        console.log("SVG: \n", svg);
        done();
    });

    it('getSVG should return svg for a multiple pens', done => {
        var obj = _factory.create({});
        should.exist(obj);

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

        var svg = obj.getSVG({});
        console.log("SVG: \n", svg);
        done();
    });

    it('writeSVG should write svg for a multiple pens', done => {
        var obj = _factory.create({});
        should.exist(obj);

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

        var svg = obj.writeSVG({ filename: "test/output/write-test.svg" });
        console.log("SVG: \n", svg);
        done();
    });
});
