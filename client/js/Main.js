"use strict";



require([
    'WorkerAPI',
    'application/SystemDetector',
    'application/ButtonEventDispatcher',
    'application/ControlStateDispatcher',
    'application/AnalyticsWrapper',
    'ui/GameScreen'
], function(
    WorkerAPI,
    SystemDetector,
    ButtonEventDispatcher,
    ControlStateDispatcher,
    AnalyticsWrapper,
    GameScreen
) {


    var init = function() {
        new SystemDetector();
        new ButtonEventDispatcher();
        new ControlStateDispatcher();
        GameScreen.registerAppContainer(document.body);
        WorkerAPI.initWorkers();
        WorkerAPI.registerHandlers();
        WorkerAPI.runWorkers();
    };

    setTimeout(function() {
        init();
    }, 0)

});
