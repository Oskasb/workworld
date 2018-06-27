"use strict";

define([
        'worker/terrain/AreaFunctions',
        'worker/terrain/TerrainSection',
        'worker/dynamic/DynamicSpatial',
        'ConfigObject'
    ],
    function(
        AreaFunctions,
        TerrainSection,
        DynamicSpatial,
        ConfigObject
    ) {

        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempObj3d = new THREE.Object3D();

        var TerrainArea = function(terrainFunctions, configId, onReady) {
            this.configId =configId;
            this.dynamicSpatial = new DynamicSpatial();
            this.dynamicSpatial.setupSpatialBuffer();
            this.size = 0;
            this.origin = new THREE.Vector3();
            this.extents = new THREE.Vector3();
            this.center = new THREE.Vector3();
            this.terrainFunctions = terrainFunctions;
            this.areaFunctions = new AreaFunctions(terrainFunctions);
            this.terrainOptions = null;
            this.buffers = null;
            this.terrain = null;
            this.terrainSections = [];
            this.boundingBox = new THREE.Box3();
            this.isVisible = false;
            this.wasVisible = false;

            this.msg = null;

            this.dataRequested = false;

            var configReady = function(data) {
                this.configObject.removeCallback(configReady);
                onReady(this)
            }.bind(this);

            this.configObject = new ConfigObject('GEOMETRY', 'TERRAIN_GEOMETRY', configId);
            this.configObject.addCallback(configReady)

            this.lastTestedAreaIndex = 0;

        };

        TerrainArea.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        TerrainArea.prototype.setTerrainOptions = function(options) {
            this.terrainOptions = options;
        };

        TerrainArea.prototype.setTerrainPosXYZ = function(x, y, z) {
            this.origin.x = x;
            this.origin.y = y;
            this.origin.z = z;
            this.updateCenter();
        };

        TerrainArea.prototype.getTerrainVegetationSystemId = function() {
            return this.terrainOptions.vegetation_system;
        };


        TerrainArea.prototype.getTerrain = function() {
            return this.terrain;
        };

        TerrainArea.prototype.getOrigin = function() {
            return this.origin;
        };

        TerrainArea.prototype.getExtents = function() {
            return this.extents;
        };

        TerrainArea.prototype.updateCenter = function() {
            this.center.copy(this.extents);
            this.center.multiplyScalar(0.5);
            this.center.addVectors(this.origin, this.center);
        };

        TerrainArea.prototype.positionIsWithin = function(pos) {
            if (pos.x > this.origin.x && pos.x < this.extents.x + this.origin.x && pos.z > this.origin.z && pos.z < this.extents.z + this.origin.z) {
                return true
            }
        };

        TerrainArea.prototype.getHeightAndNormalForPos = function(pos, norm) {
            if (this.terrain) {
                return this.areaFunctions.getHeightAtPos(pos, norm);
            }
        };

        TerrainArea.prototype.setTerrainExtentsXYZ = function(x, y, z) {
            this.extents.x = x;
            this.extents.y = y;
            this.extents.z = z;
            this.updateCenter();
        };

        TerrainArea.prototype.registerTerrainPhysics = function(msg) {
            console.log("Request Physics for terrain from here...");
            WorldAPI.callSharedWorker(ENUMS.Worker.PHYSICS_WORLD, ENUMS.Protocol.PHYSICS_TERRAIN_ADD, [msg, this.buffers[4], this.dynamicSpatial.getSpatialBuffer()])// this.terrainBody = this.terrainFunctions.addTerrainToPhysics(this.terrainOptions, this.terrain.array1d, this.origin.x, this.origin.z);
        };

        TerrainArea.prototype.requestStaticTerrainData = function(msg) {
            WorldAPI.callSharedWorker(ENUMS.Worker.STATIC_WORLD, ENUMS.Protocol.GENERATE_STATIC_AREA, msg)
        };


        TerrainArea.prototype.applyStaticTerrainData = function(msg) {

            console.log("Apply Static Terrain Data:", msg);

            this.buffers = msg[1];

            var applies = this.terrainOptions;

            var dummyOptions = {};
            for (var key in applies) {
                dummyOptions[key] = applies[key];
            }

            dummyOptions.terrain_segments = 3;

            this.terrain = this.terrainFunctions.createTerrain(dummyOptions);

            this.terrain.opts.xSegments = applies.terrain_segments;
            this.terrain.opts.ySegments = applies.terrain_segments;

            this.terrain.size = applies.terrain_size;
            this.terrain.segments = applies.terrain_segments;
            this.terrain.height = applies.max_height - applies.min_height;
            this.terrain.vegetation = applies.vegetation_system;

            this.terrain.array1d = this.buffers[4];
            this.areaFunctions.setTerrainArea(this);

            WorldAPI.sendWorldMessage(ENUMS.Protocol.REGISTER_TERRAIN, [msg[0], this.buffers]);

            if (!this.terrainBody) {
                this.registerTerrainPhysics(this.msg);
            }

            this.generateTerrainSectons(0.001);
        };

        TerrainArea.prototype.createAreaOfTerrain = function(posx, posz) {
            this.msg = {};

            this.msg.options = this.configRead('options');
            this.msg.posx = posx;
            this.msg.posz = posz;


            this.setTerrainOptions(this.msg.options);
            this.size = this.terrainOptions.terrain_size;
            this.setTerrainPosXYZ(this.msg.posx, this.terrainOptions.min_height, this.msg.posz);
            this.setTerrainExtentsXYZ(this.size, this.terrainOptions.max_height - this.terrainOptions.min_height, this.size);

            this.boundingBox.min.copy(this.origin);
            this.boundingBox.max.addVectors(this.origin, this.extents);
        };

        TerrainArea.prototype.generateTerrainSectons = function(density) {

            var countX = Math.floor(density*this.size);
            var countY = countX;

            var featureSize = this.size/countX;

            for (var i = 0; i < countX; i++) {
                for (var j = 0; j < countY; j++) {

                    tempVec1.x = this.getOrigin().x + i*featureSize;
                    tempVec1.z = this.getOrigin().z + j*featureSize;

                    tempVec1.y = this.areaFunctions.getHeightAtPos(tempVec1);

                    var section = new TerrainSection(this, tempVec1, featureSize);

                    section.genereateSectionFeatures(3);

                    this.terrainSections.push(section);

                }
            }

        };


        TerrainArea.prototype.updateTerrainArea = function(tpf) {

            //       this.isVisible = WorldAPI.getWorldCamera().testBoxVisible(this.boundingBox);
            this.isVisible = WorldAPI.getWorldCamera().testPosRadiusVisible(this.center, this.size*0.75);

            if (this.isVisible) {

                if (!this.dataRequested) {
                    WorldAPI.addTextMessage('Request TerrainArea Data: '+this.configId);
                    this.requestStaticTerrainData(this.msg);
                    this.dataRequested = true;
                    return;
                }
            }

            if (!this.terrain) {
                return;
            }

            if (this.isVisible) {

                if (!this.wasVisible) {
                    WorldAPI.addTextMessage('Include Area: '+this.configId);
                }

            //    for (var i = 0; i < this.terrainSections.length; i++) {
                    this.terrainSections[this.lastTestedAreaIndex].updateTerrainSection(tpf)

                    this.lastTestedAreaIndex++;
                if (this.lastTestedAreaIndex === this.terrainSections.length) {
                    this.lastTestedAreaIndex = 0;
                }

            //    }
            } else if (this.wasVisible) {
                WorldAPI.addTextMessage('Hide Area: '+this.configId);
                for (var i = 0; i < this.terrainSections.length; i++) {
                    this.terrainSections[i].applyTerrainSectionVisibility(tpf, false);
                }
            }

            this.wasVisible = this.isVisible;

        };

        return TerrainArea;

    });

