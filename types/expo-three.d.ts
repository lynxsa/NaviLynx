declare module 'expo-three' {
  import { WebGLRenderer } from 'three';
  import { ExpoWebGLRenderingContext } from 'expo-gl';

  export class Renderer extends WebGLRenderer {
    constructor(options: { gl: ExpoWebGLRenderingContext; width?: number; height?: number; pixelRatio?: number });
  }

  export function loadTextureAsync(options: {
    asset: any;
  }): Promise<THREE.Texture>;

  export function loadAsync(
    resource: any,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ): Promise<any>;

  export function loadObjAsync(options: {
    asset: any;
  }): Promise<THREE.Group>;

  export function loadFileAsync(options: {
    asset: any;
  }): Promise<string>;
}
