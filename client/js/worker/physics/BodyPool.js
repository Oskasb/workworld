"use strict";

define([],
    function() {
        
        var BodyPool = function(shape, createFunc) {
            var physicsShape = shape;
            var pool = [];

            this.pool = pool;

            var addPatch = function() {
                return createFunc(physicsShape)
            };

            this.generatePatch = function() {
                pool.push(addPatch());
            };
        };

        BodyPool.prototype.push = function(patch) {
            return this.pool.push(patch);
        };

        BodyPool.prototype.pop = function() {
            if (!this.pool.length) {
                this.generatePatch();
            }
            return this.pool.pop()
        };


        BodyPool.prototype.shift = function() {
            if (!this.pool.length) {
                this.generatePatch();
            }
            return this.pool.shift()
        };

        BodyPool.prototype.getFromPool = function() {
            return this.shift()
        };

        BodyPool.prototype.returnToPool = function(body) {
            this.push(body)
        };

        BodyPool.prototype.wipePool = function() {
            this.pool = [];
        };

        return BodyPool;

    });