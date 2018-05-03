"use strict";

define([
        'WorkerAPI',
		'Events',
        'ThreeAPI',
        'EffectsAPI',
		'application/TimeTracker',
		'PipelineAPI'
    ],
	function(
        WorkerAPI,
        evt,
        ThreeAPI,
        EffectsAPI,
        TimeTracker,
        PipelineAPI
    ) {
3

		var frame = 0;

		var name;
        var memory;

        var ClientState = '';
        var sendMessage = function() {};

        var ClientViewer = function(pointerCursor, sceneController) {
            ClientState = ENUMS.ClientStates.INITIALIZING;

            this.sceneController = sceneController;

			this.pointerCursor = pointerCursor;

			this.timeTracker = new TimeTracker();

            this.handlers = {};

            this.handlers.timeTracker = this.timeTracker;

            PipelineAPI.setCategoryData(ENUMS.Category.POINTER_STATE, this.pointerCursor.getPointerState());

            console.log("configs", PipelineAPI.getCachedConfigs(), ENUMS);

		};


        var aggDiff = 0;

        var tickEvent = {frame:0, tpf:1};

        var monitorTime = {};
        var timeEntries = [];

        var monitorRender = {};
        var renderEntries = [];

        var monitorEffects = {};
        var effectEntries = [];

        var monitorGame = {};
        var gameEntries = [];

        var monitorSystem = {};
        var systemEntries = [];

        var monitorBrowser = {};
        var browserEntries = [];

        var monitorStatus = {};
        var statusEntries = [];

        ClientViewer.prototype.setupSimulation = function(ready) {
            var _this = this;

            PipelineAPI.setCategoryKeyValue('STATUS', 'RENDER_MONITOR', renderEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'TIME_MONITOR', timeEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'EFFECT_MONITOR', effectEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'GAME_MONITOR', gameEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'SYSTEM_MONITOR', systemEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'BROWSER_MONITOR', browserEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'STATUS_MONITOR', statusEntries);


            var sceneReady = function() {
                ready()
            }.bind(this);

            this.sceneController.setup3dScene(sceneReady);

            var fxReady = function() {
                console.log("fxReady");
            }



        };
        var comBuffer;
        ClientViewer.prototype.clientReady = function(setupReady) {

            var clientTick = function(tpf) {
                this.tick(tpf)
            }.bind(this);

            var postrenderTick = function(tpf) {
                this.tickPostrender(tpf)
            }.bind(this);

            var fxReady = function() {
                ThreeAPI.getSetup().addPrerenderCallback(clientTick);
                ThreeAPI.getSetup().addPostrenderCallback(postrenderTick);
                comBuffer = PipelineAPI.readCachedConfigKey('SHARED_BUFFERS', ENUMS.Key.WORLD_COM_BUFFER);
                setupReady()
            };
          //  comBuffer = PipelineAPI.readCachedConfigKey('SHARED_BUFFERS', ENUMS.Key.WORLD_COM_BUFFER);
            this.sceneController.setupEffectPlayers(fxReady);

        //    fxReady();
        };


        var start;
        var gameTime = 0;



        var tickTimeout;

        var percentify = function(number, total) {
            return Math.round((number/total) * 100);
        };

        var kilofy = function(number) {
            return Math.round((number/1000));
        };

        var notifyStatus = function(store, value, dataKey) {
            if (!store[dataKey]) {
                store[dataKey] = {}
            }
            store[dataKey].dirty = store[dataKey].value !== value;
            store[dataKey].key = dataKey;
            store[dataKey].value = value
        };

        var listData = function(list, data) {
            var i = 0;
            for (var key in data) {
                list[i] = data[key];
                i++;
            }
        };

        var statusUpdate = 0;


        ClientViewer.prototype.tickStatusUpdate = function(ftpf) {




            statusUpdate += ftpf;
            if (statusUpdate < 0.5) return;
            statusUpdate = 0;


        //    notifyStatus(monitorGame,    '',                                              'MAIN THREAD');
        //    notifyStatus(monitorGame,    GameAPI.getActors().length,                      'ACTORS');
        //    notifyStatus(monitorGame,    GameAPI.getPieces().length,                      'PIECES');
        //    notifyStatus(monitorGame,    GameAPI.countCombatPieces(),                     'COMBATANTS');
        //    notifyStatus(monitorGame,    GameAPI.getGameCommander().countActiveAttacks(), 'ATTACK_POOL');
        //    notifyStatus(monitorSystem,    '',                                              'DATA TRANSFERS');
        //    notifyStatus(monitorSystem,    GameAPI.getGameWorker().getProtocolCount(),      'PROTOCOLS');
        //    notifyStatus(monitorSystem,    GameAPI.getGameWorker().getCallCount(),          'WRKR_CALLS');
        //    notifyStatus(monitorSystem,    GameAPI.getGameWorker().getCallbackCount(),      'CALLBACKS');
        //    notifyStatus(monitorSystem,    GameAPI.getGameWorker().getProtocolUpdateCount(),'BAD_UPDATES');
        //    notifyStatus(monitorSystem,    GameAPI.getGameCommander().countExecutionCalls(),'EXEC_CALLS');
        //    notifyStatus(monitorSystem,    GameAPI.getGameCommander().getFetchMisses(),     'FETCH_MISS');

        //    notifyStatus(monitorEffects, EffectsAPI.sampleTotalParticlePool(),       'PRTCL_POOL');
        //    notifyStatus(monitorEffects, EffectsAPI.sampleActiveRenderersCount(),    'RENDERERS');
        //    notifyStatus(monitorEffects, EffectsAPI.countTotalEffectPool(),          'FX_POOL');
        //    notifyStatus(monitorEffects, EffectsAPI.sampleActiveEffectsCount(),      'FX_COUNT');
        //    notifyStatus(monitorEffects, EffectsAPI.sampleActiveParticleCount(),     'PARTICLES');
        //    notifyStatus(monitorEffects, EffectsAPI.sampleEffectActivations(),       'FX_ADDS');

            memory = performance.memory;
            var memoryUsed = (memory.usedJSHeapSize / 1048576) / (memory.jsHeapSizeLimit / 1048576 );
            var mb = Math.round(memory.usedJSHeapSize / 104857.6) / 10;

            comBuffer[ENUMS.BufferChannels.MEM_JS_HEAP] = memoryUsed;
            comBuffer[ENUMS.BufferChannels.MEM_JS_MB]   = mb;

            var tpf =           PipelineAPI.readCachedConfigKey('STATUS', 'TPF')*1000;
            var timeGame =      PipelineAPI.readCachedConfigKey('STATUS', 'TIME_GAME_TICK')/1000;
            var timeIdle =      PipelineAPI.readCachedConfigKey('STATUS', 'TIME_ANIM_IDLE')*1000;
            var timeRender =    PipelineAPI.readCachedConfigKey('STATUS', 'TIME_ANIM_RENDER');

            comBuffer[ENUMS.BufferChannels.TPF]         =  Math.floor(tpf)  ;
            comBuffer[ENUMS.BufferChannels.IDLE]        =  Math.floor(timeIdle)  ;
            comBuffer[ENUMS.BufferChannels.TIME_GAME]   =  percentify(timeGame*1000, tpf) ;
            comBuffer[ENUMS.BufferChannels.TIME_RENDER] =  percentify(timeRender*1000, tpf);
//

            var shaders = ThreeAPI.sampleRenderInfo('programs', null);
            var count = 0;
            for (var key in shaders) {
                count++
            }

            comBuffer[ENUMS.BufferChannels.SCN_NODES]   = ThreeAPI.countAddedSceneModels();
            comBuffer[ENUMS.BufferChannels.MESH_POOL]   = ThreeAPI.countPooledModels();
            comBuffer[ENUMS.BufferChannels.DRAW_CALLS]  = ThreeAPI.sampleRenderInfo('render', 'calls');
            comBuffer[ENUMS.BufferChannels.VERTICES]    = ThreeAPI.sampleRenderInfo('render', 'triangles');
            comBuffer[ENUMS.BufferChannels.GEOMETRIES]  = ThreeAPI.sampleRenderInfo('memory', 'geometries');
            comBuffer[ENUMS.BufferChannels.TEXTURES]    = ThreeAPI.sampleRenderInfo('memory', 'textures');
            comBuffer[ENUMS.BufferChannels.SHADERS]     = count;


              comBuffer[ENUMS.BufferChannels.FILE_CACHE]        =    PipelineAPI.readCachedConfigKey('STATUS',      'FILE_CACHE');
              comBuffer[ENUMS.BufferChannels.EVENT_LISTENERS]   =    PipelineAPI.readCachedConfigKey('STATUS',      'EVENT_LISTENERS');
              comBuffer[ENUMS.BufferChannels.EVENT_TYPES]       =    PipelineAPI.readCachedConfigKey('STATUS',      'EVENT_TYPES');
              comBuffer[ENUMS.BufferChannels.LISTENERS_ONCE]    =    PipelineAPI.readCachedConfigKey('STATUS',      'LISTENERS_ONCE');
              comBuffer[ENUMS.BufferChannels.FIRED_EVENTS]      =    PipelineAPI.readCachedConfigKey('STATUS',      'FIRED_EVENTS');

            return;

            var monitorBrowser = {};
            var monitorStatus = {};

            var browserSetup = PipelineAPI.getCachedConfigs().SETUP;
            var status       = PipelineAPI.getCachedConfigs().STATUS;


            notifyStatus(monitorBrowser,      browserSetup.OS,              'OS');
            notifyStatus(monitorBrowser,      browserSetup.BROWSER,         'BROWSER');
            notifyStatus(monitorBrowser,      browserSetup.INPUT,           'INPUT');
        //    notifyStatus(monitorBrowser,      browserSetup.LANDSCAPE,       'LANDSCAPE');

        //    notifyStatus(monitorBrowser,      browserSetup.SCREEN[0],       'WIDTH'  );
        //    notifyStatus(monitorBrowser,      browserSetup.SCREEN[1],       'HEIGHT' );
        //    notifyStatus(monitorBrowser,      browserSetup.PX_SCALE,        'PX_SCALE' );


            notifyStatus(monitorStatus,      status.DEV_MODE,                'DEV_MODE');
            notifyStatus(monitorStatus,      status.DEV_STATUS,              'DEV_STATUS');


//
            listData(renderEntries, monitorRender);
            listData(timeEntries, monitorTime);
            listData(effectEntries, monitorEffects);
            listData(gameEntries, monitorGame);
            listData(systemEntries, monitorSystem);
            listData(browserEntries, monitorBrowser);
            listData(statusEntries, monitorStatus);

        };



        var tmpVec = new THREE.Vector3();
        var tmpVec2 = new THREE.Vector3();

        var fxArg = {effect:"normal_explosion_core", pos:tmpVec, vel:tmpVec2}



        var relayCamera = function(camera) {

            comBuffer[ENUMS.BufferChannels.CAM_POS_X]      = camera.position.x;
            comBuffer[ENUMS.BufferChannels.CAM_POS_Y]      = camera.position.y;
            comBuffer[ENUMS.BufferChannels.CAM_POS_Z]      = camera.position.z;

            comBuffer[ENUMS.BufferChannels.CAM_QUAT_X]     = camera.quaternion.x;
            comBuffer[ENUMS.BufferChannels.CAM_QUAT_Y]     = camera.quaternion.y;
            comBuffer[ENUMS.BufferChannels.CAM_QUAT_Z]     = camera.quaternion.z;
            comBuffer[ENUMS.BufferChannels.CAM_QUAT_W]     = camera.quaternion.w;

            comBuffer[ENUMS.BufferChannels.CAM_FOV]        = camera.fov;
            comBuffer[ENUMS.BufferChannels.CAM_NEAR]       = camera.near;
            comBuffer[ENUMS.BufferChannels.CAM_FAR]        = camera.far;
            comBuffer[ENUMS.BufferChannels.CAM_ASPECT]     = camera.aspect;

        };


        ClientViewer.prototype.tick = function(tpf) {

            gameTime += tpf;
            comBuffer[ENUMS.BufferChannels.FRAME_RENDER_TIME] = gameTime;
            start = performance.now();
            
			frame++;

        //    var responseStack = this.connection.processTick();

        //    this.processResponseStack(responseStack);

			var exactTpf = this.timeTracker.trackFrameTime(frame);

            if (exactTpf < 0.002) {
        //        console.log("superTiny TPF");
                return;
            }

		//	console.log(tpf - exactTpf, tpf, this.timeTracker.tpf);

            aggDiff += tpf-exactTpf;


        //    GameAPI.tickControls(tpf, gameTime);

            this.pointerCursor.tick();

        //    GameAPI.tickPlayerPiece(tpf, gameTime);

        //    this.sceneController.tickEffectPlayers(tpf);

        //    clearTimeout(tickTimeout);

        //    tickTimeout = setTimeout(function() {

                tickEvent.frame = frame;
                tickEvent.tpf = tpf;

        //        GameAPI.tickGame(tpf, gameTime);

        //    }, 0);


            var distance = 350 + 100*Math.sin(gameTime*0.2);

            ThreeAPI.setCameraPos(distance*Math.sin(gameTime*0.2), distance * 0.4 + Math.sin(gameTime*0.35) * 50, distance*Math.cos(gameTime*0.2));
            ThreeAPI.cameraLookAt(19*Math.cos(gameTime*1), 40 + distance * 0.12,  19*Math.sin(gameTime*1));


            for (var i = 0; i < 15; i++) {
                tmpVec.x = distance * Math.random() * (Math.random() - 0.5);
                tmpVec.y = distance * Math.random() * 0.1 * Math.random();
                tmpVec.z = distance * Math.random() * (Math.random() - 0.5);


                tmpVec2.x = Math.sin(gameTime);
                tmpVec2.y = Math.random();
                tmpVec2.z = Math.cos(gameTime);

            //    evt.fire(evt.list().GAME_EFFECT, fxArg);
            }


        //    this.viewerMain.tickViewerClient(tpf);
            
        //    evt.fire(evt.list().CAMERA_TICK, {frame:frame, tpf:tpf});


            PipelineAPI.setCategoryKeyValue('STATUS', 'TIME_GAME_TICK', performance.now() - start);

            this.sceneController.tickEffectsAPI(comBuffer[ENUMS.BufferChannels.FRAME_RENDER_TIME]-tpf);

            this.tickStatusUpdate(tpf);

            ThreeAPI.updateCamera();

            relayCamera(ThreeAPI.getCamera());

            if (PipelineAPI.getPipelineOptions('jsonPipe').polling.enabled) {
                PipelineAPI.tickPipelineAPI(tpf);
            }
            
		};

        ClientViewer.prototype.tickPostrender = function(tpf) {

            comBuffer[ENUMS.BufferChannels.WAKE_INDEX]++;

            WorkerAPI.wakeWorldThread();

            PipelineAPI.setCategoryKeyValue('STATUS', 'TPF', tpf);
            evt.fire(evt.list().CLIENT_TICK, tickEvent);
        };

		return ClientViewer;

	});