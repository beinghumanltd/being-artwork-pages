#ifdef GL_ES
precision highp float;
#endif

#define NUM_DISCS 100
#define THICKNESS 0.005

struct Ring {
    float radius;
    float saturation;
    float alpha;
};

uniform Ring ringData[NUM_DISCS];
varying vec2 vTextureCoord;

void calculateDisc(in Ring parameters,
                   inout float alpha) {
    float radius = parameters.radius;
    float d = distance(vTextureCoord, vec2(0.5, 0.5));
    float mask1 = smoothstep(radius - (THICKNESS * 0.5), radius - (THICKNESS * 0.25), d);
    float mask2 = 1.0 - smoothstep(radius + (THICKNESS * 0.25), radius + (THICKNESS * 0.5), d);
    alpha = max(alpha, min(mask1, mask2));
}

void main() {
    float alpha = 0.0;

    for (int i = 0; i < NUM_DISCS; i++) {
        calculateDisc(ringData[i], alpha);
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
