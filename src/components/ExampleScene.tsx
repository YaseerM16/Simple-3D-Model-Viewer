'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [metadata, setMetadata] = useState<string[]>([]);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#ffffff'); // white
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        camera.position.z = 4;

        // Load MTL and OBJ
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath('/capsule_model/');
        mtlLoader.load('capsule.mtl', (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('/capsule_model/');
            objLoader.load('capsule.obj', (obj) => {
                obj.scale.set(1, 1, 1);
                scene.add(obj);
                const meshData: string[] = [];

                obj.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        mesh.geometry.computeBoundingBox();
                        const box = mesh.geometry.boundingBox;

                        meshData.push(
                            `Mesh Name: ${mesh.name}`,
                            `Vertex Count: ${mesh.geometry.attributes.position.count}`,
                            `Material: ${(mesh.material as any)?.name ?? 'N/A'}`,
                            `Bounding Box: ${box?.min.toArray()} to ${box?.max.toArray()}`
                        );
                    }
                });

                setMetadata(meshData);

            });
        });


        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);
    return (
        <>
            <ul className="absolute top-4 left-4 bg-white p-4 shadow-md rounded text-black z-10 max-w-sm text-xs">
                {metadata.map((line, idx) => (
                    <li key={idx}>{line}</li>
                ))}
            </ul>
            <div ref={mountRef} className="w-full h-screen" />
        </>
    )
};

export default ThreeScene;
