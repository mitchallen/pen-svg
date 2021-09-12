/**
    Module: @mitchallen/factory-base
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

module.exports.create = function (spec) {
    if(!spec) {
        return null;
    }
    // private 
    let _package = "@mitchallen/factory-base";
    return {
        // public 
        package: function() {
            return _package;
        },
        health: function() {
            return "OK";
        }
    };
};
