import React, { useEffect, useState } from 'react';
import { Surface } from 'gl-react-expo';
import { Shaders, Node, GLSL } from 'gl-react';
import { Dimensions } from 'react-native';

const shaders = Shaders.create({
  powerSurge: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform float time;

void main() {
  vec4 color = texture2D(t, uv);
  
  // Pulsazione temporale
  float pulse = sin(time * 4.0) * 0.5 + 0.5;
  
  // Distorsione radiale dal centro
  vec2 center = vec2(0.5, 0.5);
  vec2 pos = uv - center;
  float dist = length(pos);
  
  // Effetto zoom pulsante
  vec2 newUV = center + pos * (1.0 - pulse * 0.2);
  vec4 distorted = texture2D(t, newUV);
  
  // Flash di energia
  float flash = pow(1.0 - dist, 2.0) * pulse;
  
  // Colori power surge (rosso/arancio/giallo)
  vec3 powerColor = vec3(1.0, 0.5, 0.0) * flash;
  
  // Sovraesposizione estrema
  vec3 final = distorted.rgb + powerColor;
  final = pow(final, vec3(0.8)); // Aumenta luminosità
  
  // Saturazione estrema
  float gray = dot(final, vec3(0.299, 0.587, 0.114));
  final = mix(vec3(gray), final, 1.5 + pulse);
  
  gl_FragColor = vec4(final, color.a);
}
`
  }
});

interface PowerSurgeEffectProps {
  children: any;
  isActive: boolean;
  width?: number;
  height?: number;
}

export const PowerSurgeEffect: React.FC<PowerSurgeEffectProps> = ({ 
  children, 
  isActive,
  width = Dimensions.get('window').width,
  height = Dimensions.get('window').height
}) => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    if (!isActive) {
      setTime(0);
      return;
    }
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTime((Date.now() - startTime) / 1000);
    }, 16); // 60fps
    
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) {
    return children;
  }

  return (
    <Surface width={width} height={height}>
      <Node
        shader={shaders.powerSurge}
        uniforms={{
          t: children,
          time: time
        }}
      />
    </Surface>
  );
};
