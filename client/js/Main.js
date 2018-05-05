"use strict";

require([
    'WorkerAPI',
    'application/Setup',
    'application/SystemDetector',
    'application/ButtonEventDispatcher',
    'application/ControlStateDispatcher',
    'application/AnalyticsWrapper',
    'ui/GameScreen'
], function(
    WorkerAPI,
    Setup,
    SystemDetector,
    ButtonEventDispatcher,
    ControlStateDispatcher,
    AnalyticsWrapper,
    GameScreen
) {

    var client;

    var setupReady = function() {
        Setup.completed();
        console.log("Setup Ready")
    };

    GameScreen.registerAppContainer(document.body);
    new SystemDetector();

    WorkerAPI.initWorkers();
    WorkerAPI.registerHandlers();
    WorkerAPI.runWorkers();

    var init = function(clientViewer) {
        client = clientViewer;

        new ButtonEventDispatcher();
        new ControlStateDispatcher();


        client.clientReady(setupReady);
    };

    setTimeout(function() {
        Setup.init(init)
    }, 0)

});
