"use strict";

define([
    'application/ClientViewer',
    '3d/SceneController',
    'io/PointerCursor'
], function(
    ClientViewer,
    SceneController,
    PointerCursor
) {

    var dataLoader;
    var client;

    var Setup = function() {

    };

    Setup.init = function(onReady) {
        var sceneController = new SceneController();

        var clientReady = function() {
            onReady(client);
        };

        client = new ClientViewer(new PointerCursor(), sceneController);
        client.setupSimulation(clientReady);
    };

    Setup.completed = function() {
        dataLoader.notifyCompleted()
    };

    return Setup;

});
