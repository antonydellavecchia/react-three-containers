uniform sampler2D tAudioData;
varying vec4 vUv;
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
  float random1 = rand(vec2(vUv.x, vUv.y));
  float random2 = rand(vec2(vUv.x, vUv.z));
  float maxIndex;
  float frequency;
  
  for(int i=0; i< 30; ++i){
    frequency = texture2D( tAudioData, vec2(random1 * abs(vUv.x), 10) ).g;

    if (frequency > maxIndex) 
      maxIndex = float(i);
        
  }

  float f = texture2D( tAudioData, vec2(1.0 / abs(vUv.x), maxIndex) ).g;
  float radius = pow(pow(vUv.y, 2.0) + pow(vUv.x, 2.0), 0.5);
  //c3 backgroundColor = vec3( 0.5,  0.3, f );
  vec3 backgroundColor = vec3(f,  min(maxIndex / 30.0, radius), 1.0 -  maxIndex / 30.0);
  float red  = min(vUv.y / 4.0, 1.0);
  vec3 color = vec3( red, maxIndex / 10.0, cos(f));
  float i = step(radius, f) * step(radius, f - 0.5);
  //gl_FragColor = vec4( mix(color, backgroundColor, i), 1.0 );
  gl_FragColor = vec4(backgroundColor, 1.0);
}
