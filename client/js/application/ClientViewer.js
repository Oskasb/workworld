"use strict";

define([
		'Events',
        'GameAPI',
        'ThreeAPI',
        'EffectsAPI',
		'application/ClientRegistry',
        'application/debug/SetupDebug',
		'io/Connection',
		'application/TimeTracker',
		'modelviewer/ViewerMain',
		'ui/UiMessenger',
		'PipelineAPI'
    ],
	function(
        evt,
        GameAPI,
        ThreeAPI,
        EffectsAPI,
        ClientRegistry,
        SetupDebug,
        Connection,
        TimeTracker,
        ViewerMain,
        UiMessenger,
        PipelineAPI
    ) {
3

		var frame = 0;

		var name;

        var ClientState = '';
        var sendMessage = function() {};

        var ClientViewer = function(pointerCursor, sceneController) {
            ClientState = ENUMS.ClientStates.INITIALIZING;

            new SetupDebug();

            this.sceneController = sceneController;

			this.pointerCursor = pointerCursor;

			this.timeTracker = new TimeTracker();
			this.viewerMain = new ViewerMain();

			this.gameMain = this.viewerMain;

		//	this.guiSetup = new GuiSetup();
            new UiMessenger();
            this.connection = new Connection();

            this.handlers = {};

            this.handlers.clientRegistry = new ClientRegistry();
            this.handlers.gameMain = this.viewerMain;
            this.handlers.timeTracker = this.timeTracker;
        //    this.handlers.clientWorld = new ClientWorld();

            PipelineAPI.setCategoryData(ENUMS.Category.POINTER_STATE, this.pointerCursor.inputState);

		};


        ClientViewer.prototype.setClientState = function(state) {
            ClientState = state;
    //        console.log("SetCLientState: ", state);
            evt.fire(evt.list().MESSAGE_UI, {channel:ENUMS.Channel.client_state, message:' - '+state});
        };


        ClientViewer.prototype.connectSocket = function(socketMessages, connection) {
            this.setClientState(ENUMS.ClientStates.CONNECTING);

            var disconnectedCallback = function() {
                console.log("Socket Disconnected");
                this.setClientState(ENUMS.ClientStates.DISCONNECTED);
                evt.fire(evt.list().MESSAGE_UI, {channel:'connection_error', message:'Connection Lost'});
                evt.fire(evt.list().CONNECTION_CLOSED, {data:'closed'});
                evt.removeListener(evt.list().SEND_SERVER_REQUEST, handleSendRequest);
                setTimeout(function() {
                    connect();
                }, 200)
            }.bind(this);

            var handleSendRequest = function(e) {
                var msg = socketMessages.getMessageById(evt.args(e).id);
                var args = evt.args(e);
                sendMessage(msg, args);
            };

            var errorCallback = function(error) {
                console.log("Socket Error", error);
            };

            var connectedCallback = function() {
                this.setClientState(ENUMS.ClientStates.CONNECTED);
                evt.fire(evt.list().MESSAGE_UI, {channel:'connection_status', message:'Connection Open'});
                evt.fire(evt.list().CONNECTION_OPEN, {});
                evt.on(evt.list().SEND_SERVER_REQUEST, handleSendRequest);
            }.bind(this);

            var connect = function() {
                sendMessage = connection.setupSocket(connectedCallback, errorCallback, disconnectedCallback);
            };

            connect();

        };


        ClientViewer.prototype.initiateClientGui = function() {
        //    this.guiSetup.initMainGui();
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
                ready();
            }.bind(this);

            this.sceneController.setup3dScene(sceneReady);

        };

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
                setupReady()
            };

            this.sceneController.setupEffectPlayers(fxReady);

        };

        var start;
        var gameTime = 0;

        ClientViewer.prototype.tickPostrender = function(tpf) {
            PipelineAPI.setCategoryKeyValue('STATUS', 'TPF', tpf);
            evt.fire(evt.list().CLIENT_TICK, tickEvent);
        };

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


            notifyStatus(monitorGame,    '',                                              'MAIN THREAD');
            notifyStatus(monitorGame,    GameAPI.getActors().length,                      'ACTORS');
            notifyStatus(monitorGame,    GameAPI.getPieces().length,                      'PIECES');
            notifyStatus(monitorGame,    GameAPI.countCombatPieces(),                     'COMBATANTS');
            notifyStatus(monitorGame,    GameAPI.getGameCommander().countActiveAttacks(), 'ATTACK_POOL');

            notifyStatus(monitorSystem,    '',                                              'DATA TRANSFERS');
            notifyStatus(monitorSystem,    GameAPI.getGameWorker().getProtocolCount(),      'PROTOCOLS');

            notifyStatus(monitorSystem,    GameAPI.getGameWorker().getCallCount(),          'WRKR_CALLS');
            notifyStatus(monitorSystem,    GameAPI.getGameWorker().getCallbackCount(),      'CALLBACKS');
            notifyStatus(monitorSystem,    GameAPI.getGameWorker().getProtocolUpdateCount(),'BAD_UPDATES');
            notifyStatus(monitorSystem,    GameAPI.getGameCommander().countExecutionCalls(),'EXEC_CALLS');
            notifyStatus(monitorSystem,    GameAPI.getGameCommander().getFetchMisses(),     'FETCH_MISS');

            notifyStatus(monitorEffects, EffectsAPI.sampleTotalParticlePool(),       'PRTCL_POOL');
            notifyStatus(monitorEffects, EffectsAPI.sampleActiveRenderersCount(),    'RENDERERS');
            notifyStatus(monitorEffects, EffectsAPI.countTotalEffectPool(),          'FX_POOL');
            notifyStatus(monitorEffects, EffectsAPI.sampleActiveEffectsCount(),      'FX_COUNT');
            notifyStatus(monitorEffects, EffectsAPI.sampleActiveParticleCount(),     'PARTICLES');
            notifyStatus(monitorEffects, EffectsAPI.sampleEffectActivations(),       'FX_ADDS');

            var memory = performance.memory;
            var memoryUsed = ( (memory.usedJSHeapSize / 1048576) / (memory.jsHeapSizeLimit / 1048576 ));
            var mb = Math.round(memory.usedJSHeapSize / 104857.6) / 10;

            var tpf = PipelineAPI.readCachedConfigKey('STATUS', 'TPF')*1000;
            var timeGame = PipelineAPI.readCachedConfigKey('STATUS', 'TIME_GAME_TICK')/1000;
            var timeIdle = PipelineAPI.readCachedConfigKey('STATUS', 'TIME_ANIM_IDLE');
            var timeRender = PipelineAPI.readCachedConfigKey('STATUS', 'TIME_ANIM_RENDER');

            notifyStatus(monitorTime,      Math.floor(tpf)+'ms',                        'TPF');
            notifyStatus(monitorTime,      Math.floor(tpf)+'ms',                        'IDLE');
            notifyStatus(monitorTime,      percentify(timeGame*1000, tpf) + '%',        'TIME_GAME');
            notifyStatus(monitorTime,      percentify(timeRender*1000, tpf) +'%',       'TIME_RENDER');
            notifyStatus(monitorTime,      mb+'MB',                                     'MEM_USED');
            notifyStatus(monitorTime,      Math.round(100 - (memoryUsed*100)) + '%',    'MEM_LEFT');

            var shaders = ThreeAPI.sampleRenderInfo('programs', null);
            var count = 0;
            for (var key in shaders) {
                count++
            }

            notifyStatus(monitorRender,      ThreeAPI.countAddedSceneModels(),                              'SCN_NODES');
            notifyStatus(monitorRender,      ThreeAPI.countPooledModels(),                                  'MESH_POOL');
            notifyStatus(monitorRender,      ThreeAPI.sampleRenderInfo('render', 'calls'),                  'DRAW_CALLS');
            notifyStatus(monitorRender,      kilofy(ThreeAPI.sampleRenderInfo('render', 'vertices'))+'k',   'VERTICES');
            notifyStatus(monitorRender,      ThreeAPI.sampleRenderInfo('memory', 'geometries'),             'GEOMETRIES');
            notifyStatus(monitorRender,      ThreeAPI.sampleRenderInfo('memory', 'textures'),               'TEXTURES');
            notifyStatus(monitorRender,      count,                                                         'SHADERS');

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
            notifyStatus(monitorStatus,      status.FILE_CACHE,              'FILE_CACHE');
            notifyStatus(monitorStatus,      status.EVENT_LISTENERS,         'EVT_LISTNRS');
            notifyStatus(monitorStatus,      status.EVENT_TYPES,             'EVT_TYPES');
            notifyStatus(monitorStatus,      status.LISTENERS_ONCE,          'LISTNRS_1');
            notifyStatus(monitorStatus,      status.FIRED_EVENTS,            'FIRED_EVTS');

//
            listData(renderEntries, monitorRender);
            listData(timeEntries, monitorTime);
            listData(effectEntries, monitorEffects);
            listData(gameEntries, monitorGame);
            listData(systemEntries, monitorSystem);
            listData(browserEntries, monitorBrowser);
            listData(statusEntries, monitorStatus);

        };



        ClientViewer.prototype.tick = function(tpf) {

            gameTime += tpf;
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


            GameAPI.tickControls(tpf, gameTime);

            this.pointerCursor.tick();

            GameAPI.tickPlayerPiece(tpf, gameTime);

            this.sceneController.tickEffectPlayers(tpf);

            clearTimeout(tickTimeout);
            tickTimeout = setTimeout(function() {

                tickEvent.frame = frame;
                tickEvent.tpf = tpf;

                GameAPI.tickGame(tpf, gameTime);

            }, 0);



            this.viewerMain.tickViewerClient(tpf);
            
        //    evt.fire(evt.list().CAMERA_TICK, {frame:frame, tpf:tpf});

            PipelineAPI.setCategoryKeyValue('STATUS', 'TIME_GAME_TICK', performance.now() - start);


            this.tickStatusUpdate(tpf);


            if (PipelineAPI.getPipelineOptions('jsonPipe').polling.enabled) {
                PipelineAPI.tickPipelineAPI(tpf);
            }
            
		};

		return ClientViewer;

	});