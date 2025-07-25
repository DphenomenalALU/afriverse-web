'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/types';

declare global {
  interface Window {
    arCleanup?: () => Promise<void>;
  }
}

export default function TryOnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('item');
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    return () => {
      if (window.arCleanup) {
        window.arCleanup();
      }
    };
  }, []);

  const handleStopTryOn = () => {
    if (window.arCleanup) {
      window.arCleanup();
    }
    router.back();
  };

  return (
    <>
      {/* Import Maps for Three.js + MindAR Face */}
      <Script id="import-maps" type="importmap">
        {`
          {
            "imports": {
              "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
              "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
              "mindar-face-three": "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-face-three.prod.js"
            }
          }
        `}
      </Script>

      {/* MindAR App Script */}
      <Script type="module">
        {`
          import * as THREE from 'three';
          import { MindARThree } from 'mindar-face-three';
          import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

          async function initAR() {
            try {
              // Get the product ID
              const productId = new URLSearchParams(window.location.search).get('item');
              if (!productId) throw new Error('Product ID is required');

              // Fetch the listing data
              const response = await fetch('/api/listings/' + productId);
              const data = await response.json();
              if (!data.model_3d) throw new Error('3D model not available');

              // Initialize MindAR
              const mindarThree = new MindARThree({
                container: document.querySelector('#ar-container'),
              });

              const { renderer, scene, camera } = mindarThree;

              // Create lights
              const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
              scene.add(ambientLight);

              const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
              directionalLight.position.set(0, 1, 0);
              scene.add(directionalLight);

              // Load 3D model
              const loader = new GLTFLoader();
              
              // Create a loading manager to handle loading events
              const manager = new THREE.LoadingManager();
              manager.onProgress = function(url, itemsLoaded, itemsTotal) {
                const progress = (itemsLoaded / itemsTotal * 100).toFixed(0);
                document.querySelector('#loading-progress').textContent = progress + '%';
              };
              
              loader.setManager(manager);

              try {
                const gltf = await loader.loadAsync(data.model_3d);
                const model = gltf.scene;

                // Add model to scene
                scene.add(model);

                // Position the model
                model.position.set(0, 0, -0.5);
                model.scale.set(0.1, 0.1, 0.1);

                // Hide loading screen
                document.querySelector('#loading-screen').style.display = 'none';

                // Start AR
                await mindarThree.start();

                // Set up cleanup
                window.arCleanup = async () => {
                  await mindarThree.stop();
                  renderer.dispose();
                };

              } catch (modelError) {
                throw new Error('Failed to load 3D model: ' + modelError.message);
              }

            } catch (error) {
              console.error('AR initialization error:', error);
              document.querySelector('#error-message').textContent = 
                error instanceof Error ? error.message : 'Failed to initialize AR';
              document.querySelector('#error-container').style.display = 'flex';
              document.querySelector('#loading-screen').style.display = 'none';
            }
          }

          // Start AR initialization
          document.querySelector('#loading-screen').style.display = 'flex';
          initAR();
        `}
      </Script>

      <div className="relative h-screen">
        <div id="ar-container" ref={containerRef} className="h-full w-full" />
        
        {/* Loading Screen */}
        <div id="loading-screen" className="hidden fixed inset-0 bg-black/80 items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Loading 3D Model</h3>
            <p id="loading-progress" className="text-sm text-primary">0%</p>
          </div>
        </div>

        {/* Error Display */}
        <div id="error-container" className="hidden fixed inset-0 bg-black/50 items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full m-4">
            <div className="text-center">
              <div className="text-lg text-red-600 mb-4" id="error-message"></div>
              <button
                onClick={handleStopTryOn}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Stop Button */}
        <button
          onClick={handleStopTryOn}
          className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Stop Try-On
        </button>
      </div>
    </>
  );
}
