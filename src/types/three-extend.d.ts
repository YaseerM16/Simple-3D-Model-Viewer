declare module 'three/examples/jsm/loaders/OBJLoader' {
    import { Loader } from 'three';
    import { Object3D } from 'three';
    export class OBJLoader extends Loader {
        [x: string];
        constructor();
        load(
            url: string,
            onLoad: (object: Object3D) => void,
            onProgress?: (event: ProgressEvent<EventTarget>) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
    }
}
declare module 'three/examples/jsm/loaders/MTLLoader' {
    import { Loader } from 'three';
    import { MaterialCreator } from 'three/examples/jsm/loaders/MTLLoader';
    export class MTLLoader extends Loader {
        constructor();
        load(
            url: string,
            onLoad: (materialCreator: MaterialCreator) => void,
            onProgress?: (event: ProgressEvent<EventTarget>) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
    }
}
declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera } from 'three';
    import { EventDispatcher } from 'three';
    import { MOUSE } from 'three';
    import { TOUCH } from 'three';
    import { Vector3 } from 'three';

    export class OrbitControls extends EventDispatcher {
        constructor(object: Camera, domElement?: HTMLElement);

        object: Camera;
        domElement: HTMLElement | undefined;

        // API
        enabled: boolean;
        target: Vector3;
        minDistance: number;
        maxDistance: number;
        minZoom: number;
        maxZoom: number;
        minPolarAngle: number;
        maxPolarAngle: number;
        minAzimuthAngle: number;
        maxAzimuthAngle: number;
        enableDamping: boolean;
        dampingFactor: number;
        enableZoom: boolean;
        zoomSpeed: number;
        enableRotate: boolean;
        rotateSpeed: number;
        enablePan: boolean;
        panSpeed: number;
        screenSpacePanning: boolean;
        keyPanSpeed: number;
        autoRotate: boolean;
        autoRotateSpeed: number;
        enableKeys: boolean;
        keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string };
        mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };
        touches: { ONE: TOUCH; TWO: TOUCH };

        saveState(): void;
        reset(): void;
        update(): boolean;
        dispose(): void;
    }
}
