declare module 'gl-react' {
  import { Component, ReactNode } from 'react';

  export interface SurfaceProps {
    width: number;
    height: number;
    children?: ReactNode;
    style?: any;
  }

  export interface NodeProps {
    shader: {
      frag: string;
      vert?: string;
    };
    uniforms?: any;
    children?: ReactNode;
    width?: number;
    height?: number;
  }

  export interface ShadersObject {
    [key: string]: {
      frag: string;
      vert?: string;
    };
  }

  export class Surface extends Component<SurfaceProps> {}
  export class Node extends Component<NodeProps> {}
  
  export const Shaders: {
    create: (shaders: ShadersObject) => any;
  };

  export const GLSL: (strings: TemplateStringsArray, ...values: any[]) => string;
}
