/**
    Module: @mitchallen/pen-svg
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

module.exports.create = (spec) => {
    if(!spec) {
        return null;
    }
    // private 
    let _package = "@mitchallen/pen-svg";
    return {
        // public 
        package: () => _package,
        health: () => "OK"
    };
};
