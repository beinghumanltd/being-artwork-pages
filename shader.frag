#ifdef GL_ES
precision highp float;
#endif

#define NUM_RINGS 100
#define THICKNESS 0.005

struct Ring {
    float radius;
    float thicknessMod;         // Normalised 0.0..1.0
    float saturation;           // Normalised 0.0..1.0
    float alpha;
};

uniform Ring ringData[NUM_RINGS];
varying vec2 vTextureCoord;

void calculateDisc(in Ring parameters,
                   inout vec4 outColour) {
    float radius = parameters.radius;
    float thicknessMod = parameters.thicknessMod;
    float saturation = parameters.saturation;

    float outerThick = THICKNESS * 0.5 * (1.0 + (thicknessMod * 4.0));
    float innerThick = THICKNESS * 0.25 * (1.0 + thicknessMod);

    float d = distance(vTextureCoord, vec2(0.5, 0.5));
    float mask1 = smoothstep(radius - outerThick, radius - innerThick, d);
    float mask2 = 1.0 - smoothstep(radius + innerThick, radius + outerThick, d);
    float mask = min(mask1, mask2);

    // Rough gradient from cyan to white:
    vec3 ringColour = mix(vec3(0.5, 0.7, 1.0),
                          vec3(1.0, 1.0, 1.0),
                          saturation);

    /*outColour = vec4(max(outColour.r, mask * ringColour.r),
                     max(outColour.g, mask * ringColour.g),
                     max(outColour.b, mask * ringColour.b),
                     max(outColour.a, mask));*/
    outColour = vec4(max(outColour.rgb, mask * ringColour),
                     max(outColour.a, mask));
}

void main() {
    vec4 outColour = vec4(0.0, 0.0, 0.0, 0.0);

    for (int i = 0; i < NUM_RINGS; i++) {
        calculateDisc(ringData[i], outColour);
    }

    gl_FragColor = outColour;
}
