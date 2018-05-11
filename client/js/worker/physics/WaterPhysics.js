"use strict";

define([
    ],
    function(

    ) {

        var tempVec = new THREE.Vector3();


        var WaterPhysics = function(physicsApi) {
        };


        WaterPhysics.prototype.initTerrainSystem = function(configId) {

        };


        WaterPhysics.prototype.simulateDynamicSpatialInWater = function(dynSpat) {

            if (dynSpat.isStatic()) {
                return;
            }

            dynSpat.getSpatialPosition(tempVec);
            if (tempVec.y < 0) {

                tempVec.set(0, dynSpat.getSpatialBodyMass()*20, 0);
                dynSpat.applySpatialImpulseVector(tempVec);

            }

        };


        return WaterPhysics;

    });

