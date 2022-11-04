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

    before(done => {
        // Call before all tests
        delete require.cache[require.resolve(modulePath)];
        _factory = require(modulePath);
        done();
    });

    after(done => {
        // Call after all tests
        done();
    });

    beforeEach(done => {
        // Call before each test
        done();
    });

    afterEach(done => {
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

        pen.up()
            .goto({ x: 10, y: 15 })   // MoveTo 
            .down()
            .goto({ x: 20, y: 25 })   // LineTo 
            .goto({ x: 30, y: 35 })   // LineTo 
            .goto({ x: 40, y: 45 })   // LineTo 
            .up()
            .goto({ x: 50, y: 55 })   // MoveTo 
            .down()
            .goto({ x: 60, y: 65 });   // LineTo 

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

        pen1.up()
            .goto({ x: 10, y: 15 })   // MoveTo 
            .down()
            .goto({ x: 20, y: 25 })  // LineTo 
            .goto({ x: 30, y: 35 });  // LineTo 

        pen2.up()
            .goto({ x: 40, y: 45 })   // LineTo 
            .down()
            .goto({ x: 50, y: 55 })   // MoveTo 
            .goto({ x: 60, y: 65 });   // LineTo 

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

        pen1.up()
            .goto({ x: 10, y: 15 })   // MoveTo 
            .down()
            .goto({ x: 20, y: 25 })   // LineTo 
            .goto({ x: 30, y: 35 });   // LineTo 

        pen2.up()
            .goto({ x: 40, y: 45 })   // LineTo 
            .down()
            .goto({ x: 50, y: 55 })   // MoveTo 
            .goto({ x: 60, y: 65 });   // LineTo 

        obj.addPen(pen1);
        obj.addPen(pen2);

        let svg = obj.writeSVG({ filename: "test/output/write-test.svg" });
        // console.log("SVG: \n", svg);
        done();
    });

    // random

    it('writeSVG should write random svg', done => {
        let obj = _factory.create({});
        should.exist(obj);

        let pen = penFactory.create({
            color: 0xFF0000,    // red pen
            width: 2,           // pen width 
            alpha: 0.8          // pen alpha value
        });

        let xSize = 1024;
        let ySize = 1024;
        let padding = 50;
        let cursor = { x: xSize / 2, y: ySize / 2 };
        let distance = 100;
        let limit = 200;

        pen.up();
        pen.goto(cursor);
        pen.down();

        for (let i = 0; i < limit; i++) {
            let c1 = cursor;
            c1.x += chance.integer({ min: -distance, max: distance });
            c1.y += chance.integer({ min: -distance, max: distance });
            if (
                c1.x > padding
                && c1.x < (xSize - padding)
                && c1.y > padding
                && c1.y < (ySize - padding)
            ) {
                cursor = c1;
                pen.goto(cursor);
            }
        }

        obj.addPen(pen);

        let svg = obj.writeSVG({
            width: 1024,
            height: 1024,
            filename: "test/output/random-test.svg"
        });
        // console.log("SVG: \n", svg);
        done();
    });


});
