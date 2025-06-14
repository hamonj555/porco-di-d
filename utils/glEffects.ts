import { Shaders } from 'gl-react';

// Explosion Behind - Effetto esplosione dietro soggetto
export const ExplosionBehind = Shaders.create({
  explosionBehind: {
    frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform float time;
uniform float intensity;

void main() {
  vec4 color = texture2D(t, uv);
  
  // Centro esplosione (dietro soggetto centrale)
  vec2 center = vec2(0.5, 0.6);
  float dist = distance(uv, center);
  
  // Onda esplosiva
  float wave = sin(dist * 10.0 - time * 8.0) * 0.5 + 0.5;
  float explosion = smoothstep(0.0, 0.6, 1.0 - dist) * wave * intensity;
  
  // Colori fuoco (rosso/arancione/giallo)
  vec3 fireColor = mix(
    vec3(1.0, 0.0, 0.0),  // rosso
    vec3(1.0, 0.8, 0.0),  // giallo
    explosion
  );
  
  // Flash luminoso
  float flash = exp(-time * 2.0) * intensity;
  
  // Combina effetti
  color.rgb = mix(color.rgb, fireColor, explosion * 0.7);
  color.rgb += flash * 0.5;
  
  gl_FragColor = color;
}
`
  }
});

// Lightning Strike - Fulmine che colpisce
export const LightningStrike = Shaders.create({
  lightningStrike: {
    frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform float time;
uniform float intensity;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec4 color = texture2D(t, uv);
  
  // Posizione fulmine (verticale dal centro alto)
  float lightning = 0.0;
  float x = uv.x;
  float y = uv.y;
  
  // Crea pattern fulmine zigzag
  float bolt = abs(x - 0.5 - sin(y * 20.0 + time * 10.0) * 0.1);
  
  // Intensità fulmine
  if (bolt < 0.02 && y < 0.8) {
    lightning = 1.0 - bolt * 50.0;
    lightning *= random(vec2(floor(time * 10.0), y)) > 0.3 ? 1.0 : 0.0;
  }
  
  // Flash bianco accecante
  float flash = exp(-mod(time, 2.0) * 3.0) * intensity;
  
  // Applica effetti
  color.rgb = mix(color.rgb, vec3(0.8, 0.9, 1.0), lightning);
  color.rgb += flash * vec3(1.0, 1.0, 1.0);
  
  gl_FragColor = color;
}
`
  }
});

// Funzione helper per animazione tempo
export const getTimeUniform = (startTime: number) => {
  return (Date.now() - startTime) / 1000;
};
