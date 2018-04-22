"use strict";

define([

    ],
    function(

    ) {

        var count = 0;
        var calcVec = new THREE.Vector3();

        var hitPosStore = new THREE.Vector3();
        var hitNormalStore = new THREE.Vector3();

        var AreaFunctions = function(terrainFunctions) {
            this.terrainFunctions = terrainFunctions;
        };

        AreaFunctions.prototype.setTerrainArea = function(terrainArea) {
            this.terrainArea = terrainArea;
        };

        AreaFunctions.prototype.getAreaTerrain = function() {
            return this.terrainArea.getTerrain();
        };

        AreaFunctions.prototype.getAreaOrigin = function() {
            return this.terrainArea.getOrigin();
        };

        AreaFunctions.prototype.getAreaExtents = function() {
            return this.terrainArea.getExtents();
        };

        var checkPositionWithin = function(pos, terrainModel, parentObj) {

            var pPosx = parentObj.position.x;
            var pPosz = parentObj.position.z;

            if (parentObj.parent) {

                pPosx += parentObj.parent.position.x;
                pPosz += parentObj.parent.position.z;

                if (parentObj.parent.parent) {
                    pPosx += parentObj.parent.parent.position.x;
                    pPosz += parentObj.parent.parent.position.z;
                }

            } else {
                //        console.log("No Parent object for Terrain root", terrainModel);
            }

            var size = terrainModel.opts.xSize;
            pPosx += size/2;
            pPosz += size/2;

            if (pPosx <= pos.x && pPosx + size >= pos.x) {
                if (pPosz <= pos.z && pPosz + size >= pos.z) {
                    return true;
                }
            }
            return false;
        };

        AreaFunctions.prototype.checkPosIsWithinLevelTerrain = function(vec3, level) {


            for (var i = 0; i < level.terrains.length; i++) {
                if (checkPositionWithin(vec3, level.terrains[i], level.terrainActors[i].piece.rootObj3D)) {
                    return i;
                }
            }

            return false;
        };

        AreaFunctions.prototype.terrainHeightAtPos = function(terrain, vec3, normalStore) {
            return this.terrainFunctions.getTerrainHeightAt(terrain, vec3, this.getAreaOrigin(), normalStore);
        };

        AreaFunctions.prototype.randomTerrainSetPosVec3 = function(vec3, terrain, rootObj3D, normalStore) {

            var size = terrain.opts.xSize;
            var height = (terrain.opts.maxHeight - terrain.opts.minHeight);

            size *= 0.8;

            vec3.copy(rootObj3D.position);
            vec3.x += Math.random()*size  - size/2;
            vec3.z += Math.random()*size  - size/2;

            vec3.y = this.terrainHeightAtPos(terrain, vec3, rootObj3D, normalStore);

        };

        AreaFunctions.prototype.getRandomPointOnTerrain = function(vec3, levels, normalStore) {
            for (var i = 0; i < levels.length; i++) {
                var index = this.checkPosIsWithinLevelTerrain(vec3, levels[i]);
                if (typeof(index) === 'number') {
                    this.randomTerrainSetPosVec3(vec3, levels[i].terrains[index], levels[i].terrainActors[index].piece.rootObj3D, normalStore);
                    return;
                };
            }
            console.log("No Terrain for Pos", vec3);
        };

        AreaFunctions.prototype.getLevelForPosition = function(vec3, levels) {

            for (var i = 0; i < levels.length; i++) {
                var index = this.checkPosIsWithinLevelTerrain(vec3, levels[i]);
                if (typeof(index) === 'number') {
                    return levels[i];
                }
            }
        };

        AreaFunctions.prototype.getHeightAtPos = function(pos, normalStore) {
            return this.terrainHeightAtPos(this.getAreaTerrain(), pos, normalStore);
        };


        AreaFunctions.prototype.positionActorRandomOnTerrain = function(actor, levels) {
            var pos = actor.piece.rootObj3D.position;
            pos.x = 1000;
            pos.z = 1000;
            this.getRandomPointOnTerrain(pos, levels);
            pos.y += 10;
            actor.forcePosition(pos);
        };


        return AreaFunctions;

    });


