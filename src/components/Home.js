import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import './Home.css';

function Home() {
    const mountRef = useRef(null);

    useEffect(() => {
        let isExploding = false;
        let isPostExplosion = false;
        const explosionStartTime = { current: 0 };
        const explosionDuration = 5000; // duración de la explosión en milisegundos
        const explosionRadius = 100; // radio máximo de explosión
        const initialDelay = 10000; // 10 segundos de retraso antes de la explosión
        const startTime = Date.now();

        // Configuración de la escena
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // Efecto de bloom
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,  // intensidad
            0.4,  // radio
            0.85  // umbral
        );
        composer.addPass(bloomPass);

        // Sistema de partículas para la explosión
        const particlesCount = 10000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particlesCount * 3);
        const velocities = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        const sphereRadius = 2; // Radio inicial de la esfera de partículas

        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Distribución esférica
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = Math.cbrt(Math.random()) * sphereRadius; // Distribución uniforme en volumen

            positions[i] = r * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = r * Math.cos(phi);

            // Velocidades para la explosión
            velocities[i] = (positions[i] / sphereRadius) * 2;
            velocities[i + 1] = (positions[i + 1] / sphereRadius) * 2;
            velocities[i + 2] = (positions[i + 2] / sphereRadius) * 2;

            // Colores (del centro hacia afuera)
            const intensity = 1 - (r / sphereRadius);
            colors[i] = intensity;
            colors[i + 1] = intensity;
            colors[i + 2] = 1; // Más azul en los bordes
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            alphaTest: 0.5
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // Posición de la cámara
        camera.position.z = 50;

        // Crear una esfera brillante para después de la explosión
        const postExplosionGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const postExplosionMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0
        });
        const postExplosionSphere = new THREE.Mesh(postExplosionGeometry, postExplosionMaterial);
        postExplosionSphere.visible = false;
        scene.add(postExplosionSphere);

        // Animación
        const animate = () => {
            requestAnimationFrame(animate);

            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;

            if (!isExploding && !isPostExplosion && elapsedTime > initialDelay) {
                isExploding = true;
                explosionStartTime.current = currentTime;
            }

            if (isExploding) {
                const progress = Math.min((currentTime - explosionStartTime.current) / explosionDuration, 1);
                const positions = particles.attributes.position.array;
                const colors = particles.attributes.color.array;

                for (let i = 0; i < particlesCount * 3; i += 3) {
                    positions[i] += velocities[i] * progress * explosionRadius;
                    positions[i + 1] += velocities[i + 1] * progress * explosionRadius;
                    positions[i + 2] += velocities[i + 2] * progress * explosionRadius;

                    // Desvanecer los colores
                    colors[i] *= (1 - progress);
                    colors[i + 1] *= (1 - progress);
                    colors[i + 2] *= (1 - progress);
                }

                particles.attributes.position.needsUpdate = true;
                particles.attributes.color.needsUpdate = true;

                if (progress === 1) {
                    isExploding = false;
                    isPostExplosion = true;
                    particleSystem.visible = false;
                    postExplosionSphere.visible = true;
                    bloomPass.strength = 5; // Aumentamos la intensidad del bloom
                }
            } else if (isPostExplosion) {
                // Animación de la esfera post-explosión
                const pulseFactor = (Math.sin(currentTime * 0.005) + 1) * 0.5;
                postExplosionSphere.scale.setScalar(0.2 + pulseFactor * 0.5);
                postExplosionMaterial.opacity = 0.8 + pulseFactor * 0.2;

                // Hacer que la esfera gire lentamente
                postExplosionSphere.rotation.y += 0.01;
                postExplosionSphere.rotation.x += 0.005;

                // Ajustar la intensidad del bloom
                bloomPass.strength = 5 + pulseFactor * 3;

                // Cambiar el color de la esfera para un efecto más brillante
                const hue = (currentTime * 0.0002) % 1;
                postExplosionMaterial.color.setHSL(hue, 1, 0.5 + pulseFactor * 0.5);
            } else {
                // Rotación del cúmulo inicial
                particleSystem.rotation.y += 0.005;
                particleSystem.rotation.x += 0.002;

                // Efecto de brillo pulsante inicial
                const pulseFactor = (Math.sin(currentTime * 0.005) + 1) * 0.5;
                particleMaterial.size = 0.1 + pulseFactor * 0.01;
            }

            composer.render();
        };

        animate();

        // Manejar el redimensionamiento de la ventana
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Limpieza
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className="home-container">
            <div ref={mountRef} className="animation-container"></div>
            <div className="content">
                <h1 className="rpg-header">Bienvenido al mundo de Zoen</h1>
            </div>
        </div>
    );
}

export default Home;