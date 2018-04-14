"use strict";

define([
        'PipelineAPI',
        'PipelineObject',
        '3d/three/ThreeInstanceBufferModel',
        '3d/three/ThreeTerrain'],
    function(
        PipelineAPI,
        PipelineObject,
        ThreeInstanceBufferModel,
        ThreeTerrain
    ) {


        var modelPool = {};

        var activeModels = {};

        var activeMixers = [];

        var contentUrl = function(url) {
            return 'content'+url.slice(1);
        };

        var saveJsonUrl = function(json, url) {
            var shiftUrl = url.slice(1);
            PipelineAPI.saveJsonFileOnServer(json, shiftUrl)
        };


        var getGroupSkinnedMesh = function(children) {

            for (var j = 0; j < children.length; j++) {
                console.log("Types:", children[j].type);

                if (children[j].type === 'Group') {
                    console.log("Use the SkinnedMesh", children[j]);
                    return getGroupSkinnedMesh(children[j]);
                }

                if (children[j].type === 'SkinnedMesh') {
                    console.log("Use the SkinnedMesh", children[j]);
                    return children[j];
                }

                if (children[j].children.length) {
                    return getGroupSkinnedMesh(children[j].children);
                }
            }
        };

        var poolMesh = function(id, mesh, count) {
            var poolCount = count || 3;

            if (!modelPool[id]) {
                modelPool[id] = [];
            }

            for (var i = 0; i < poolCount; i++) {



                if (mesh.type === 'Group') {

                //    var skinMesh = getGroupSkinnedMesh(mesh.children);

                    var clone = mesh;
                    clone.mixer = new THREE.AnimationMixer( clone );
                    clone.animations = mesh.animations;
                    /*
                    var clone = mesh.clone();

                                    if (mesh.animations.length) {

                                        console.log("mesh Has Animations:", mesh);

                                                             clone.animations = mesh.animations;

                                                             var bones = [];

                                                             for (var j = 0; j < mesh.skeleton.bones.length; j++) {
                                                                 bones[j] = mesh.skeleton.bones[j].clone();
                                                             }

                                                             clone.skeleton = new THREE.Skeleton(bones);

                                                             var clonedSkinMesh = clone.children[1];

                                                             clonedSkinMesh.bind(clone.skeleton);


                                                             var geometryFromGlobal = globalAssets.getGeometry(this.characterType)
                                                             var clonedGeometry = geometryFromGlobal.clone()
                                                             var bones = JSON.parse(JSON.stringify(geometryFromGlobal.bones))
                                                             var skinWeights = JSON.parse(JSON.stringify(geometryFromGlobal.skinWeights))
                                                             var skinIndices = JSON.parse(JSON.stringify(geometryFromGlobal.skinIndices))
                                                             skinWeights = skinWeights.map(x => { return new THREE.Vector4().copy(x) })
                                                             skinIndices = skinIndices.map(x => { return new THREE.Vector4().copy(x) })
                                                             Object.assign(clonedGeometry, {bones, skinWeights, skinIndices })

                                                         //    var clonedMesh = new THREE.SkinnedMesh(clonedGeometry, globalAssets.getMaterial(this.characterType).clone())





                                    }

                                    if (clone.animations.length) {
                                        console.log("clone Has Animations:", clone)
                                    }
            */



                } else {
                    var clone = mesh.clone();
                }

                clone.userData.poolId = id;
                clone.frustumCulled = false;
                modelPool[id].push(clone);
            }

        //    console.log("CACHE MESH", [id, modelPool, clone, mesh]);
        };

        var cacheMesh = function(id, mesh, pool) {

            PipelineAPI.setCategoryKeyValue('THREE_MODEL', id, mesh);
            poolMesh(id, mesh, pool)
        };

        var loadFBX = function(modelId, pool) {

            var fbx;

            console.log("load fbx:", modelId,  modelList[modelId].url+'.FBX')

            var err = function(e, x) {
                console.log("FBX ERROR:", e, x);
            }

            var prog = function(p, x) {
                console.log("FBX PROGRESS:", p, x);
            }

            var loader = new THREE.FBXLoader();
            //   loader.options.convertUpAxis = true;
            loader.load( modelList[modelId].url+'.FBX', function ( model ) {
                console.log("FBX LOADED: ",model);

                cacheMesh(modelId, model, pool);
                console.log("Model Pool:", modelPool);
            }, prog, err);
        };

        var loadCollada = function(modelId, pool) {

            var loader = new THREE.ColladaLoader();
        //    loader.options.convertUpAxis = true;
            loader.load( modelList[modelId].url+'.DAE', function ( collada ) {
                var model = collada.scene;

                console.log("DAE LOADED: ",model);

                cacheMesh(modelId, model, pool);
                console.log("Model Pool:", modelPool);
            });
        };



        var getMesh = function(object, id, cb) {

            if ( object instanceof THREE.Mesh ) {
                cb(object, id);
            }

            if (typeof(object.traverse) != 'function') {
                console.log("No Traverse function", object);
                return;
            }

            object.traverse( function ( child ) {
            //    object.remove(child);

                if ( child instanceof THREE.Mesh ) {
                    //    var geom = child.geometry;
                    //    child.geometry = geom;
                    //    geom.uvsNeedUpdate = true;
                    //    console.log("Obj Mesh: ", child);
                    cb(child, id);
                }
            });
        };

        var LoadObj = function(modelId, pool) {

            var loader = new THREE.OBJLoader();

            var loadUrl = function(url, id, meshFound) {

                if (typeof(baseUrl) !== 'undefined') {

                    pool = 1;

                    url = url.substr(2);

                    url = baseUrl+url;
                    console.log(url);
                }

                loader.load(url, function ( object ) {

                    getMesh(object, id, meshFound)
                });
            };

            var uv2Found = function(uv2mesh, mid) {
                var meshObj = PipelineAPI.readCachedConfigKey('THREE_MODEL', mid);

        //        console.log(meshObj, uv2mesh, uv2mesh.geometry.attributes.uv);
                meshObj.geometry.addAttribute('uv2',  uv2mesh.geometry.attributes.uv);
                uv2mesh.geometry.dispose();
                uv2mesh.material.dispose();
                cacheMesh(mid, meshObj, pool);
            };

            var modelFound = function(child, mid) {
                PipelineAPI.setCategoryKeyValue('THREE_MODEL', mid, child);

                if (modelList[modelId].urluv2) {
                    loadUrl(modelList[modelId].urluv2+'.obj', modelId, uv2Found)
                } else {
                    cacheMesh(mid, child, pool);
                }
            };

            loadUrl(modelList[modelId].url+'.obj', modelId, modelFound)

        };

        var modelList = {};

        var ThreeModelLoader = function() {

        };

        ThreeModelLoader.createObject3D = function() {
            return new THREE.Object3D();
        };

        ThreeModelLoader.getModelList = function() {
            return modelList;
        };

        ThreeModelLoader.getModelPool = function() {
            return modelPool;
        };

        ThreeModelLoader.loadModelId = function(id) {

            if (!modelList[id]) {
                console.warn("No model in list by id:", id, modelList);
            }

            switch ( modelList[id].format )	{

                case 'dae':
                    loadCollada(id, modelList[id].pool);
                    break;

                case 'fbx':
                    loadFBX(id, modelList[id].pool);
                    break;

                default:
                    LoadObj(id, modelList[id].pool);
                    break;
            }

        };


        ThreeModelLoader.loadData = function() {

            var modelListLoaded = function(scr, data) {
            //    console.log("Models updated:", data);
                for (var i = 0; i < data.length; i++){
                    modelList[data[i].id] = data[i];
                    ThreeModelLoader.loadModelId(data[i].id);
                }
            };

            new PipelineObject("MODELS", "THREE", modelListLoaded);
            new PipelineObject("MODELS", "THREE_BUILDINGS", modelListLoaded);
        };

        ThreeModelLoader.loadPhysicsData = function(onModelsOk) {

            var modelListLoaded = function(scr, data) {
                //    console.log("Models updated:", data);
                for (var i = 0; i < data.length; i++){
                    modelList[data[i].id] = data[i];
                    ThreeModelLoader.loadModelId(data[i].id);
                }

                onModelsOk();
            };
            new PipelineObject("MODELS", "THREE_PHYSICS", modelListLoaded)
        };


        ThreeModelLoader.loadTerrainData = function(TAPI) {
            ThreeTerrain.loadData(TAPI);
        };

        ThreeModelLoader.createObject3D = function() {
            return new THREE.Object3D();
        };


        var transformModel = function(trf, model) {
            model.position.x = trf.pos[0];
            model.position.y = trf.pos[1];
            model.position.z = trf.pos[2];
            model.rotation.x = trf.rot[0]*Math.PI;
            model.rotation.y = trf.rot[1]*Math.PI;
            model.rotation.z = trf.rot[2]*Math.PI;
            model.scale.x =    trf.scale[0];
            model.scale.y =    trf.scale[1];
            model.scale.z =    trf.scale[2];

        };

        var setup;

        var attachAsynchModel = function(modelId, rootObject) {

            var attachModel = function(model) {

                transformModel(modelList[modelId].transform, model);

                if (model.mixer) {
                    var action = model.mixer.clipAction( model.animations[ 0 ] );
                    action.play();

                    if (activeMixers.indexOf(model.mixer) === -1) {
                        activeMixers.push(model.mixer);
                    } else {
                        console.log("Mixer already active... clean up needed!", model);
                    }

                    console.log("Play Action", action);
                }

                var attachMaterial = function(src, data) {
                    model.material = data;
                    rootObject.add(model);
                };

                var skinMaterial = function(src, data) {
                    model.material = data;
                    model.material.skinning = true;
                    model.material.needsUpdate = true;
                    rootObject.add(model);
                };

                if (model.type === 'SkinnedMesh') {
                    console.log("Attach Skin Material", model);
                    new PipelineObject('THREE_MATERIAL', modelList[modelId].material, skinMaterial, modelList[modelId].material);
                    return;
                }

                    if (model.type === 'Group') {

                        console.log("Attach Group or Scene model", model);

                        var groupMaterial = function(src, mat) {

                            for (var i = 0; i < model.children.length; i++) {
                                var child = model.children[i];
                                if (child.type === 'SkinnedMesh') {
                                    child.material = mat.clone();
                                    child.material.skinning = true;
                                    child.material.needsUpdate = true;
                                }
                            }
                        };

                        new PipelineObject('THREE_MATERIAL', modelList[modelId].material, groupMaterial, modelList[modelId].material);

                        rootObject.add(model);
                        return;
                    }

                    if (model.material) {

                        if (model.material.userData.animMat) {
                            rootObject.add(model);
                            return;
                        }

                    //    attachMaterial(null, PipelineAPI.readCachedConfigKey('THREE_MATERIAL', modelList[modelId].material))

                        new PipelineObject('THREE_MATERIAL', modelList[modelId].material, attachMaterial, modelList[modelId].material);

                    } else {

                    //    var root = new THREE.Object3D();
                    //    root.add(model)
                    //    setup.addToScene(root);

                        for (var i = 0; i < model.children.length; i++) {
                            setup.addToScene(model.children[i])
                        }

                        rootObject.add(model);
                    }


            };

        //    ThreeModelLoader.loadModelId(modelId);

            ThreeModelLoader.fetchPooledMeshModel(modelId, attachModel);
        };



        ThreeModelLoader.loadThreeMeshModel = function(applies, rootObject, ThreeSetup) {

            setup = ThreeSetup;


            attachAsynchModel(applies, rootObject);
            return rootObject;
        };

        var queueFetch = function(id, cb) {
            var mId = id;
            var fCb = cb;

            setTimeout(function() {
                ThreeModelLoader.fetchPooledMeshModel(mId, fCb)
            }, 500)
        };


        ThreeModelLoader.fetchPooledMeshModel = function(id, cb) {


            if (!modelPool[id]) {
                console.log("Queue Fetch", id, modelPool);
                queueFetch(id, cb);
                return;
            }

            var applyModel = function(src, data) {
                var mesh;

                if (!modelPool[src].length) {
                    console.log("Increase Model Pool", id);
                    mesh = data.clone();
                    mesh.userData.poolId = src;
                } else {
                    mesh = modelPool[src].pop()
                }

                if (mesh.pipeObj) {
                    mesh.pipeObj.removePipelineObject();
                }

                mesh.pipeObj = pipeObj;

                cb(mesh)

            };

        //    applyModel(id, PipelineAPI.readCachedConfigKey('THREE_MODEL', id));

            var pipeObj = new PipelineObject('THREE_MODEL', id, applyModel, id, true);

        };


        var getPoolEntry = function(object, id, cb) {

            if (!object) {
                console.log("Bad object", id);
            }

            if (object.userData.poolId) {
                cb(object, id);
                return;
            }

            if (typeof(object) === 'undefined') {
                console.log("Bad object", id);
                return;
            }

            if (typeof(object.traverse) !== 'function') {
                console.log("No Traverse function", object);
                return;
            }


            object.traverse( function ( child ) {
                //    object.remove(child);

                if ( child.userData.poolId ) {
                    //    var geom = child.geometry;
                    //    child.geometry = geom;
                    //    geom.uvsNeedUpdate = true;
                    //    console.log("Obj Mesh: ", child);
                    cb(child, id);
                }
            });
        };


        ThreeModelLoader.returnModelToPool = function(model) {

            var meshFound = function(mesh) {

                if (!mesh) console.log("Try return nothing to the pool", model);

                if (mesh.parent) {
                    mesh.parent.remove(mesh);
                }
                if (!mesh.userData.poolId) {
                    console.log("Missing Pool ID on Mesh", mesh);
                    mesh.geometry.dispose();
                    return;
                }

                if (!mesh.pipeObj) {
                //    console.log("No pipe on mesh", mesh)
                } else {
                    mesh.pipeObj.removePipelineObject();
                }

                modelPool[mesh.userData.poolId].push(mesh);
            };

            if (!model.userData.poolId) {
                //        console.log("Shave scrap objects from mesh before returning it...");
                getPoolEntry(model, null, meshFound)
            } else {
                meshFound(model);
            }
        };

        ThreeModelLoader.disposeHierarchy = function(model) {

            var meshFound = function(mesh) {
                mesh.geometry.dispose();
            };

            if (!model.geometry) {
                getMesh(model, null, meshFound)
            } else {
                meshFound(model);
            }
        };

        var material1 = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true, fog:false } );
        var material2 = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, fog:false } );

        var materials = {
            yellow : new THREE.MeshBasicMaterial( { color: 0xffff88, wireframe: true, fog:false } ),
            red    : new THREE.MeshBasicMaterial( { color: 0xff5555, wireframe: true, fog:false } ),
            blue    : new THREE.MeshBasicMaterial({ color: 0x5555ff, wireframe: true, fog:false } )
        }

        ThreeModelLoader.loadThreeDebugBox = function(sx, sy, sz, colorName) {

            var geometry;

            geometry = new THREE.BoxBufferGeometry( sx || 1, sy || 1, sz || 1);

            return new THREE.Mesh( geometry, materials[colorName] || material1 );
        };

        ThreeModelLoader.loadThreeModel = function(sx, sy, sz) {

            var geometry;

            geometry = new THREE.SphereBufferGeometry( sx, 10, 10);

            return new THREE.Mesh( geometry, material2 );
        };

        ThreeModelLoader.loadThreeQuad = function(sx, sy) {

            var geometry;

            geometry = new THREE.PlaneBufferGeometry( sx || 1, sy || 1, 1 ,1);
            material2 = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

            return new THREE.Mesh( geometry, material2 );
        };

        ThreeModelLoader.loadGroundMesh = function(applies, array1d, rootObject, ThreeSetup, partsReady) {
            ThreeTerrain.loadTerrain(applies, array1d, rootObject, ThreeSetup, partsReady);
            return rootObject;
        };

        ThreeModelLoader.removeGroundMesh = function(pos) {
            var terrain = ThreeTerrain.getThreeTerrainByPosition(pos);
            if (!terrain) {
                console.log("No terrain found at position", pos);
                return;
            }
            terrain.model.children[0].geometry.dispose();
            setup.removeModelFromScene(terrain.model);
            setup.removeModelFromScene(terrain.model.children[0]);
            ThreeTerrain.removeTerrainFromIndex(terrain);

        };


        ThreeModelLoader.terrainVegetationAt = function(pos, nmStore) {
            return ThreeTerrain.terrainVegetationIdAt(pos, nmStore);
        };

        ThreeModelLoader.getHeightFromTerrainAt = function(pos, normalStore) {
            return ThreeTerrain.getThreeHeightAt(pos, normalStore);
        };

        ThreeModelLoader.attachInstancedModelTo3DObject = function(modelId, rootObject, ThreeSetup) {

        };

        ThreeModelLoader.applyMaterialToMesh = function(material, model) {
            model.material = material;
        };

        ThreeModelLoader.getPooledModelCount = function() {
            var pool = 0;
            for (var key in modelPool) {
                pool += modelPool[key].length;
            }
            return pool;
        };

        ThreeModelLoader.updateActiveMixers = function(tpf) {

            for (var i = 0; i < activeMixers.length; i++) {
                activeMixers[i].update(tpf);
            }

        };

        return ThreeModelLoader;
    });