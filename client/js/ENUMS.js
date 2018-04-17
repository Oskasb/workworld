
if(typeof(ENUMS) === "undefined"){
    ENUMS = {};
}

(function(ENUMS){



    ENUMS.Protocol = {
        WORKER_READY:       0,
        SET_LOOP:           1,
        NOTIFY_FRAME:       2,
        SET_INPUT_BUFFER:   3,
        SET_WORLD_BUFFER:   4,
        CREATE_WORLD:       5,
        REGISTER_TERRAIN:   6,
        FETCH_PIPELINE_DATA:7,
        SEND_PIPELINE_DATA: 8
    };

    ENUMS.BufferTypes = {
        ENVIRONMENT:        0,
        CAMERA:             1,
        SPATIAL:            2,
        TERRAIN:            3
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

    ENUMS.InputState = {
        MOUSE_X:        0,
        MOUSE_Y:        1,
        WHEEL_DELTA:    2,
        START_DRAG_X:   3,
        START_DRAG_Y:   4,
        DRAG_DISTANCE_X:5,
        DRAG_DISTANCE_Y:6,
        ACTION_0:       7,
        ACTION_1:       8,
        LAST_ACTION_0:  9,
        LAST_ACTION_1:  10,
        PRESS_FRAMES:   11,
        BUFFER_SIZE:    12
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

    ENUMS.Environment = {
        luminance:          0,
        turbidity:          1,
        rayleigh:           2,
        mieCoefficient:     3,
        mieDirectionalG:    4,
        inclination:        5,
        azimuth:            6,
        distance:           7,
        sunR:               8,
        sunB:               9,
        sunG:               10,
        moonR:              11,
        moon:               12,
        moonG:              13,
        ambientR:           14,
        ambientB:           15,
        ambientG:           16,
        fogR:               17,
        fogB:               18,
        fogG:               19,
        fogDensity:         20,
        sunPosX:            21,
        sunPosY:            22,
        sunPosZ:            23,
        sunQuatX:           24,
        sunQuatY:           25,
        sunQuatZ:           26,
        sunQuat:            27
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

    var map = {};

    for (var key in ENUMS) {
        map[key] = [];

        for (var i in ENUMS[key]) {
            map[key][ENUMS[key][i]] = i;
        }
    }

    ENUMS.Map = map;

    console.log("ENUMS", ENUMS);

})(ENUMS);
