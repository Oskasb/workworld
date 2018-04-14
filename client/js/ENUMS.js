
if(typeof(ENUMS) === "undefined"){
    ENUMS = {};
}

(function(ENUMS){

    ENUMS.Protocol = {
        WORKER_READY:       0,
        SET_LOOP:           1,
        NOTIFY_FRAME:       2
    };

    ENUMS.CallName = {
        WORLD:              0,
        DATA:               1
    };

    ENUMS.Worker = {
        WORLD:              0,
        DATA:               1
    };

    ENUMS.ClientStates = {
        INITIALIZING:'INITIALIZING',
        DISCONNECTED:'DISCONNECTED',
        CONNECTING:'CONNECTING',
        CONNECTED:'CONNECTED',
        LOADING:'LOADING',
        READY:'READY',
        PLAYING:'PLAYING',
        CLIENT_REQUESTED:'CLIENT_REQUESTED',
        CLIENT_REGISTERED:'CLIENT_REGISTERED',
        PLAYER_REQUESTED:'PLAYER_REQUESTED'
    };

    ENUMS.PointerStates = {
        DISABLED:       0,
        ENABLED:        1,
        HOVER:          2,
        PRESS_INIT:     3,
        PRESS:          4,
        PRESS_EXIT:     5,
        ACTIVATE:       6,
        ACTIVE:         7,
        ACTIVE_HOVER:   8,
        ACTIVE_PRESS:   9,
        DEACTIVATE:     10
    };

    ENUMS.PieceAlignments = {
        NEUTRAL:        0,
        GOOD:           1,
        EVIL:           2
    };

    ENUMS.PieceActivationStates = {
        RELEASE:        -2,
        INACTIVE:       -1,
        HIDDEN:         0,
        VISIBLE:        1,
        BRINKSMAN:      2,
        ACTIVE:         3,
        ENGAGED:        4
    };

    ENUMS.CombatStates = {
        NONE:           0,
        IDLE:           1,
        DISENGAGING:    2,
        DISENGAGED:     3,
        THREATENED:     4,
        ENGAGING:       5,
        ENGAGED:        6,
        DISABLED:       7,
        DESTROYED:      8,
        KILLED:         9,
        REMOVED:       10
    };

    ENUMS.Category = {
        POINTER_STATE:'POINTER_STATE',
        STATUS:'STATUS',
        LOAD_MODEL:'LOAD_MODEL',
        LOAD_MODULE:'LOAD_MODULE',
        LOAD_TERRAIN:'LOAD_TERRAIN',
        LOAD_CAMERA:'LOAD_CAMERA',
        LOAD_CONTROLS:'LOAD_CONTROLS',
        LOAD_PIECE:'LOAD_PIECE',
        LOAD_ACTOR:'LOAD_ACTOR',
        LOAD_ENVIRONMENT:'LOAD_ENVIRONMENT',
        LOAD_PARTICLES:'LOAD_PARTICLES',
        LOAD_LEVEL:'LOAD_LEVEL',
        LOAD_APP:'LOAD_APP',
        GUI_ELEMENT:'GUI_ELEMENT',
        setup:'setup'
    };

    ENUMS.Key = {
        MON_VEGETATION:'MON_VEGETATION',
        DEBUG:'DEBUG',
        FULL_SCREEN:'FULL_SCREEN',
        MODEL_LOADER:'MODEL_LOADER',
        TERRAIN_LOADER:'TERRAIN_LOADER',
        MODULE_LOADER:'MODULE_LOADER',
        PIECE_LOADER:'PIECE_LOADER',
        CONTROL_LOADER:'CONTROL_LOADER',
        CAMERA_LOADER:'CAMERA_LOADER',
        ACTOR_LOADER:'ACTOR_LOADER',
        LEVEL_LOADER:'LEVEL_LOADER',
        APP_LOADER:'APP_LOADER',
        PARTICLE_LOADER:'PARTICLE_LOADER',
        ENV_LOADER:'ENV_LOADER',
        ADD:'ADD',
        REMOVE:'REMOVE'
    };

    ENUMS.Channel = {
        client_state:'client_state'
    };

    ENUMS.Gui = {
        rightPanel:'rightPanel',
        leftPanel:'leftPanel'
    };

    ENUMS.Type = {
        toggle:'toggle'
    }

    ENUMS.ModuleParams = {
        attachment_points:'attachment_points',
        channels:'channels'
    };


})(ENUMS);
