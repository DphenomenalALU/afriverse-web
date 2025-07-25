'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/types';

declare global {
  interface Window {
    arCleanup?: () => void;
  }
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-asset-item': any;
      'a-camera': any;
      'a-entity': any;
      'a-gltf-model': any;
    }
  }
}

export default function TryOnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('item');
  const supabase = createClientComponentClient<Database>();
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load product data and update model source
    const loadProduct = async () => {
      try {
        console.log('Loading product with ID:', productId);
        const response = await fetch('/api/listings/' + productId);
        const data = await response.json();
        
        console.log('API Response:', data);
        console.log('3D Model URL:', data.model_3d);
        
        if (!data.model_3d) {
          throw new Error('3D model not available');
        }

        setModelUrl(data.model_3d);

      } catch (error) {
        console.error('AR initialization error:', error);
        const errorMessage = document.querySelector('#error-message');
        const errorContainer = document.querySelector('#error-container') as HTMLElement;
        const loadingScreen = document.querySelector('#loading-screen') as HTMLElement;
        
        if (errorMessage) {
          const errorText = error instanceof Error ? error.message : 'Failed to initialize AR';
          console.error('Setting error message:', errorText);
          errorMessage.textContent = errorText;
        }
        if (errorContainer) {
          errorContainer.style.display = 'flex';
        }
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
      }
    };

    if (productId) {
      loadProduct();
    } else {
      console.error('No product ID provided');
    }

    return () => {
      const scene = document.querySelector('a-scene');
      if (scene) {
        scene.remove();
      }
    };
  }, [productId]);

  useEffect(() => {
    if (!modelUrl) return;

    const setupScene = () => {
      const scene = document.querySelector('a-scene');
      if (!scene) {
        console.error('Scene not found');
        return;
      }

      // Wait for scene to load
      scene.addEventListener('loaded', () => {
        console.log('Scene loaded');
        
        // Now we can safely access assets
        const modelAsset = document.querySelector('#productModel');
        if (modelAsset) {
          console.log('Setting model URL to:', modelUrl);
          modelAsset.setAttribute('src', modelUrl);
          
          modelAsset.addEventListener('loaded', () => {
            console.log('Model loaded successfully');
            const loadingScreen = document.querySelector('#loading-screen') as HTMLElement;
            if (loadingScreen) {
              loadingScreen.style.display = 'none';
            }
          });
          
          modelAsset.addEventListener('error', (error) => {
            console.error('Error loading model:', error);
          });
        } else {
          console.error('Model asset element not found after scene load');
        }
      });
    };

    // Give A-Frame a moment to initialize
    setTimeout(setupScene, 100);
  }, [modelUrl]);

  const handleStopTryOn = () => {
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.remove();
    }
    router.back();
  };

  return (
    <>
      <Head>
        <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-face-aframe.prod.js"></script>
      </Head>

      <div className="relative h-screen">
        <div className="example-container">
          <a-scene
            mindar-face
            embedded
            color-space="sRGB"
            renderer="colorManagement: true; physicallyCorrectLights: true"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
          >
            <a-assets>
              <a-asset-item 
                id="headOccluder" 
                src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/sparkar/headOccluder.glb"
              ></a-asset-item>
              <a-asset-item 
                id="productModel"
                crossorigin="anonymous"
              ></a-asset-item>
            </a-assets>

            <a-camera active="false" position="0 0 0"></a-camera>

            {/* Head occluder for realistic rendering */}
            <a-entity mindar-face-target="anchorIndex: 168">
              <a-gltf-model
                mindar-face-occluder
                position="0 -0.3 0.15"
                rotation="0 0 0"
                scale="0.065 0.065 0.065"
                src="#headOccluder"
              ></a-gltf-model>
            </a-entity>

            {/* Product model - adjust position/scale based on product type */}
            <a-entity mindar-face-target="anchorIndex: 168">
              <a-gltf-model
                rotation="0 -0 0"
                position="0 0 0"
                scale="0.01 0.01 0.01"
                src="#productModel"
              ></a-gltf-model>
            </a-entity>
          </a-scene>
        </div>
        
        {/* Loading Screen */}
        <div id="loading-screen" className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Loading AR Experience</h3>
            <p className="text-sm text-primary">Please allow camera access when prompted</p>
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
          className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 z-50"
        >
          Stop Try-On
        </button>
      </div>

      <style jsx>{`
        .example-container {
          overflow: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
}
