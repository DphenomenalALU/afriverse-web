'use client';

import { useEffect, useState } from 'react';

declare global {
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Initialize MindAR functionality
    const initMindAR = () => {
      const button = document.querySelector("#glasses1");
      const entities = document.querySelectorAll(".glasses1-entity");
      let isVisible = true;

      const setVisible = (button: HTMLElement, entities: NodeListOf<Element>, visible: boolean) => {
        if (visible) {
          button.classList.add("selected");
        } else {
          button.classList.remove("selected");
        }
        entities.forEach((entity) => {
          entity.setAttribute("visible", visible.toString());
        });
      }

      if (button && entities) {
        setVisible(button as HTMLElement, entities, isVisible);
        button.addEventListener('click', () => {
          isVisible = !isVisible;
          setVisible(button as HTMLElement, entities, isVisible);
        });
      }

      // Add event listeners for scene
      const sceneEl = document.querySelector('a-scene');
      if (sceneEl) {
        // Log when scene is loaded
        sceneEl.addEventListener('loaded', () => {
          console.log('Scene loaded');
        });

        // Log when camera stream starts
        sceneEl.addEventListener('arReady', () => {
          console.log('AR ready');
        });

        // Log any errors
        sceneEl.addEventListener('arError', (error: any) => {
          console.error('AR error:', error);
        });
      }
    };

    // Call initMindAR when the DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMindAR);
    } else {
      initMindAR();
    }

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', initMindAR);
    };
  }, []);

  // Don't render anything on the server side
  if (!isMounted) {
    return null;
  }

  return (
    <div className="try-on-container">
      <style jsx global>{`
        .try-on-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          margin: 0;
          overflow: hidden;
        }
        .example-container {
          overflow: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .options-panel {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 2;
        }
        .options-panel img {
          border: solid 2px;
          width: 50px;
          height: 50px;
          object-fit: cover;
          cursor: pointer;
        }
        .options-panel img.selected {
          border-color: green;
        }
        a-scene {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        /* Ensure video feed is visible */
        #mindar-face-video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          z-index: -1 !important;
        }
      `}</style>

      <div className="example-container">
        <div className="options-panel">
          <img id="glasses1" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses/thumbnail.png"/>
        </div>
        <a-scene 
          mindar-face="maxDetectedFaces: 1"
          embedded="true"
          color-space="sRGB" 
          renderer="colorManagement: true, physicallyCorrectLights" 
          vr-mode-ui="enabled: false" 
          device-orientation-permission-ui="enabled: false"
        >
          <a-assets>
            <a-asset-item 
              id="headModel" 
              src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/sparkar/headOccluder.glb"
            ></a-asset-item>
            <a-asset-item 
              id="glassesModel" 
              src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses/scene.gltf"
            ></a-asset-item>
          </a-assets>

          <a-camera active="false" position="0 0 0"></a-camera>

          {/* head occluder */}
          <a-entity mindar-face-target="anchorIndex: 168">
            <a-gltf-model 
              mindar-face-occluder 
              position="0 -0.3 0.15" 
              rotation="0 0 0" 
              scale="0.065 0.065 0.065" 
              src="#headModel"
            ></a-gltf-model>
          </a-entity>

          <a-entity mindar-face-target="anchorIndex: 168">
            <a-gltf-model 
              rotation="0 -0 0" 
              position="0 0 0" 
              scale="0.01 0.01 0.01" 
              src="#glassesModel" 
              class="glasses1-entity" 
              visible="true"
            ></a-gltf-model>
          </a-entity>
        </a-scene>
      </div>
    </div>
  );
}
