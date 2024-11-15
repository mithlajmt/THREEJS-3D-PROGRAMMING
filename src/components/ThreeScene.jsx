import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Create the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create two initial cubes
    const geometry = new THREE.BoxGeometry();
    const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    const cube1 = new THREE.Mesh(geometry, material1);
    const cube2 = new THREE.Mesh(geometry, material2);

    cube1.position.x = -3;
    cube2.position.x = 3;

    scene.add(cube1);
    scene.add(cube2);

    let speed = 0.02;
    let hasSplit = false;
    let newCubes = [];

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      if (!hasSplit) {
        // Move the initial cubes towards each other
        if (cube1.position.x < 0) cube1.position.x += speed;
        if (cube2.position.x > 0) cube2.position.x -= speed;

        // Check for collision and split into 4 cubes
        if (Math.abs(cube1.position.x - cube2.position.x) < 0.1) {
          console.log('Collision detected! Splitting cubes...');
          hasSplit = true;

          scene.remove(cube1, cube2);

          // Create four new smaller cubes
          for (let i = 0; i < 4; i++) {
            const newCube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff69b4 }));
            newCube.scale.set(0.5, 0.5, 0.5);
            newCubes.push(newCube);
            scene.add(newCube);
            newCube.position.set(0, 0, 0); // Start from the collision point
          }

          // Assign directions for each cube
          newCubes[0].velocity = { x: 0.05, y: 0.05 };  // Top-right
          newCubes[1].velocity = { x: -0.05, y: 0.05 }; // Top-left
          newCubes[2].velocity = { x: 0.05, y: -0.05 }; // Bottom-right
          newCubes[3].velocity = { x: -0.05, y: -0.05 }; // Bottom-left
        }
      }

      // Move the smaller cubes after collision
      if (hasSplit) {
        newCubes.forEach(cube => {
          cube.position.x += cube.velocity.x;
          cube.position.y += cube.velocity.y;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function to remove renderer on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default ThreeScene;
