declare module 'gl-react-expo' {
  import { Component } from 'react';
  import { SurfaceProps } from 'gl-react';

  export interface GLViewProps extends SurfaceProps {
    onContextCreate?: (gl: WebGLRenderingContext) => void;
    msaaSamples?: number;
  }

  export class Surface extends Component<GLViewProps> {}
}
