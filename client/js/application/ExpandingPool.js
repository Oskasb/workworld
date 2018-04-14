"use strict";

define([],
    function() {
        
        var ExpandingPool = function(key, createFunc) {


            var dataKey = key;
            this.pool = [];

            this.generatePoolEntry = function(callback) {
                createFunc(dataKey, callback)
            };

        };

        ExpandingPool.prototype.poolEntryCount = function() {
            return this.pool.length
        };

        ExpandingPool.prototype.pushEP = function(entry) {
            return this.pool.push(entry);
        };

        ExpandingPool.prototype.shiftEP = function() {
            return this.pool.shift()
        };

        ExpandingPool.prototype.getFromExpandingPool = function(callback) {


            if (this.poolEntryCount() > 3) {
                callback(this.shiftEP());
            } else {
                this.generatePoolEntry(callback)
            }
        };

        ExpandingPool.prototype.returnToExpandingPool = function(entry) {
            if (this.pool.indexOf(entry) === -1) {
                this.pushEP(entry)
            } else {
                console.log("Entry already in pool, no good!", entry)
            }
        };

        ExpandingPool.prototype.wipeExpandingPool = function() {
            this.pool = [];
        };

        return ExpandingPool;

    });