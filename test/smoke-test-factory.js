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

        obj.addPen(pen1)
            .addPen(pen2);

        let svg = obj.getSVG({});
        // console.log("SVG: \n", svg);
        done();
    });

    context('module factory smoke test', () => {

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

            obj.addPen(pen1)
                .addPen(pen2);

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

            pen.up()
                .goto(cursor)
                .down();

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

            obj
                .addPen(pen)
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        width: 5,
                        transform: {
                            translate: {
                                x: 50,
                                y: 50
                            }
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x0000FF,
                        fill: 0x00FF00,
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
                    })

            let svg = obj.writeSVG({
                width: 1024,
                height: 1024,
                filename: "test/output/random-test.svg"
            });
            // console.log("SVG: \n", svg);
            done();
        });

        it('writeSVG should respect transform order', done => {
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
            let cursor = { x: 0, y: 0 };
            let distance = 100;
            let limit = 5;

            let path = [
                { x: cursor.x - 50, y: cursor.y - 50 },
                { x: cursor.x + 50, y: cursor.y - 50 },
                { x: cursor.x + 0, y: cursor.y + 50 },
                cursor,
            ];

            pen.up()
                .goto(cursor)
                .down();

            for (let point of path) {
                pen.goto(point);
            }

            obj
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0x00FFFF,
                        transform: {
                            translate: {
                                x: xSize / 2,
                                y: ySize / 2
                            },
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0x00FF00,
                        transform: {
                            rotate: {
                                angle: 30,
                            },
                            translate: {
                                x: xSize / 2,
                                y: ySize / 2
                            },
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0xFF00FF,
                        transform: {
                            rotate: {
                                angle: 60,
                                x: xSize / 2,
                                y: ySize / 2
                            },
                            translate: {
                                x: xSize / 2,
                                y: ySize / 2
                            },
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0xFFFF00,
                        transform: {
                            rotate: {
                                angle: 60,
                                x: xSize * 0.75,
                                y: ySize * 0.25
                            },
                            translate: {
                                x: xSize / 2,
                                y: ySize / 2
                            },
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0x00FF00,
                        transform: {
                            translate: {
                                x: xSize / 2,
                                y: ySize / 2
                            },
                            rotate: {
                                angle: 30,
                            },
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0xFF0000,
                        transform: {
                            translate: {
                                x: xSize / 3,
                                y: ySize / 3
                            },
                            scale: {
                                x: 2.0,
                                y: 2.0
                            },
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0x0000FF,
                        transform: {
                            scale: {
                                x: 2.0,
                                y: 2.0
                            },
                            translate: {
                                x: xSize / 3,
                                y: ySize / 3
                            },
                            rotate: {
                                angle: 180,
                            },
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0xCCCCCC,
                        transform: {
                            translate: {
                                x: xSize * 0.2,
                                y: ySize / 6
                            }
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0xCCCCCC,
                        transform: {
                            translate: {
                                x: xSize * 0.4,
                                y: ySize / 6
                            },
                            skewX: {
                                angle: 30,
                            },
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0xCCCCCC,
                        transform: {
                            translate: {
                                x: xSize * 0.6,
                                y: ySize / 6
                            },
                            skewY: {
                                angle: 30,
                            },
                        }
                    })
                .addPen(
                    pen,
                    {
                        color: 0x000000,
                        fill: 0xCCCCCC,
                        transform: {
                            translate: {
                                x: xSize * 0.8,
                                y: ySize / 6
                            },
                            skewX: {
                                angle: 30,
                            },
                            skewY: {
                                angle: 30,
                            },
                        }
                    })

            let svg = obj.writeSVG({
                width: 1024,
                height: 1024,
                filename: "test/output/transform-test.svg"
            });
            // console.log("SVG: \n", svg);
            done();
        });

    });

});
