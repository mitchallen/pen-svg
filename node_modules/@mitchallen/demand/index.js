/**
    Module: @mitchallen/demand
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

module.exports = {

    notNull: function (obj, eMsg) {
        if (obj===null) {
            let err = new Error(eMsg);
            console.error(err.message);
            throw err;
        }
    },

    notError: function (err) {
        if (err) {
            console.error(err.message);
            throw err;
        }
    }
};