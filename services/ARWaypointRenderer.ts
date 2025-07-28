/**
 * Enhanced AR 3D Waypoint System
 * Advanced 3D waypoint rendering with animations and visual enhancements
 * Optimized for performance and user experience
 */

import * as THREE from 'three';
import ARPerformanceManager from './ARPerformanceManager';

export interface ARWaypoint {
  id: string;
  position: THREE.Vector3;
  type: 'destination' | 'checkpoint' | 'turn' | 'poi' | 'shop' | 'exit';
  title: string;
  description?: string;
  distance?: number;
  icon?: string;
  color?: string;
  isActive?: boolean;
  metadata?: any;
}

export interface ARWaypointStyle {
  scale: number;
  color: string;
  emissiveColor: string;
  opacity: number;
  pulseSpeed: number;
  glowIntensity: number;
}

export class ARWaypointRenderer {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private performanceManager: ARPerformanceManager;
  private waypoints: Map<string, THREE.Object3D> = new Map();
  private animationFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();

  // Waypoint styles for different types
  private waypointStyles: Map<string, ARWaypointStyle> = new Map([
    ['destination', {
      scale: 1.5,
      color: '#FF4081',
      emissiveColor: '#FF4081',
      opacity: 0.9,
      pulseSpeed: 2.0,
      glowIntensity: 0.8
    }],
    ['checkpoint', {
      scale: 1.0,
      color: '#2196F3',
      emissiveColor: '#2196F3',
      opacity: 0.8,
      pulseSpeed: 1.5,
      glowIntensity: 0.6
    }],
    ['turn', {
      scale: 0.8,
      color: '#FFC107',
      emissiveColor: '#FFC107',
      opacity: 0.7,
      pulseSpeed: 1.0,
      glowIntensity: 0.4
    }],
    ['poi', {
      scale: 0.6,
      color: '#4CAF50',
      emissiveColor: '#4CAF50',
      opacity: 0.6,
      pulseSpeed: 0.8,
      glowIntensity: 0.3
    }],
    ['shop', {
      scale: 1.2,
      color: '#9C27B0',
      emissiveColor: '#9C27B0',
      opacity: 0.8,
      pulseSpeed: 1.2,
      glowIntensity: 0.5
    }],
    ['exit', {
      scale: 1.0,
      color: '#F44336',
      emissiveColor: '#F44336',
      opacity: 0.7,
      pulseSpeed: 1.0,
      glowIntensity: 0.4
    }]
  ]);

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.performanceManager = ARPerformanceManager.getInstance();
    this.startAnimation();
  }

  public addWaypoint(waypoint: ARWaypoint): void {
    const waypointObject = this.createWaypointObject(waypoint);
    this.waypoints.set(waypoint.id, waypointObject);
    this.scene.add(waypointObject);
  }

  public removeWaypoint(waypointId: string): void {
    const waypointObject = this.waypoints.get(waypointId);
    if (waypointObject) {
      this.scene.remove(waypointObject);
      this.disposeWaypointObject(waypointObject);
      this.waypoints.delete(waypointId);
    }
  }

  public updateWaypoint(waypoint: ARWaypoint): void {
    this.removeWaypoint(waypoint.id);
    this.addWaypoint(waypoint);
  }

  public clearAllWaypoints(): void {
    this.waypoints.forEach((waypointObject, id) => {
      this.scene.remove(waypointObject);
      this.disposeWaypointObject(waypointObject);
    });
    this.waypoints.clear();
  }

  private createWaypointObject(waypoint: ARWaypoint): THREE.Object3D {
    const group = new THREE.Group();
    const style = this.waypointStyles.get(waypoint.type) || this.waypointStyles.get('checkpoint')!;

    // Create main waypoint geometry
    const geometry = this.getOrCreateGeometry('waypoint_' + waypoint.type);
    const material = this.createWaypointMaterial(style, waypoint);
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(style.scale);
    mesh.position.copy(waypoint.position);
    
    // Add glow effect
    const glowGeometry = this.getOrCreateGeometry('waypoint_glow');
    const glowMaterial = this.createGlowMaterial(style);
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.scale.setScalar(style.scale * 1.5);
    
    // Add text label if needed
    if (waypoint.title) {
      const textSprite = this.createTextSprite(waypoint.title, style.color);
      textSprite.position.set(0, style.scale * 2, 0);
      group.add(textSprite);
    }

    // Add distance indicator if provided
    if (waypoint.distance !== undefined) {
      const distanceSprite = this.createTextSprite(
        `${waypoint.distance.toFixed(0)}m`,
        style.color,
        0.5
      );
      distanceSprite.position.set(0, -style.scale * 1.5, 0);
      group.add(distanceSprite);
    }

    group.add(glowMesh);
    group.add(mesh);
    
    // Store references for animation
    (group as any).mainMesh = mesh;
    (group as any).glowMesh = glowMesh;
    (group as any).style = style;
    (group as any).waypointData = waypoint;

    return group;
  }

  private getOrCreateGeometry(key: string): THREE.BufferGeometry {
    let geometry = this.performanceManager.getCachedGeometry(key);
    
    if (!geometry) {
      if (key.includes('glow')) {
        geometry = new THREE.SphereGeometry(1, 16, 16);
      } else {
        // Create a diamond/beacon shape
        geometry = new THREE.ConeGeometry(0.5, 2, 8);
      }
      this.performanceManager.setCachedGeometry(key, geometry);
    }
    
    return geometry;
  }

  private createWaypointMaterial(style: ARWaypointStyle, waypoint: ARWaypoint): THREE.Material {
    const materialKey = `waypoint_${waypoint.type}_${style.color}`;
    let material = this.performanceManager.getCachedMaterial(materialKey);
    
    if (!material) {
      material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(style.color),
        emissive: new THREE.Color(style.emissiveColor),
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: style.opacity,
        depthWrite: false
      });
      this.performanceManager.setCachedMaterial(materialKey, material);
    }
    
    return material.clone();
  }

  private createGlowMaterial(style: ARWaypointStyle): THREE.Material {
    const materialKey = `glow_${style.color}`;
    let material = this.performanceManager.getCachedMaterial(materialKey);
    
    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(style.color),
        transparent: true,
        opacity: style.glowIntensity * 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      this.performanceManager.setCachedMaterial(materialKey, material);
    }
    
    return material.clone();
  }

  private createTextSprite(text: string, color: string, scale: number = 1): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = color;
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 8);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      alphaTest: 0.1
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2 * scale, 0.5 * scale, 1);
    
    return sprite;
  }

  private disposeWaypointObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
        if (child.material instanceof Array) {
          child.material.forEach(material => material.dispose());
        }
      }
      if (child instanceof THREE.Sprite && child.material) {
        if (child.material.map) {
          child.material.map.dispose();
        }
        child.material.dispose();
      }
    });
  }

  private startAnimation(): void {
    const animate = () => {
      this.performanceManager.startFrame();
      
      const elapsedTime = this.clock.getElapsedTime();
      
      // Animate waypoints
      this.waypoints.forEach((waypointObject) => {
        const mainMesh = (waypointObject as any).mainMesh;
        const glowMesh = (waypointObject as any).glowMesh;
        const style = (waypointObject as any).style;
        const waypointData = (waypointObject as any).waypointData;
        
        if (mainMesh && glowMesh && style) {
          // Pulsing animation
          const pulseScale = 1 + Math.sin(elapsedTime * style.pulseSpeed) * 0.1;
          mainMesh.scale.setScalar(style.scale * pulseScale);
          
          // Glow animation
          const glowScale = 1 + Math.sin(elapsedTime * style.pulseSpeed * 0.8) * 0.2;
          glowMesh.scale.setScalar(style.scale * 1.5 * glowScale);
          
          // Rotation for active waypoints
          if (waypointData.isActive) {
            mainMesh.rotation.y += 0.02;
          }
          
          // Distance-based scaling
          if (this.camera) {
            const distance = waypointObject.position.distanceTo(this.camera.position);
            const scaleFactor = Math.max(0.5, Math.min(2, 10 / distance));
            waypointObject.scale.setScalar(scaleFactor);
          }
        }
      });
      
      this.performanceManager.endFrame();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }

  public dispose(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    this.clearAllWaypoints();
    this.clock = new THREE.Clock();
  }

  public setWaypointStyle(type: string, style: ARWaypointStyle): void {
    this.waypointStyles.set(type, style);
  }

  public getWaypointStyle(type: string): ARWaypointStyle | undefined {
    return this.waypointStyles.get(type);
  }
}

export default ARWaypointRenderer;
