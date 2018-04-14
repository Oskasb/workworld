"use strict";


define(['Events',
    'PipelineAPI',
    '3d/camera/CameraFunctions'
], function(
    evt,
    PipelineAPI,
    CameraFunctions
) {

    var cameraFunctions;

    var ThreeCamera = function() {

    };

    var setupThreeCamera = function(e) {

    //    evt.on(evt.list().CLIENT_TICK, updateCamera);
        
        cameraFunctions = new CameraFunctions();
        PipelineAPI.setCategoryKeyValue('CAMERA_DATA', 'CAMERA', cameraFunctions);
    };
    
    var ownPiece;
    var tpf;

    var updateCamera = function(e) {
        if (!on) return;
    //    tpf = evt.args(e).tpf;
    //    ownPiece = PipelineAPI.readCachedConfigKey('GAME_DATA', 'OWN_PLAYER').ownPiece;
    //    cameraFunctions.setCameraTargetPiece(ownPiece);
    //    cameraFunctions.updateCamera(tpf);
    };

    evt.on(evt.list().ENGINE_READY, setupThreeCamera);

    var on = false;


    var controlledPieceUpdated = function(e) {
        on=true;
    };

    evt.once(evt.list().CONTROLLED_PIECE_UPDATED, controlledPieceUpdated);


    return ThreeCamera

});