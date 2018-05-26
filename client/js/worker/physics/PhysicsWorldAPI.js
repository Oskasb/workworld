"use strict";

define([
        'PipelineAPI',
        'worker/protocol/ProtocolRequests',
        'worker/protocol/WorldMessages',
        'worker/physics/AmmoAPI',
        'worker/physics/WaterPhysics',
        'worker/dynamic/DynamicSpatial',
        'worker/physics/ShapePhysics'
    ],
    function(
        PipelineAPI,
        ProtocolRequests,
        WorldMessages,
        AmmoAPI,
        WaterPhysics,
        DynamicSpatial,
        ShapePhysics
    ) {

    var comBuffer;
        var ammoApi;
        var waterPhysics;
        var protocolRequests;
        var worldMessages;
        var fetches = {};

        var tpf;
        var skipFrames = 0;
        var skipFrame = false;
        var frameIdle;
        var frameStart;
        var frameEnd;
        var lastFrameTime;

        var stepStart;
        var stepEnd;
        var activeBodies;
        var passiveBodies;
        var staticBodies;

        var dynamicSpatials = [];
        var terrainBodies = {};

        var PhysicsWorldAPI = function() {};

        PhysicsWorldAPI.initPhysicsWorld = function(onWorkerReady) {

            var ammoReady = function() {
                waterPhysics = new WaterPhysics();
                worldMessages = new WorldMessages();
                protocolRequests = new ProtocolRequests();
                protocolRequests.setMessageHandlers(worldMessages.getMessageHandlers());
                console.log("configs static world SharedWorker", PipelineAPI.getCachedConfigs(), fetches);
                ammoApi.initPhysics();
                onWorkerReady();
                ShapePhysics.initData();
            };

            ammoApi = new AmmoAPI(ammoReady);
        };

        PhysicsWorldAPI.setWorldComBuffer = function(buffer) {
            comBuffer = buffer;
        };

        PhysicsWorldAPI.getWorldComBuffer = function() {
            return comBuffer;
        };

        PhysicsWorldAPI.fetchCategoryKeyData = function(category, key) {

            if (!fetches[category]) {
                fetches[category] = []
            }

            if (fetches[category].indexOf(key) === -1) {
                PhysicsWorldAPI.sendWorldMessage(ENUMS.Protocol.FETCH_PIPELINE_DATA, [category, key]);
                fetches[category].push(key);
            }
        };

        var start;

        var applyDynamicSpatials = function() {
            for (var i = 0; i < dynamicSpatials.length; i++) {
                dynamicSpatials[i].tickPhysicsUpdate(ammoApi);
            }
        };

        var updateDynamicSpatials = function(physTpf) {

            activeBodies = 0;
            passiveBodies = 0;
            staticBodies = 0;

            for (var i = 0; i < dynamicSpatials.length; i++) {
                waterPhysics.simulateDynamicSpatialInWater(dynamicSpatials[i], physTpf);
                dynamicSpatials[i].sampleBodyState();
                activeBodies += dynamicSpatials[i].getSpatialSimulateFlag();
                passiveBodies += dynamicSpatials[i].getSpatialDisabledFlag();
                staticBodies += dynamicSpatials[i].isStatic();
            }
        };

        var getNow = function() {
            return (performance.now() - start) / 1000
        };

        var physTpf;

        PhysicsWorldAPI.callPhysicsSimulationUpdate = function() {

            if (!comBuffer) return;

            tpf = comBuffer[ENUMS.BufferChannels.TPF]/1000;


            skipFrame = false;
            frameStart = getNow();
            frameIdle = frameStart - frameEnd;

            applyDynamicSpatials();



            if (comBuffer[ENUMS.BufferChannels.PHYSICS_LOAD] < 0.9 || tpf < 0.1) {

                physTpf = Math.min(tpf, 0.03);


                stepStart = getNow();
                ammoApi.updatePhysicsSimulation(Math.max(physTpf));
                stepEnd = getNow();
                updateDynamicSpatials(physTpf);
            } else {
                skipFrame = true;
                skipFrames++;
            }

            frameEnd = getNow();
            PhysicsWorldAPI.updatePhysicsStats();

        };

        PhysicsWorldAPI.startPhysicsSimulationLoop = function() {
            start = performance.now();
            frameEnd = getNow();
        };

        var getTerrainKey = function(msg) {
            return ''+msg.posx+'_'+msg.posz;
        };

        PhysicsWorldAPI.addTerrainToPhysics = function(msg) {
            console.log("Physics Worker Add Terrain:", msg);

            var addTerrainToPhysics = function(terrainOpts, buffer, posX, posZ) {

                var opts = terrainOpts;
                var body = ammoApi.buildPhysicalTerrain(
                    buffer,
                    opts.terrain_size,
                    posX + opts.terrain_size / 2,
                    posZ + opts.terrain_size / 2,
                    opts.min_height,
                    opts.max_height);

                return body;
            };

            var terrainBody = addTerrainToPhysics(msg[0].options, msg[1], msg[0].posx, msg[0].posz);
            terrainBodies[getTerrainKey(msg[0])] = terrainBody;
            ammoApi.includeBody(terrainBody);
            var dynamicSpatial = new DynamicSpatial();
            dynamicSpatial.setSpatialBuffer(msg[2]);
            dynamicSpatial.setPhysicsBody(terrainBody);
            dynamicSpatials.push(dynamicSpatial);
            console.log("dynamicSpatials:", dynamicSpatials);
        };


        var bodyReady = function(dynamicSpatial, rigidBody) {

            if (dynamicSpatials.indexOf(dynamicSpatial) !== -1) {
                console.log("Already registered...!")
                return;

            }

            dynamicSpatial.setPhysicsBody(rigidBody);
            dynamicSpatials.push(dynamicSpatial);
            ammoApi.includeBody(rigidBody);
        };

        PhysicsWorldAPI.addBodyToPhysics = function(msg) {
            console.log("Physics Worker Add Body:", msg);

            var dynamicSpatial = new DynamicSpatial();
            dynamicSpatial.setSpatialBuffer(msg[1]);
            dynamicSpatial.setupMechanicalShape(msg[0]);
            ammoApi.setupRigidBody(msg[0], dynamicSpatial, bodyReady);


         //   console.log("dynamicSpatials:", dynamicSpatials);
        };

        PhysicsWorldAPI.setPhysicsGeometryBuffer = function(msg) {
            console.log("Set Phys Buffer", msg)
            ammoApi.registerGeoBuffer(msg[0], msg[1])
        };

        PhysicsWorldAPI.processRequest = function(msg) {
            protocolRequests.handleMessage(msg)
        };

        PhysicsWorldAPI.sendWorldMessage = function(protocolKey, data) {
            protocolRequests.sendMessage(protocolKey, data)
        };

        var fetchCallbacks = {};

        PhysicsWorldAPI.fetchConfigData = function(category, key, dataId, callback) {
            if (!fetchCallbacks[category]) {
                fetchCallbacks[category] = {}
            }
            if (!fetchCallbacks[category][key]) {
                fetchCallbacks[category][key] = {};
            }
            if (!fetchCallbacks[category][key][dataId]) {
                fetchCallbacks[category][key][dataId] = [];
            }

            fetchCallbacks[category][key][dataId].push(callback);
            protocolRequests.sendMessage(ENUMS.Protocol.FETCH_CONFIG_DATA, [category, key, dataId])
        };

        PhysicsWorldAPI.setConfigData = function(msg) {
            for (var i = 0; i < fetchCallbacks[msg[0][0]][msg[0][1]][msg[0][2]].length; i++) {
                fetchCallbacks[msg[0][0]][msg[0][1]][msg[0][2]][i](msg[1]);
            }
        };

        PhysicsWorldAPI.applyLocalForceToBodyPoint = function(force, body, point) {
            ammoApi.applyForceAtPointToBody(force, point, body)
        };

        PhysicsWorldAPI.setBodyDamping = function(body, dampingV, dampingA) {
            ammoApi.changeBodyDamping(body, dampingV, dampingA)
        };


        PhysicsWorldAPI.waveHeightAtPos = function(pos) {
            var currentTime = PhysicsWorldAPI.getCom(ENUMS.BufferChannels.FRAME_RENDER_TIME);
            return 0.5 * (Math.sin(currentTime*0.35 + pos.x * 0.09) + Math.cos(currentTime * 0.17 + pos.z * 0.16));
        };

        var getTerrainsCount = function() {
            var count = 0;
            for (var key in terrainBodies) {
                count ++;
            }
            return count;
        };

        PhysicsWorldAPI.registerPhysError = function() {
            comBuffer[ENUMS.BufferChannels.PHYS_ERRORS]++;
        };

        PhysicsWorldAPI.getCom = function(index) {
            return comBuffer[index];
        };

        PhysicsWorldAPI.updatePhysicsStats = function() {

            comBuffer[ENUMS.BufferChannels.FRAME_IDLE] = frameIdle;

            comBuffer[ENUMS.BufferChannels.FRAME_TIME] = frameEnd - frameStart;

            if (!skipFrame) {

                comBuffer[ENUMS.BufferChannels.STEP_TIME] = stepEnd - stepStart;
            }

            comBuffer[ENUMS.BufferChannels.DYNAMIC_COUNT] = dynamicSpatials.length;
            comBuffer[ENUMS.BufferChannels.BODIES_ACTIVE] = activeBodies;
            comBuffer[ENUMS.BufferChannels.BODIES_PASSIVE] = passiveBodies;
            comBuffer[ENUMS.BufferChannels.BODIES_STATIC] = staticBodies;
            comBuffer[ENUMS.BufferChannels.BODIES_TERRAIN] = getTerrainsCount();

            comBuffer[ENUMS.BufferChannels.SKIP_FRAMES] = skipFrames;
            comBuffer[ENUMS.BufferChannels.PHYSICS_LOAD] = comBuffer[ENUMS.BufferChannels.FRAME_TIME]*1000 / comBuffer[ENUMS.BufferChannels.TPF];


        };

        return PhysicsWorldAPI;
    });

