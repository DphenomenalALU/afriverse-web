'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, ShoppingBag, Heart, Star, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import type { Database } from '@/lib/supabase/types';

declare global {
  interface MindARSystem {
    stop: () => void;
    stopProcessVideo: () => void;
  }

  interface AFrameElement extends HTMLElement {
    systems: {
      'mindar-face-system': MindARSystem;
    };
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

interface ProductData {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  brand: string;
  size: string;
  condition: string;
  location: string;
  seller_name: string;
  images?: string[];  // Update to match Supabase schema
  model_3d: string;
  created_at: string;
  profiles?: {
    rating?: number;
    name?: string;
  };
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  if (weeks > 0) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  return 'just now';
}

export default function TryOnPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('item');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, isItemSaved, removeFromCart } = useCart();
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isPermissionBlocked, setIsPermissionBlocked] = useState(false);

  // Function to check camera permission
  const checkCameraPermission = async () => {
    try {
      // First check if permissions API is supported
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        if (result.state === 'denied') {
          setIsPermissionBlocked(true);
          setHasCameraPermission(false);
          return;
        }
      }

      // Try to access the camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      // If we get here, permission was granted
      setHasCameraPermission(true);
      setIsPermissionBlocked(false);
      
      // Stop the video stream since we don't need it yet
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      console.error('Camera permission error:', error);
      // Check if permission is blocked by browser settings
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setIsPermissionBlocked(true);
      }
      setHasCameraPermission(false);
    }
  };

  // Function to request camera permission
  const requestCameraPermission = async () => {
    try {
      // Try to access the camera with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });

      // If we get here, permission was granted
      setHasCameraPermission(true);
      setIsPermissionBlocked(false);
      
      // Stop the stream since we don't need it yet
      stream.getTracks().forEach(track => track.stop());
      
      // Reload the page to reinitialize AR
      window.location.reload();
    } catch (error: any) {
      console.error('Failed to get camera permission:', error);
      
      // Check if permission is blocked by browser settings
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setIsPermissionBlocked(true);
        toast({
          title: "Camera Access Blocked",
          description: "Please enable camera access in your browser settings to use the AR try-on feature.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Camera Access Error",
          description: "There was an error accessing your camera. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Function to stop AR system
  const stopARSystem = () => {
    try {
      const sceneEl = document.querySelector('a-scene') as AFrameElement;
      if (!sceneEl) return Promise.resolve();

      const system = sceneEl?.systems?.['mindar-face-system'];
      if (system && system.stopProcessVideo) {
        console.log('Stopping AR system and camera');
        system.stopProcessVideo();
        
        // Also try to stop any active video streams
        const videoEl = document.querySelector('#mindar-face-video') as HTMLVideoElement;
        if (videoEl && videoEl.srcObject) {
          const stream = videoEl.srcObject as MediaStream;
          stream.getTracks().forEach(track => {
            track.stop();
            console.log('Stopped video track:', track.label);
          });
          videoEl.srcObject = null;
          videoEl.remove();
        }

        // Remove the scene to ensure complete cleanup
        sceneEl.remove();

        // Add a small delay to ensure the camera is fully stopped
        return new Promise<void>((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Error stopping AR system:', error);
    }
    return Promise.resolve();
  };

  // Function to handle navigation with camera cleanup
  const handleNavigation = async (path: string) => {
    try {
      setIsLoading(true); // Show loading state while cleaning up
      
      // Stop AR system and camera
      await stopARSystem();
      
      // Force cleanup of any remaining video tracks
      const tracks = await navigator.mediaDevices.getUserMedia({ video: true });
      tracks.getTracks().forEach(track => {
        track.stop();
        console.log('Forced stop of video track:', track.label);
      });

      // Use window.location for full page refresh to ensure complete cleanup
      window.location.href = path;
    } catch (error) {
      console.error('Error during navigation cleanup:', error);
      // Navigate anyway even if cleanup fails
      window.location.href = path;
    }
  };

  // Add a separate effect for handling beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopARSystem();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);

    // Check camera permission when component mounts
    checkCameraPermission();
    
    // Load product data
    const loadProduct = async () => {
      try {
        if (!productId) throw new Error('No product ID provided');
        
        const supabase = createClient();
        
        // Fetch product data with seller profile
        const { data: listing, error } = await supabase
          .from('listings')
          .select(`
            *,
            profiles:user_id (
              name,
              rating
            )
          `)
          .eq('id', productId)
          .single();

        if (error) throw error;
        if (!listing) throw new Error('Product not found');
        
        if (!listing.model_3d) {
          toast({
            title: "3D model not available",
            description: "This product doesn't have a 3D model for try-on.",
            variant: "destructive",
          });
          handleNavigation('/');
          return;
        }

        setProductData(listing);
        const saved = await isItemSaved(listing.id);
        setIsSaved(saved);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        setIsLoading(false);
        toast({
          title: "Error loading product",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };

    if (productId) {
      loadProduct();
    }
    
    // Only initialize MindAR if we have camera permission
    const initMindAR = () => {
      if (!hasCameraPermission) return;

      const button = document.querySelector("#productThumbnail");
      const entities = document.querySelectorAll(".product-model-entity");
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

      // Add event listeners for model loading
      const modelAsset = document.querySelector('#productModel');
      if (modelAsset) {
        modelAsset.addEventListener('loaded', () => {
          console.log('3D model loaded successfully');
          setModelLoaded(true);
        });
        
        modelAsset.addEventListener('error', (error) => {
          console.error('Error loading 3D model:', error);
          toast({
            title: "Error loading 3D model",
            description: "There was an error loading the 3D model. Please try again.",
            variant: "destructive",
          });
        });
      }
    };

    // Call initMindAR when the DOM is loaded and we have camera permission
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMindAR);
    } else {
      initMindAR();
    }

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', initMindAR);
      stopARSystem();
    };
  }, [productId, hasCameraPermission]);

  const handleStop = async () => {
    try {
      setIsLoading(true);
      await stopARSystem();
      window.location.href = '/';
    } catch (error) {
      console.error('Error during stop:', error);
      window.location.href = '/';
    }
  };

  const handleAddToCart = async () => {
    if (!productData) return;
    
    try {
      if (isSaved) {
        await removeFromCart(productData.id);
        setIsSaved(false);
        toast({
          title: "Removed from saved items",
          description: "Item has been removed from your saved items",
        });
      } else {
      await addToCart(productData);
        setIsSaved(true);
        toast({
          title: "Added to saved items",
          description: "Item has been added to your saved items",
        });
      }
    } catch (error) {
      console.error('Error toggling cart item:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Sign in required",
          description: "Please sign in to make purchases.",
        });
        await handleNavigation('/auth/login');
        return;
      }

      if (!productId) return;

      // Get listing details
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', productId)
        .single();

      if (listingError) throw listingError;

      // Check if user is trying to buy their own listing
      if (listing.user_id === session.user.id) {
        toast({
          title: "Cannot buy your own listing",
          description: "You cannot purchase items you've listed.",
          variant: "destructive",
        });
        return;
      }

      // Show loading state and stop camera before navigation
      setIsLoading(true);
      await handleNavigation(`/checkout?listing_id=${productId}`);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Don't render anything on the server side
  if (!isMounted || !productData) {
    return null;
  }

  // Show camera permission request if permission is denied
  if (hasCameraPermission === false) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Camera Access Required</h2>
          <p className="text-gray-600 mb-6">
            {isPermissionBlocked ? (
              <>
                Camera access is blocked. Please enable it in your browser settings:
                <ul className="mt-2 list-disc list-inside">
                  <li>Click the camera icon in your browser's address bar</li>
                  <li>Select "Allow" for this site</li>
                  <li>Refresh the page after enabling access</li>
                </ul>
              </>
            ) : (
              'To use the AR try-on feature, we need access to your camera. Please click the button below to enable camera access.'
            )}
          </p>
          <div className="flex flex-col gap-3">
            {!isPermissionBlocked && (
              <button
                onClick={requestCameraPermission}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Enable Camera
              </button>
            )}
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
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
        .stop-button {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        .stop-button:hover {
          background: white;
          transform: scale(1.05);
        }
        .stop-button:active {
          transform: scale(0.95);
        }
        .product-panel {
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          max-width: 400px;
          background: white;
          z-index: 9;
          overflow-y: auto;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        .product-panel.visible {
          transform: translateX(0);
        }
        @media (max-width: 768px) {
          .product-panel {
            top: auto;
            height: 70vh;
            width: 100%;
            max-width: none;
            transform: translateY(100%);
            border-radius: 20px 20px 0 0;
          }
          .product-panel.visible {
            transform: translateY(30%);
          }
          .stop-button {
            top: env(safe-area-inset-top, 1rem);
          }
        }
        a-scene {
          position: absolute;
          width: 100%;
          height: 100%;
        }
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
        <button className="stop-button" onClick={handleStop}>
          <X size={24} />
        </button>
        <div className="options-panel">
          <img 
            id="productThumbnail" 
            src={productData.images?.[0] || '/placeholder.jpg'}
            alt={productData.title}
          />
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
              id="productModel" 
              src={productData.model_3d}
              crossorigin="anonymous"
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
              scale="0.007 0.007 0.007" 
              src="#productModel" 
              class="product-model-entity" 
              visible="true"
            ></a-gltf-model>
        </a-entity>
      </a-scene>

        {/* Loading indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="text-center text-white">
              <div className="mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Loading Try-On</h3>
              <p className="text-sm text-green-500">Please allow camera access when prompted</p>
            </div>
          </div>
        )}

        {/* Product Information Panel */}
        <div className={`product-panel ${productData ? 'visible' : ''}`}>
              {productData && (
            <div>
              {/* Product Image */}
              <div className="relative w-full aspect-square mb-6">
                      <ImageWithFallback
                  src={productData.images?.[0] || '/placeholder.jpg'}
                        alt={productData.title}
                        width={400}
                        height={400}
                  className="w-full h-full object-cover"
                      />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-gray-900 text-sm px-3 py-1 rounded-full">
                        {productData.condition}
                  </span>
                </div>
                    </div>

              <div className="px-6 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{productData.title}</h1>
                  <p className="text-gray-600">
                      {productData.brand} • Size {productData.size}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-green-600">${productData.price}</span>
                      {productData.original_price && productData.original_price > productData.price && (
                    <>
                      <span className="text-gray-500 line-through">${productData.original_price}</span>
                      <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                        {Math.round((1 - productData.price / productData.original_price) * 100)}% off
                          </span>
                    </>
                      )}
                    </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{productData.profiles?.rating?.toFixed(1) || 'New'}</span>
                    </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {productData.location || 'Location not specified'}
          </div>
        </div>
        
                <div className="text-sm text-gray-500">
                  by {productData.profiles?.name || 'Anonymous'} • {productData.created_at && formatTimeAgo(new Date(productData.created_at))}
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                      isSaved 
                        ? 'bg-black text-white hover:bg-black/90'
                        : 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Saved' : 'Save for Later'}
                  </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
