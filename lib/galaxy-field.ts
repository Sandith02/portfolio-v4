// The voyage and finale share the exact same cloud field. Formation rotates and
// compresses that field into the final beam, without swapping skies or blackouts.
export const GALAXY_FIELD_GLSL = `
      float galaxyHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float galaxyNoise(vec2 p){
        vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(galaxyHash(i),galaxyHash(i+vec2(1.,0.)),f.x),
          mix(galaxyHash(i+vec2(0.,1.)),galaxyHash(i+vec2(1.)),f.x),f.y);
      }
      float galaxyCloud(vec2 p){
        float n=0.,a=.5;
        mat2 turn=mat2(.8,-.6,.6,.8);
        for(int i=0;i<5;i++){n+=a*galaxyNoise(p);p=turn*p*2.07+13.7;a*=.5;}
        return n;
      }
      vec3 galaxyStars(vec2 p,float density,float seed,float presence){
        vec2 grid=p*density,cell=floor(grid);
        float h=galaxyHash(cell+seed);
        vec2 center=.15+.7*vec2(galaxyHash(cell+seed+1.),galaxyHash(cell+seed+9.));
        float r=length(fract(grid)-center);
        float aa=max(fwidth(grid.x),fwidth(grid.y));
        float point=1.-smoothstep(.018,.035+aa*.65,r);
        float halo=exp(-r*22.)*.18;
        float twinkle=.8+.2*sin(uTime*.4+h*83.);
        return mix(vec3(.7,.78,.86),vec3(.95,.89,.78),h)
          *(point+halo)*step(1.-presence,h)*twinkle*(.3+h*h);
      }
      vec3 galaxyField(vec2 p,float journey,float formation,float flow,float starDensity,float fineStars){
        // Keep the destination worlds prominent during the voyage. The shared
        // cloud field gradually regains its light as it gathers into the finale.
        float cloudStrength=mix(.44,1.,formation);
        float starStrength=mix(.55,1.,formation);
        float starPresence=mix(.12,.22,formation)*starDensity;
        vec2 drift=vec2(uTime*.0015+journey*.004,sin(uTime*.06)*.006+journey*.002);
        p+=drift;
        // A slow, dark current bends the apparent star field around a quiet void.
        // This is an expressive inner-world effect, not a physics simulation.
        vec2 voidCenter=vec2(sin(uTime*.035+journey*.02)*uAspect*.32,cos(uTime*.028+journey*.012)*.24);
        vec2 voidDelta=p-voidCenter;
        float darkCurrent=exp(-dot(voidDelta,voidDelta)*15.);
        p+=vec2(-voidDelta.y,voidDelta.x)*darkCurrent*.13*(1.-formation);
        // Inclined galactic plane: turbulent dust lanes around a warm distant core.
        float angle=mix(.42787,1.5707963,formation);
        float c=cos(angle),s=sin(angle);
        vec2 q=mat2(c,-s,s,c)*(p-drift*formation);
        q.y*=mix(1.,5.2,formation);
        // Advect the texture along the plane's long axis. Once upright, positive
        // travel carries clouds UP the screen while the beam stays anchored.
        vec2 flowing=q-vec2(flow,0.);
        float wisps=galaxyCloud(flowing*5.+vec2(uTime*.002,0.));
        float detail=galaxyCloud(flowing*21.+wisps*2.);
        float band=exp(-pow((q.y+(wisps-.5)*.23)*5.3,2.));
        float broad=exp(-pow(q.y*3.2,2.));
        float dust=galaxyCloud(flowing*vec2(9.,19.)+vec2(4.7,1.3));
        float r=length((q-vec2(.12,.015))*vec2(1.1,2.8));
        float core=exp(-r*6.5);
        vec3 color=vec3(.003,.004,.005);
        color+=mix(vec3(.04,.05,.065),vec3(.102,.095,.115),wisps)
          *broad*pow(wisps,1.7)*.32*cloudStrength;
        color+=mix(vec3(.12,.145,.17),vec3(.26,.26,.245),detail)
          *band*pow(detail,2.)*.3*cloudStrength;
        color+=vec3(.6,.57,.51)*core*(.3+detail)*.17*cloudStrength;
        color*=1.-smoothstep(.48,.78,dust)*band*.87;
        color+=galaxyStars(p,155.,3.,starPresence)*.24*starStrength;
        color+=galaxyStars(p*1.025,71.,31.,starPresence)*.36*starStrength;
        color+=galaxyStars(p*1.06,29.,71.,starPresence)*.42*starStrength;
        // More distant, unresolved stars collect along the galactic plane.
        color+=vec3(.24,.255,.27)*pow(galaxyNoise(p*1100.),18.)*band*cloudStrength*fineStars;
        color+=galaxyStars(flowing,160.,113.,starPresence)*band*formation*.16;
        color*=1.-darkCurrent*(.3+wisps*.35)*(1.-formation);
        return color;
      }
      vec3 galaxyField(vec2 p,float journey,float formation,float flow){
        return galaxyField(p,journey,formation,flow,1.,1.);
      }
`;
