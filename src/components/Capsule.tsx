'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Capsule = () => {
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
                const meshCount = obj.children.length;
                let totalVertices = 0;
                let totalFaces = 0;
                const infoLines: string[] = [];

                obj.traverse((child: unknown) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        const geometry = mesh.geometry as THREE.BufferGeometry;
                        const infoLines: string[] = [];

                        // Mesh info
                        infoLines.push(`🧱 Geometry Type: ${geometry.type}`);
                        infoLines.push(`🎯 Indexed: ${geometry.index ? 'Yes' : 'No'}`);
                        infoLines.push(`🧩 Attributes: ${Object.keys(geometry.attributes).join(', ')}`);

                        const positionAttr = geometry.getAttribute('position');
                        const totalVertices = positionAttr ? positionAttr.count : 0;
                        const totalFaces = geometry.index
                            ? geometry.index.count / 3
                            : totalVertices / 3;

                        infoLines.push(`🔢 Total Vertices: ${totalVertices}`);
                        infoLines.push(`🔺 Total Faces: ${Math.round(totalFaces)}`);


                        // Bounding Box
                        geometry.computeBoundingBox();
                        const box = geometry.boundingBox;
                        if (box) {
                            infoLines.push(`📦 Bounding Box:`);
                            infoLines.push(`   x: [${box.min.x.toFixed(2)} → ${box.max.x.toFixed(2)}]`);
                            infoLines.push(`   y: [${box.min.y.toFixed(2)} → ${box.max.y.toFixed(2)}]`);
                            infoLines.push(`   z: [${box.min.z.toFixed(2)} → ${box.max.z.toFixed(2)}]`);
                        }

                        // Bounding Sphere
                        geometry.computeBoundingSphere();
                        const sphere = geometry.boundingSphere;
                        if (sphere) {
                            infoLines.push(`🟢 Bounding Sphere Radius: ${sphere.radius.toFixed(2)}`);
                        }

                        // UV Mapping
                        const hasUV = !!geometry.attributes.uv;
                        infoLines.push(`🧵 UV Mapping: ${hasUV ? 'Yes' : 'No'}`);

                        // Material Info
                        const mat = mesh.material as THREE.Material;
                        if ('name' in mat) {
                            infoLines.push(`🎨 Material Name: ${mat.name || 'Unnamed'}`);
                        }

                        setMetadata(infoLines);
                    }
                });
                scene.add(obj);
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
            <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm border border-gray-200 overflow-auto max-h-[80vh]">
                <h2 className="text-lg font-semibold mb-2 text-green-600">Model Metadata</h2>
                <ul className="text-xs text-gray-800 space-y-1 list-disc list-inside">
                    {metadata.map((line, idx) => (
                        <li key={idx}>{line}</li>
                    ))}
                </ul>
            </div>
            <div ref={mountRef} className="w-full h-screen" />
        </>
    );
};

export default Capsule;
