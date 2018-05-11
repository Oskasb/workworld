"use strict";

define([
        'PipelineAPI',
        'EffectsAPI'
    ],
    function(
        PipelineAPI,
        EffectsAPI
    ) {


        var frame = 0;
        var timeIdle;

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

        var monitorPhysics = {};
        var physicsEntries = [];

        var StatusMonitor = function() {
            PipelineAPI.setCategoryKeyValue('STATUS', 'RENDER_MONITOR', renderEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'TIME_MONITOR', timeEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'EFFECT_MONITOR', effectEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'GAME_MONITOR', gameEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'SYSTEM_MONITOR', systemEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'BROWSER_MONITOR', browserEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'STATUS_MONITOR', statusEntries);
            PipelineAPI.setCategoryKeyValue('STATUS', 'PHYSICS_MONITOR', physicsEntries);
        };

        var start;
        var gameTime = 0;


        var percentify = function(number, total) {
            return Math.round((number/total) * 100);
        };

        var kilofy = function(number) {
            return Math.round((number/1000));
        };

        var twoDecimals = function(number) {
            return MATH.decimalify(number, 100)
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

        StatusMonitor.prototype.tickStatusUpdate = function() {

            var comBuffer = WorldAPI.getWorldComBuffer();

            notifyStatus(monitorTime,      comBuffer[ENUMS.BufferChannels.TPF] +'ms',                        'TPF');
            notifyStatus(monitorTime,      comBuffer[ENUMS.BufferChannels.IDLE]+'ms',                        'IDLE');

            notifyStatus(monitorTime,      percentify(comBuffer[ENUMS.BufferChannels.TIME_GAME], comBuffer[ENUMS.BufferChannels.TPF] ) + '%',        'TIME_GAME');
            notifyStatus(monitorTime,      percentify(comBuffer[ENUMS.BufferChannels.TIME_RENDER], comBuffer[ENUMS.BufferChannels.TPF] ) +'%',       'TIME_RENDER');

            statusUpdate += 1;
            if (statusUpdate < 3) return;
            statusUpdate = 0;


            notifyStatus(monitorGame,    '',                                              'MAIN THREAD');
        //    notifyStatus(monitorGame,    GameAPI.getActors().length,                      'ACTORS');
        //    notifyStatus(monitorGame,    GameAPI.getPieces().length,                      'PIECES');
        //    notifyStatus(monitorGame,    GameAPI.countCombatPieces(),                     'COMBATANTS');
        //    notifyStatus(monitorGame,    GameAPI.getGameCommander().countActiveAttacks(), 'ATTACK_POOL');
            notifyStatus(monitorSystem,    '',                                              'DATA TRANSFERS');
        //    notifyStatus(monitorSystem,    GameAPI.getGameWorker().getProtocolCount(),      'PROTOCOLS');//
        //    notifyStatus(monitorSystem,    GameAPI.getGameWorker().getCallCount(),          'WRKR_CALLS');
        //    notifyStatus(monitorSystem,    GameAPI.getGameWorker().getCallbackCount(),      'CALLBACKS');
        //    notifyStatus(monitorSystem,    GameAPI.getGameWorker().getProtocolUpdateCount(),'BAD_UPDATES');
        //    notifyStatus(monitorSystem,    GameAPI.getGameCommander().countExecutionCalls(),'EXEC_CALLS');
        //    notifyStatus(monitorSystem,    GameAPI.getGameCommander().getFetchMisses(),     'FETCH_MISS');

            notifyStatus(monitorEffects, EffectsAPI.sampleTotalParticlePool(),       'PRTCL_POOL');
            notifyStatus(monitorEffects, EffectsAPI.sampleActiveRenderersCount(),    'RENDERERS');
            notifyStatus(monitorEffects, EffectsAPI.countTotalEffectPool(),          'FX_POOL');
            notifyStatus(monitorEffects, EffectsAPI.sampleActiveEffectsCount(),      'FX_COUNT');
            notifyStatus(monitorEffects, EffectsAPI.sampleActiveParticleCount(),     'PARTICLES');
            notifyStatus(monitorEffects, EffectsAPI.sampleEffectActivations(),       'FX_ADDS');


        //    var tpf = PipelineAPI.readCachedConfigKey('STATUS', 'TPF')*1000;
            var timeGame = PipelineAPI.readCachedConfigKey('STATUS', 'TIME_GAME_TICK')/1000;
        //    var timeIdle = PipelineAPI.readCachedConfigKey('STATUS', 'TIME_ANIM_IDLE');//
        //    var timeRender = PipelineAPI.readCachedConfigKey('STATUS', 'TIME_ANIM_RENDER');



            notifyStatus(monitorTime,      Math.round(comBuffer[ENUMS.BufferChannels.MEM_JS_MB])+'MB',                'MEM_USED');
            notifyStatus(monitorTime,      Math.round(100 - (comBuffer[ENUMS.BufferChannels.MEM_JS_HEAP]*100)) + '%', 'MEM_LEFT');

        //    var shaders = ThreeAPI.sampleRenderInfo('programs', null);

            var count = 0;

        //    for (var key in shaders) {
        //        count++
        //    }

            notifyStatus(monitorRender,     comBuffer[ENUMS.BufferChannels.SCN_NODES]   ,           'SCN_NODES');
            notifyStatus(monitorRender,     comBuffer[ENUMS.BufferChannels.MESH_POOL]   ,           'MESH_POOL');
            notifyStatus(monitorRender,     comBuffer[ENUMS.BufferChannels.DRAW_CALLS]  ,           'DRAW_CALLS');
            notifyStatus(monitorRender,     kilofy(comBuffer[ENUMS.BufferChannels.VERTICES])+'k',   'TRIANGLES');
            notifyStatus(monitorRender,     comBuffer[ENUMS.BufferChannels.GEOMETRIES]  ,           'GEOMETRIES');
            notifyStatus(monitorRender,     comBuffer[ENUMS.BufferChannels.TEXTURES]    ,           'TEXTURES');
            notifyStatus(monitorRender,     comBuffer[ENUMS.BufferChannels.SHADERS]     ,           'SHADERS');

            var monitorBrowser = {};
            var monitorStatus = {};

        ////    var browserSetup = PipelineAPI.getCachedConfigs().SETUP;
            var status       = PipelineAPI.getCachedConfigs().STATUS;


            notifyStatus(monitorBrowser,              '',      'BROWSER');
        //    notifyStatus(monitorBrowser,      browserSetup.BROWSER,         'BROWSER');
        //    notifyStatus(monitorBrowser,      browserSetup.INPUT,           'INPUT');
            //    notifyStatus(monitorBrowser,      browserSetup.LANDSCAPE,       'LANDSCAPE');

            //    notifyStatus(monitorBrowser,      browserSetup.SCREEN[0],       'WIDTH'  );
            //    notifyStatus(monitorBrowser,      browserSetup.SCREEN[1],       'HEIGHT' );
            //    notifyStatus(monitorBrowser,      browserSetup.PX_SCALE,        'PX_SCALE' );


            notifyStatus(monitorStatus,      status.DEV_MODE,                'DEV_MODE');
            notifyStatus(monitorStatus,      status.DEV_STATUS,              'DEV_STATUS');
            notifyStatus(monitorStatus,      comBuffer[ENUMS.BufferChannels.FILE_CACHE]      ,  'FILE_CACHE');
            notifyStatus(monitorStatus,      comBuffer[ENUMS.BufferChannels.EVENT_LISTENERS] ,  'EVT_LISTNRS');
            notifyStatus(monitorStatus,      comBuffer[ENUMS.BufferChannels.EVENT_TYPES]     ,  'EVT_TYPES');
            notifyStatus(monitorStatus,      comBuffer[ENUMS.BufferChannels.LISTENERS_ONCE]  ,  'LISTNRS_1');
            notifyStatus(monitorStatus,      comBuffer[ENUMS.BufferChannels.FIRED_EVENTS]    ,  'FIRED_EVTS');

            notifyStatus(monitorPhysics,     percentify(comBuffer[ENUMS.BufferChannels.PHYSICS_LOAD], 1)+'%',   'THREAD_LOAD');

            notifyStatus(monitorPhysics,     twoDecimals(comBuffer[ENUMS.BufferChannels.FRAME_IDLE]*1000)+'ms',  'FRAME_IDLE');

            notifyStatus(monitorPhysics,     twoDecimals(comBuffer[ENUMS.BufferChannels.STEP_TIME]*1000)+'ms',  'STEP_TIME');
            notifyStatus(monitorPhysics,     twoDecimals((comBuffer[ENUMS.BufferChannels.FRAME_TIME]-comBuffer[ENUMS.BufferChannels.STEP_TIME])*1000)+'ms', 'TIME_UPDATES');

            notifyStatus(monitorPhysics,     comBuffer[ENUMS.BufferChannels.DYNAMIC_COUNT]  ,                   'DYNAMICS');
            notifyStatus(monitorPhysics,     comBuffer[ENUMS.BufferChannels.BODIES_ACTIVE]  ,                   'RGBD_ACTIVE');
            notifyStatus(monitorPhysics,     comBuffer[ENUMS.BufferChannels.BODIES_PASSIVE] ,                   'RGBD_PASSIVE');
            notifyStatus(monitorPhysics,     comBuffer[ENUMS.BufferChannels.BODIES_STATIC]  ,                   'RGBD_STATIC');
            notifyStatus(monitorPhysics,     comBuffer[ENUMS.BufferChannels.BODIES_TERRAIN] ,                   'TERRAINS');
            notifyStatus(monitorPhysics,     comBuffer[ENUMS.BufferChannels.SKIP_FRAMES] ,                      'SKIP_FRAMES');
            notifyStatus(monitorPhysics,     comBuffer[ENUMS.BufferChannels.PHYS_ERRORS] ,                      'ERRORS');


            listData(renderEntries, monitorRender);
            listData(timeEntries, monitorTime);
            listData(effectEntries, monitorEffects);
            listData(gameEntries, monitorGame);
            listData(systemEntries, monitorSystem);
            listData(browserEntries, monitorBrowser);
            listData(statusEntries, monitorStatus);
            listData(physicsEntries, monitorPhysics);

        };



        StatusMonitor.prototype.tick = function(timeStart) {

            frame++;

            PipelineAPI.setCategoryKeyValue('STATUS', 'TIME_GAME_TICK', performance.now() - timeStart);

            this.tickStatusUpdate();

        };

        return StatusMonitor;

    });