
"use strict";

define([],
    function() {


        var calcVec1;
        var calcVec2;
        var physicsApi;
        var iWeightCurve;
        var jWeightCurve;

        var TerrainFunctions = function(CNNAPI) {
            physicsApi = CNNAPI;
            calcVec1 = new THREE.Vector3();
            calcVec2 = new THREE.Vector3();

            iWeightCurve = new MATH.CurveState(MATH.curves['zeroOneZero'], 1);
            jWeightCurve = new MATH.CurveState(MATH.curves['zeroOneZero'], 1);
        };


        TerrainFunctions.prototype.getPieceTerrainModule = function(piece) {
            return piece.getModuleByIndex(0);
        };

        TerrainFunctions.prototype.getTerrainSegmentse = function(module) {
            return module.data.applies.terrain_segments;
        };

        TerrainFunctions.prototype.getTerrainModuleSize = function(module) {
            return module.data.applies.terrain_size;
        };

        TerrainFunctions.prototype.clampSin = function() {
            return function(value) {
                return Math.sin(value*Math.PI*0.5)
            }
        };


        TerrainFunctions.prototype.getEdgeEasing = function(applies) {
            var easing = THREE.Terrain.EaseInOut;

            if (applies.edge_easing) {
                if (this[applies.edge_easing]) {
                    easing = this[applies.edge_easing]()
                } else {
                    easing = THREE.Terrain[applies.edge_easing];
                }
            };
            return easing;
        };

        TerrainFunctions.prototype.getTerrainModuleEdges = function(applies) {
            var easing = this.getEdgeEasing(applies);

            return {
                invert: applies.invert_hill,
                edgeSize: applies.terrain_edge_size,
                easingFunc:easing
            }
        };

        TerrainFunctions.prototype.getTerrainModuleOpts = function(applies) {

            var easing = this.getEdgeEasing(applies);

            return {
                after: null,
                easing: easing,
                heightmap: THREE.Terrain.DiamondSquare,
                material: null,
                maxHeight: applies.max_height,
                minHeight: applies.min_height,
                optimization: THREE.Terrain.NONE,
                frequency: applies.frequency,
                steps: applies.steps,
                stretch: true,
                turbulent: false,
                //    useBufferGeometry: true,
                xSegments: applies.terrain_segments,
                xSize: applies.terrain_size,
                ySegments: applies.terrain_segments,
                ySize: applies.terrain_size
            }
        };



        TerrainFunctions.prototype.setEdgeVerticeHeight = function(array1d, height) {

            var sideVerts = Math.sqrt(array1d.length);
            var totalVerts = array1d.length;

            var bottomVert = 0;
            var topVert = 0;
            var leftVert = 0;
            var rightVert = 0;

            for (var i = 0; i < sideVerts; i++) {

                bottomVert = i;
                topVert = totalVerts - sideVerts + i;

                leftVert = sideVerts * i;
                rightVert = sideVerts * i + sideVerts - 1;

                array1d[bottomVert].z = height;
                array1d[topVert].z = height;
                array1d[leftVert].z = height;
                array1d[rightVert].z = height;
            }

        };


        var elevateTerrain = function(array1d, elevation) {

            for (var i = 0; i < array1d.length; i++) {
                array1d[i] += elevation;
            }

        };


        var elevateTerrainVerts = function(vertices, elevation) {

            for (var i = 0; i < vertices.length; i++) {
                vertices[i].z += elevation;

            }

        };


        var sliceGeometryAtSeaLevel = function(vertices, maxDepth) {

            var depth;

            for (var i = 0; i < vertices.length; i++) {
                depth = vertices[i].z  // - maxDepth;
                if (depth < -65) {
                    vertices[i].z = maxDepth;
                } else if (depth < 8) {
                    vertices[i].z -= 85;
                } else if (depth <  25) {
                    vertices[i].z += 14;
                }

            }

        };

        TerrainFunctions.prototype.createTerrain = function(moduleOptions) {


            var edges = this.getTerrainModuleEdges(moduleOptions);
            var opts = this.getTerrainModuleOpts(moduleOptions);

            var terrain = new THREE.Terrain(opts);
            terrain.opts = opts;
            terrain.edges = edges;

            elevateTerrainVerts(terrain.children[0].geometry.vertices, 1);
             THREE.Terrain.Edges(terrain.children[0].geometry.vertices, opts, false, edges.edgeSize, null) // edges.easingFunc);

            sliceGeometryAtSeaLevel(terrain.children[0].geometry.vertices, opts.minHeight);

        //    function(g, options, direction, distance, easing) {
            //     THREE.Terrain.RadialEdges(terrain.children[0].geometry.vertices, opts, false, 2) // edges.easingFunc);
        //    this.setEdgeVerticeHeight(terrain.children[0].geometry.vertices, -0.5);

            return terrain;
        };

        TerrainFunctions.prototype.getTerrainBuffers = function(terrain) {

            terrain.children[0].geometry.computeFaceNormals();
            terrain.children[0].geometry.computeVertexNormals();

            var bufferGeo = new THREE.BufferGeometry().fromGeometry( terrain.children[0].geometry );
            var position = bufferGeo.attributes.position.array;
            var normal = bufferGeo.attributes.normal.array;
            var color = bufferGeo.attributes.color.array;
            var uv = bufferGeo.attributes.uv.array;
            return [position, normal, color, uv, this.getTerrainArray1d(terrain)];

        };

        TerrainFunctions.prototype.getTerrainArray1d = function(terrain) {

            var array1d = THREE.Terrain.toArray1D(terrain.children[0].geometry.vertices, terrain.edges.invert);
            return array1d;
        };


        TerrainFunctions.prototype.applyEdgeElevation = function(piece, isMinX, isMaxX, isMinY, isMaxY, elevation) {

            var module = this.getPieceTerrainModule(piece);
            var array1d = module.state.value;

            var sideVerts = Math.sqrt(array1d.length);
            var totalVerts = array1d.length;

            var bottomVert = 0;
            var topVert = 0;
            var leftVert = 0;
            var rightVert = 0;

            var shoreBumb = 1;

            var half = Math.ceil(sideVerts/2);

            var idx = Math.floor(array1d.length / 2);

            var setHeight = MATH.expand(array1d[idx]+4, -2, 2);


            for (var i = 0; i < sideVerts; i++) {

                bottomVert = i;
                topVert = totalVerts - sideVerts + i;

                leftVert = sideVerts * i;
                rightVert = sideVerts * i + sideVerts - 1;


                if (isMinX) {

                    for (var j = 0; j < half; j++) {
                        array1d[bottomVert + j*sideVerts] = MATH.expand(array1d[bottomVert + j*sideVerts]*(j/half) + elevation*(1-(j/half)),-0.5, 0.2);
                    }
                }

                if (isMaxX) {

                    for (var j = 0; j < half; j++) {
                        array1d[topVert - j*sideVerts] = MATH.expand(array1d[topVert - j*sideVerts]*(j/half) + elevation*(1-(j/half)),-0.5, 0.2);
                    }
                }

                if (isMinY) {

                    for (var j = 0; j < half; j++) {
                        array1d[leftVert + j] = MATH.expand(array1d[leftVert + j]*(j/half) + elevation*(1-(j/half)),-0.5, 0.2);
                    }
                }

                if (isMaxY) {

                    for (var j = 0; j < half; j++) {
                        array1d[rightVert - j] =  MATH.expand(array1d[rightVert - j]*(j/half) + elevation*(1-(j/half)),-0.5, 0.2);
                    }
                }
            }

            if (isMinX || isMaxX || isMinY || isMaxY) {

                this.setHeightByIndexAndReach(array1d, idx, idx, Math.round(i*shoreBumb), setHeight)
                return true;
            }
            return false;

        };

        TerrainFunctions.prototype.enableTerrainPhysics = function(piece) {
            var module = this.getPieceTerrainModule(piece);
            physicsApi.includeBody(module.body);
        };

        TerrainFunctions.prototype.disableTerrainPhysics = function(piece) {
            var module = this.getPieceTerrainModule(piece);
            physicsApi.excludeBody(module.body);
        };


        var makeMatrix2D = function(array1d) {

            var tgt = new Array(Math.sqrt(array1d.length)),
                xl = Math.sqrt(array1d.length),
                yl = Math.sqrt(array1d.length),
                i, j;
            for (i = 0; i < xl; i++) {
                tgt[i] = new Float64Array(xl);
                for (j = 0; j < yl; j++) {
                    tgt[i][j] = array1d[j * xl + i];
                }
            }

            return tgt;

        };


        TerrainFunctions.prototype.addTerrainToPhysics = function(terrainOpts, buffer, posX, posZ) {

            var opts = terrainOpts;
        //    var matrix = makeMatrix2D(array1d);
            var body = physicsApi.buildPhysicalTerrain(
                buffer,
                opts.terrain_size,
                posX-opts.terrain_size/2,
                posZ-opts.terrain_size/2,
                opts.min_height,
                opts.max_height);

            return body;
        };


// get a height at point from matrix
        TerrainFunctions.prototype.getPointInMatrix = function(matrixData, y, x) {
            return matrixData[x][y];
        };

        TerrainFunctions.prototype.displaceAxisDimensions = function(axPos, axMin, axMax, quadCount) {
            var matrixPos = axPos-axMin;
            return quadCount*matrixPos/(axMax - axMin);
        };


        TerrainFunctions.prototype.returnToWorldDimensions = function(axPos, axMin, axMax, quadCount) {
            var quadSize = (axMax-axMin) / quadCount;
            var insidePos = axPos * quadSize;
            return axMin+insidePos;
        };



// get the value at the precise integer (x, y) coordinates
        TerrainFunctions.prototype.getAt = function(array1d, segments, x, y) {

            var yFactor = (y) * (segments+1);
            var xFactor = x;

            var idx = (yFactor + xFactor);

            return array1d[idx];
        };

// get the value at the precise integer (x, y) coordinates
        TerrainFunctions.prototype.setAt = function(height, array1d, segments, x, y, weight) {

            var factor = weight || 1;

            if (x <= 2 || x >= segments-2 || y <= 2 || y >= segments-2) {
                console.log("FLATTEN OUTSIDE TERRING WONT WORK!");
                return;
            }

            var yFactor = (y) * (segments+1);
            var xFactor = x;

            var idx = (yFactor + xFactor);
//    console.log(y, yFactor, xFactor, idx);
            array1d[idx] = height * factor + array1d[idx]* (1 - factor);
        };


        var p1  = new THREE.Vector3();
        var p2  = new THREE.Vector3();
        var p3  = new THREE.Vector3();


        var points = [];

        var setTri = function(tri, x, y, z) {
            tri.x = x;
            tri.y = y;
            tri.z = z;
        };


        TerrainFunctions.prototype.getTriangleAt = function(array1d, segments, x, y) {

            var xc = Math.ceil(x);
            var xf = Math.floor(x);
            var yc = Math.ceil(y);
            var yf = Math.floor(y);

            var fracX = x - xf;
            var fracY = y - yf;

            p1.x = xf;
            p1.y = yc;

            p1.z = this.getAt(array1d, segments, xf, yc);


            setTri(p1, xf, yc, this.getAt(array1d, segments,xf, yc));
            setTri(p2, xc, yf, this.getAt(array1d, segments,xc, yf));


            if (fracX < 1-fracY) {
                setTri(p3,xf,yf,this.getAt(array1d, segments,xf, yf));
            } else {
                setTri(p3, xc, yc, this.getAt(array1d, segments,xc, yc));
            }

            points[0] = p1;
            points[1] = p2;
            points[2] = p3;
            return points;
        };

        var p0  = {x:0, y:0, z:0};

        TerrainFunctions.prototype.getHeightForPlayer = function(serverPlayer, normalStore) {

            var gridSector = serverPlayer.currentGridSector;
            if (!gridSector) return 0;

            var groundPiece = gridSector.groundPiece;

            return this.getTerrainHeightAt(groundPiece, serverPlayer.piece.spatial.pos, normalStore);
        };


        var triangle = new THREE.Triangle();

        TerrainFunctions.prototype.getPreciseHeight = function(array1d, segments, x, z, normalStore, htN, htP) {
            var tri = this.getTriangleAt(array1d, segments, x, z);

            setTri(p0, x, z, 0);

            var find = MATH.barycentricInterpolation(tri[0], tri[1], tri[2], p0);


            if (normalStore) {

                triangle.a.x =  this.returnToWorldDimensions(tri[0].x, htN, htP, segments);
                triangle.a.z =  this.returnToWorldDimensions(tri[0].y, htN, htP, segments);
                triangle.a.y =  tri[0].z;

                triangle.b.x =  this.returnToWorldDimensions(tri[1].x, htN, htP, segments);
                triangle.b.z =  this.returnToWorldDimensions(tri[1].y, htN, htP, segments);
                triangle.b.y =  tri[1].z;

                triangle.c.x =  this.returnToWorldDimensions(tri[2].x, htN, htP, segments);
                triangle.c.z =  this.returnToWorldDimensions(tri[2].y, htN, htP, segments);
                triangle.c.y =  tri[2].z;

                if (triangle.a.equals(triangle.b)) {
                //    console.log("TrianglePoint is the same..., A & B");
                    if (triangle.b.equals(triangle.c)) {
                   //     console.log("TrianglePoint is the same..., B & C");

                    //    if (triangle.a.equals(triangle.c)) {
                            console.log("TrianglePoint is the same..., A, B & C", x, z);
                    //    }
                    }

                }

                triangle.getNormal(normalStore);

                if (normalStore.y < 0) {
                    normalStore.negate();
                }

            }

            return find.z;
        };


        TerrainFunctions.prototype.setTerrainHeightAt = function(groundPiece, pos, reach) {

            var module = this.getPieceTerrainModule(groundPiece);

            calcVec1.setVec(groundPiece.spatial.pos);

            calcVec2.setVec(pos);
            calcVec2.subVec(calcVec1);

            var terrainSize = this.getTerrainModuleSize(module);
            var segments = this.getTerrainSegmentse(module);

            var array1d = module.state.value;

            this.setHeightAt(module, calcVec2, array1d, terrainSize, segments, pos.getY(), reach);
        };



        TerrainFunctions.prototype.setHeightAt = function(module, posVec, array1d, terrainSize, segments, height, reach) {
            var pos = posVec.data;

            var htP = terrainSize;
            var htN = -htP;

            if (pos[0] < htN || pos[0] > htP || pos[2] < htN || pos[2] > htP) {

                console.log("Terrain!", pos[0], pos[2], "Is Outside")
                //    return -1000;
                pos[0] = MATH.clamp(pos[0], htN, htP);
                pos[2] = MATH.clamp(pos[2], htN, htP);
            }


            var x = this.displaceAxisDimensions(2*pos[0]-terrainSize, htN, htP, segments);
            var y = this.displaceAxisDimensions(2*pos[2]-terrainSize, htN, htP, segments);


            var xf = Math.floor(x);
            var yf = Math.floor(y);


            var vertexReach = Math.ceil(reach / (terrainSize/segments))+1;

            // height = -1
            this.setHeightByIndexAndReach(array1d, xf, yf, vertexReach, height)

        };

        TerrainFunctions.prototype.setHeightByIndexAndReach = function(array1d, xf, yf, vertexReach, height) {

            var segments = Math.sqrt(array1d.length)-1;

            for (var i = -vertexReach; i < vertexReach+1; i++) {

                var iw =  Math.cos((i) / (vertexReach+1));

                for (var j = -vertexReach; j < vertexReach+1; j++) {

                    var jw = Math.cos((j) / (vertexReach+1));

                    var cw = MATH.clamp(iw*jw * 1.40, 0, 1);

                    var ijW = cw * cw * ((cw)+MATH.sillyRandom(i*2.1231+j*31.5123)*(1-cw)) * ((cw)+MATH.sillyRandom((i+j)*4.31+j*31.513)*(1-cw)); // jWeight*iWeight;

                    this.setAt(height, array1d, segments,xf+i, yf+j, ijW);
                }
            }
        };



        TerrainFunctions.prototype.getTerrainHeightAt = function(terrain, pos, terrainOrigin, normalStore) {


        //    calcVec1.copy(terrainOrigin);
        //    calcVec2.copy(pos);
            calcVec2.subVectors(pos, terrainOrigin);

            var terrainSize = terrain.opts.xSize;
            var segments = terrain.opts.xSegments;

        //    var height = terrain.opts.maxHeight - terrain.opts.minHeight;

            calcVec2.x -= terrain.opts.xSize / 2;
            calcVec2.z -= terrain.opts.xSize / 2;
2
            return this.getHeightAt(calcVec2, terrain.array1d, terrainSize, segments, normalStore);
        };

        TerrainFunctions.prototype.getDisplacedHeight = function(array1d, segments, x, z, htP, htN, normalStore) {
            var tx = this.displaceAxisDimensions(x, htN, htP, segments);
            var tz = this.displaceAxisDimensions(z, htN, htP, segments);

            return this.getPreciseHeight(array1d, segments, tx, tz, normalStore, htN, htP);

        };


        TerrainFunctions.prototype.getHeightAt = function(pos, array1d, terrainSize, segments, normalStore) {

            var htP = terrainSize*0.5;
            var htN = - htP;

            if (pos.x < htN || pos.z < htN) {
            //    console.log("Terrain!", pos.x, pos.z, htP, htN ,"Is Outside WORKER");
                return false;
                pos.x = MATH.clamp(pos.x, htN, htP);
                pos.z = MATH.clamp(pos.z, htN, htP);
            }

            if (pos.x > htP  || pos.z > htP) {
            //    console.log("Terrain!", pos.x, pos.z, htP, htN ,"Is Outside WORKER");
                return false;
                pos.x = MATH.clamp(pos.x, htN, htP);
                pos.z = MATH.clamp(pos.z, htN, htP);
            }


            return this.getDisplacedHeight(array1d, segments, pos.x, pos.z, htP, htN, normalStore);
        };



        return TerrainFunctions;

    });
