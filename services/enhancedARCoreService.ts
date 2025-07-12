/**
 * Enhanced AR Core Service
 * Provides Google AR Core-like functionality with Unity-like interactivity
 * for advanced 3D navigation and object interaction
 */

import * as THREE from 'three';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer } from 'expo-three';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

export interface ARPlane {
  id: string;
  type: 'horizontal' | 'vertical';
  center: THREE.Vector3;
  extent: THREE.Vector2;
  normal: THREE.Vector3;
  mesh: THREE.Mesh;
  isTracked: boolean;
}

export interface ARObject {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  mesh: THREE.Mesh;
  type: 'waypoint' | 'poi' | 'information' | 'interaction';
  interactive: boolean;
  animations: THREE.AnimationMixer[];
}

export interface ARSession {
  isActive: boolean;
  trackingState: 'tracking' | 'limited' | 'stopped';
  planes: Map<string, ARPlane>;
  objects: Map<string, ARObject>;
  lightEstimate: number;
  environmentMap?: THREE.CubeTexture;
}

export interface ARInteraction {
  type: 'tap' | 'pinch' | 'pan' | 'rotate';
  position: THREE.Vector2;
  object?: ARObject;
  force?: number;
}

class EnhancedARCoreService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: Renderer | null = null;
  private gl: ExpoWebGLRenderingContext | null = null;
  
  private session: ARSession = {
    isActive: false,
    trackingState: 'stopped',
    planes: new Map(),
    objects: new Map(),
    lightEstimate: 1.0
  };

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private clock = new THREE.Clock();
  
  private planeDetectionEnabled = true;
  private lightEstimationEnabled = true;
  private occlusionEnabled = true;
  
  private deviceMotion: DeviceMotionMeasurement | null = null;
  private motionSubscription: any = null;

  // Unity-like interaction system
  private interactionCallbacks: Map<string, (interaction: ARInteraction) => void> = new Map();
  
  // Advanced tracking
  private trackingHistory: THREE.Vector3[] = [];
  private velocitySmoothing = 0.8;
  private rotationSmoothing = 0.9;

  /**
   * Initialize AR Core session
   */
  async initializeARSession(gl: ExpoWebGLRenderingContext): Promise<boolean> {
    try {
      this.gl = gl;
      
      // Initialize Three.js scene
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
      this.renderer = new Renderer({ gl });
      
      // Set up environment mapping
      await this.setupEnvironmentMapping();
      
      // Initialize plane detection
      this.initializePlaneDetection();
      
      // Start device motion tracking
      await this.startMotionTracking();
      
      // Initialize lighting system
      this.setupAdvancedLighting();
      
      this.session.isActive = true;
      this.session.trackingState = 'tracking';
      
      console.log('Enhanced AR Core session initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize AR session:', error);
      return false;
    }
  }

  /**
   * Update AR session - call this in render loop
   */
  updateSession(): void {
    if (!this.session.isActive || !this.scene || !this.camera || !this.renderer) {
      return;
    }

    const deltaTime = this.clock.getDelta();
    
    // Update device motion
    this.updateDeviceMotion();
    
    // Update plane detection
    this.updatePlaneDetection();
    
    // Update light estimation
    this.updateLightEstimation();
    
    // Update object animations
    this.updateObjectAnimations(deltaTime);
    
    // Update occlusion
    this.updateOcclusion();
    
    // Render frame
    if (this.gl) {
      this.renderer.render(this.scene, this.camera);
      this.gl.endFrameEXP();
    }
  }

  /**
   * Add interactive AR object to the scene
   */
  addARObject(config: {
    id: string;
    position: THREE.Vector3;
    model?: THREE.Mesh;
    type: ARObject['type'];
    interactive?: boolean;
    animations?: THREE.AnimationClip[];
  }): ARObject {
    
    const object: ARObject = {
      id: config.id,
      position: config.position.clone(),
      rotation: new THREE.Euler(),
      scale: new THREE.Vector3(1, 1, 1),
      mesh: config.model || this.createDefaultMesh(config.type),
      type: config.type,
      interactive: config.interactive ?? true,
      animations: []
    };

    // Position the mesh
    object.mesh.position.copy(object.position);
    object.mesh.userData = { arObject: object };
    
    // Add interaction handling
    if (object.interactive) {
      this.setupObjectInteraction(object);
    }
    
    // Set up animations
    if (config.animations && config.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(object.mesh);
      config.animations.forEach(clip => {
        const action = mixer.clipAction(clip);
        action.play();
      });
      object.animations.push(mixer);
    }
    
    // Add to scene and session
    if (this.scene) {
      this.scene.add(object.mesh);
    }
    this.session.objects.set(config.id, object);
    
    return object;
  }

  /**
   * Detect surfaces and create AR planes
   */
  private async initializePlaneDetection(): Promise<void> {
    if (!this.planeDetectionEnabled) return;
    
    // Simulate plane detection (in real AR, this would use device sensors)
    setTimeout(() => {
      this.createMockPlanes();
    }, 2000);
  }

  private createMockPlanes(): void {
    // Create a horizontal floor plane
    const floorPlane: ARPlane = {
      id: 'floor-plane-1',
      type: 'horizontal',
      center: new THREE.Vector3(0, -1.5, 0),
      extent: new THREE.Vector2(10, 10),
      normal: new THREE.Vector3(0, 1, 0),
      mesh: this.createPlaneMesh('horizontal'),
      isTracked: true
    };
    
    floorPlane.mesh.position.copy(floorPlane.center);
    if (this.scene) {
      this.scene.add(floorPlane.mesh);
    }
    this.session.planes.set(floorPlane.id, floorPlane);
    
    // Create vertical wall planes
    const wallPlane: ARPlane = {
      id: 'wall-plane-1',
      type: 'vertical',
      center: new THREE.Vector3(0, 0, -3),
      extent: new THREE.Vector2(6, 3),
      normal: new THREE.Vector3(0, 0, 1),
      mesh: this.createPlaneMesh('vertical'),
      isTracked: true
    };
    
    wallPlane.mesh.position.copy(wallPlane.center);
    wallPlane.mesh.rotation.x = Math.PI / 2;
    if (this.scene) {
      this.scene.add(wallPlane.mesh);
    }
    this.session.planes.set(wallPlane.id, wallPlane);
  }

  private createPlaneMesh(type: 'horizontal' | 'vertical'): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(
      type === 'horizontal' ? 10 : 6,
      type === 'horizontal' ? 10 : 3
    );
    
    const material = new THREE.MeshBasicMaterial({
      color: type === 'horizontal' ? 0x00ff00 : 0x0000ff,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    
    return new THREE.Mesh(geometry, material);
  }

  /**
   * Advanced lighting system with real-time estimation
   */
  private setupAdvancedLighting(): void {
    if (!this.scene) return;
    
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    // Directional light for primary illumination
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    // Point lights for dynamic lighting
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 10);
    pointLight.position.set(0, 2, 0);
    this.scene.add(pointLight);
    
    // Enable shadows
    if (this.renderer) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }

  private updateLightEstimation(): void {
    if (!this.lightEstimationEnabled) return;
    
    // Simulate light estimation changes
    const currentTime = Date.now();
    const lightVariation = Math.sin(currentTime * 0.001) * 0.3 + 0.7;
    this.session.lightEstimate = lightVariation;
    
    // Update scene lighting based on estimation
    if (this.scene) {
      const ambientLight = this.scene.children.find(child => 
        child instanceof THREE.AmbientLight
      ) as THREE.AmbientLight;
      
      if (ambientLight) {
        ambientLight.intensity = this.session.lightEstimate * 0.4;
      }
    }
  }

  /**
   * Unity-like object interaction system
   */
  private setupObjectInteraction(object: ARObject): void {
    object.mesh.userData.interactive = true;
    
    // Add hover effects
    const originalScale = object.scale.clone();
    const hoverScale = originalScale.clone().multiplyScalar(1.1);
    
    object.mesh.userData.onHover = () => {
      if (object.mesh.scale) {
        object.mesh.scale.lerp(hoverScale, 0.1);
      }
    };
    
    object.mesh.userData.onHoverExit = () => {
      if (object.mesh.scale) {
        object.mesh.scale.lerp(originalScale, 0.1);
      }
    };
  }

  /**
   * Handle touch interactions with AR objects
   */
  handleInteraction(interaction: ARInteraction): void {
    if (!this.scene || !this.camera) return;
    
    this.mouse.x = (interaction.position.x * 2) - 1;
    this.mouse.y = -(interaction.position.y * 2) + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const interactiveObjects = this.scene.children.filter(child => 
      child.userData.interactive
    );
    
    const intersects = this.raycaster.intersectObjects(interactiveObjects);
    
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const object = intersect.object.userData.arObject as ARObject;
      
      if (object) {
        const callback = this.interactionCallbacks.get(object.id);
        if (callback) {
          callback({
            ...interaction,
            object
          });
        }
        
        // Trigger object-specific interactions
        this.triggerObjectInteraction(object, interaction);
      }
    }
  }

  private triggerObjectInteraction(object: ARObject, interaction: ARInteraction): void {
    switch (interaction.type) {
      case 'tap':
        this.animateObjectTap(object);
        break;
      case 'pinch':
        this.handleObjectScale(object, interaction.force || 1);
        break;
      case 'rotate':
        this.handleObjectRotation(object, interaction.position);
        break;
    }
  }

  private animateObjectTap(object: ARObject): void {
    // Create tap animation
    const originalScale = object.mesh.scale.clone();
    const targetScale = originalScale.clone().multiplyScalar(0.8);
    
    // Check if requestAnimationFrame is available
    const hasRequestAnimationFrame = typeof requestAnimationFrame !== 'undefined';
    
    // Scale down
    const scaleDown = () => {
      object.mesh.scale.lerp(targetScale, 0.3);
      if (object.mesh.scale.distanceTo(targetScale) > 0.01) {
        if (hasRequestAnimationFrame) {
          requestAnimationFrame(scaleDown);
        } else {
          setTimeout(scaleDown, 16);
        }
      } else {
        // Scale back up
        const scaleUp = () => {
          object.mesh.scale.lerp(originalScale, 0.3);
          if (object.mesh.scale.distanceTo(originalScale) > 0.01) {
            if (hasRequestAnimationFrame) {
              requestAnimationFrame(scaleUp);
            } else {
              setTimeout(scaleUp, 16);
            }
          }
        };
        if (hasRequestAnimationFrame) {
          requestAnimationFrame(scaleUp);
        } else {
          setTimeout(scaleUp, 16);
        }
      }
    };
    if (hasRequestAnimationFrame) {
      requestAnimationFrame(scaleDown);
    } else {
      setTimeout(scaleDown, 16);
    }
  }

  /**
   * Advanced motion tracking with smoothing
   */
  private async startMotionTracking(): Promise<void> {
    try {
      this.motionSubscription = DeviceMotion.addListener((data) => {
        this.deviceMotion = data;
      });
      
      DeviceMotion.setUpdateInterval(16); // 60 FPS
    } catch (error) {
      console.error('Failed to start motion tracking:', error);
    }
  }

  private updateDeviceMotion(): void {
    if (!this.deviceMotion || !this.camera) return;
    
    const { rotation } = this.deviceMotion;
    if (!rotation) return;
    
    const { alpha, beta, gamma } = rotation;
    if (alpha == null || beta == null || gamma == null) return;
    
    // Apply smoothing to reduce jitter
    const targetRotationX = THREE.MathUtils.degToRad(beta * 0.5);
    const targetRotationY = THREE.MathUtils.degToRad(gamma * 0.5);
    const targetRotationZ = THREE.MathUtils.degToRad(alpha * 0.1);
    
    this.camera.rotation.x = THREE.MathUtils.lerp(
      this.camera.rotation.x,
      targetRotationX,
      1 - this.rotationSmoothing
    );
    
    this.camera.rotation.y = THREE.MathUtils.lerp(
      this.camera.rotation.y,
      targetRotationY,
      1 - this.rotationSmoothing
    );
    
    this.camera.rotation.z = THREE.MathUtils.lerp(
      this.camera.rotation.z,
      targetRotationZ,
      1 - this.rotationSmoothing
    );
  }

  /**
   * Environment mapping for realistic reflections
   */
  private async setupEnvironmentMapping(): Promise<void> {
    if (!this.scene) return;
    
    // Create environment map
    const loader = new THREE.CubeTextureLoader();
    // Use loader to create a placeholder cube texture for demonstration
    const placeholderTexture = loader.load([
      '', '', '', '', '', ''
    ]);
    if (this.scene && placeholderTexture) {
      this.scene.background = placeholderTexture;
    }
    // In production, load actual environment textures
    // For now, create a simple gradient environment
    this.createSimpleEnvironment();
  }

  private createSimpleEnvironment(): void {
    if (!this.scene) return;
    
    // Create a simple gradient background
    const geometry = new THREE.SphereGeometry(500, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.3
    });
    
    const skybox = new THREE.Mesh(geometry, material);
    this.scene.add(skybox);
  }

  /**
   * Update object animations
   */
  private updateObjectAnimations(deltaTime: number): void {
    this.session.objects.forEach(object => {
      object.animations.forEach(mixer => {
        mixer.update(deltaTime);
      });
    });
  }

  /**
   * Advanced occlusion handling
   */
  private updateOcclusion(): void {
    if (!this.occlusionEnabled || !this.scene || !this.camera) return;
    
    // Implement depth-based occlusion
    this.session.objects.forEach(object => {
      const distance = this.camera!.position.distanceTo(object.position);
      
      // Fade objects based on distance
      if (object.mesh.material && 'opacity' in object.mesh.material) {
        const targetOpacity = distance > 10 ? 0.5 : 1.0;
        (object.mesh.material as any).opacity = THREE.MathUtils.lerp(
          (object.mesh.material as any).opacity || 1,
          targetOpacity,
          0.1
        );
      }
    });
  }

  /**
   * Create default mesh for different object types
   */
  private createDefaultMesh(type: ARObject['type']): THREE.Mesh {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;
    
    switch (type) {
      case 'waypoint':
        geometry = new THREE.ConeGeometry(0.1, 0.3, 8);
        material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        break;
      case 'poi':
        geometry = new THREE.SphereGeometry(0.15, 16, 16);
        material = new THREE.MeshPhongMaterial({ color: 0x0066ff });
        break;
      case 'information':
        geometry = new THREE.BoxGeometry(0.2, 0.2, 0.05);
        material = new THREE.MeshPhongMaterial({ color: 0xffaa00 });
        break;
      case 'interaction':
        geometry = new THREE.OctahedronGeometry(0.12);
        material = new THREE.MeshPhongMaterial({ color: 0xff0066 });
        break;
      default:
        geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  }

  /**
   * Register interaction callback for an object
   */
  registerInteractionCallback(objectId: string, callback: (interaction: ARInteraction) => void): void {
    this.interactionCallbacks.set(objectId, callback);
  }

  /**
   * Clean up AR session
   */
  dispose(): void {
    this.session.isActive = false;
    this.session.trackingState = 'stopped';
    
    if (this.motionSubscription) {
      this.motionSubscription.remove();
      this.motionSubscription = null;
    }
    
    // Dispose Three.js resources
    this.session.objects.forEach(object => {
      object.mesh.geometry.dispose();
      if (Array.isArray(object.mesh.material)) {
        object.mesh.material.forEach(material => material.dispose());
      } else {
        object.mesh.material.dispose();
      }
    });
    
    this.session.planes.forEach(plane => {
      plane.mesh.geometry.dispose();
      if (Array.isArray(plane.mesh.material)) {
        plane.mesh.material.forEach(material => material.dispose());
      } else {
        plane.mesh.material.dispose();
      }
    });
    
    this.session.objects.clear();
    this.session.planes.clear();
    this.interactionCallbacks.clear();
  }

  // Getters
  get isSessionActive(): boolean {
    return this.session.isActive;
  }
  
  get trackingState(): string {
    return this.session.trackingState;
  }
  
  get detectedPlanes(): ARPlane[] {
    return Array.from(this.session.planes.values());
  }
  
  get arObjects(): ARObject[] {
    return Array.from(this.session.objects.values());
  }
  
  get lightEstimate(): number {
    return this.session.lightEstimate;
  }

  // Handle different object interactions
  private handleObjectScale(object: ARObject, force: number): void {
    const scaleMultiplier = 1 + (force - 1) * 0.5;
    object.mesh.scale.multiplyScalar(scaleMultiplier);
  }

  private handleObjectRotation(object: ARObject, position: THREE.Vector2): void {
    const rotationSpeed = 0.01;
    object.mesh.rotation.y += position.x * rotationSpeed;
    object.mesh.rotation.x += position.y * rotationSpeed;
  }

  private updatePlaneDetection(): void {
    // Update plane tracking status and accuracy
    this.session.planes.forEach(plane => {
      // Simulate tracking quality
      plane.isTracked = Math.random() > 0.1; // 90% tracking success
    });
  }
}

export const enhancedARCoreService = new EnhancedARCoreService();
