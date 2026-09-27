import { GALAXY_FIELD_GLSL } from "./galaxy-field";

// Shared by the hero and splash so their skies stay visually identical.
export const atmosphericEvents = `
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float meteor(vec2 p,float lane){
        float period=6.7+lane*2.3;
        float clock=uTime+lane*3.1;
        float cycle=floor(clock/period);
        float age=mod(clock,period);
        float seed=hash(vec2(cycle,lane+17.));
        vec2 direction=normalize(vec2(-.52,-1.));
        vec2 start=vec2((seed-.5)*uAspect*1.3+.24,.72);
        vec2 head=start+direction*age*.78;
        vec2 relative=p-head;
        float along=dot(relative,-direction);
        float across=abs(relative.x*direction.y-relative.y*direction.x);
        float tail=exp(-across*across/0.0000025)*exp(-max(along,0.)*15.)
          *smoothstep(-.009,.012,along)*(1.-smoothstep(.18,.32,along));
        float core=exp(-dot(relative,relative)/0.000016);
        return (tail*.18+core*.32)*smoothstep(0.,.16,age)*(1.-smoothstep(1.6,2.,age));
      }
      float pulse(vec2 p){
        float cycle=floor(uTime/9.4);
        float age=mod(uTime,9.4)-2.8;
        float envelope=smoothstep(0.,.07,age)*(1.-smoothstep(.11,.62,age));
        float side=mod(cycle,2.)<1.?1.:-1.;
        vec2 q=p-vec2(side*uAspect*.34,.2+sin(cycle*2.3)*.13);
        float curve=q.x*.24+sin(q.x*59.+cycle)*.011+sin(q.x*137.)*.004;
        float distance=abs(q.y-curve);
        float extent=1.-smoothstep(.08,.23,abs(q.x));
        float filament=exp(-distance*distance/0.000003)*.06;
        float halo=exp(-distance*distance/.00065)*.009;
        return (filament+halo)*extent*envelope;
      }
`;


export const HERO_BACKGROUND_FRAGMENT = `
      varying vec2 vUv;uniform float uProgress,uTime,uAspect,uMotion;
      ${atmosphericEvents}
      ${GALAXY_FIELD_GLSL}
      vec3 starField(vec2 p){
        vec3 light=vec3(0.);
        // A loose diagonal concentration gives depth without adding grain or cloudy texture.
        float band=exp(-pow((p.y-p.x*.3-.12)*4.,2.));
        for(int layer=0;layer<3;layer++){
          float depth=float(layer);
          float scale=95.-depth*32.;
          vec2 drift=vec2(uProgress*.022,uTime*.00022*uMotion)*(1.+depth*.6);
          vec2 grid=(p+drift)*scale+depth*37.;
          vec2 cell=floor(grid);
          float seed=hash(cell+depth*11.);
          float threshold=mix(.986,.952,band)+depth*.009;
          vec2 point=fract(grid)-(.15+.7*vec2(hash(cell+7.),hash(cell+19.)));
          float pixel=max(fwidth(grid.x),fwidth(grid.y));
          float radius=max(mix(.025,.062,hash(cell+31.)),pixel*.65);
          float core=1.-smoothstep(0.,radius,length(point));
          float twinkle=.8+.2*sin(uTime*(.45+seed*.5)*uMotion+seed*63.);
          float glow=exp(-dot(point,point)*90.)*.035*step(.995,seed);
          vec3 tint=mix(vec3(.56,.65,.76),vec3(.91,.88,.8),hash(cell+43.));
          light+=tint*(core+glow)*step(threshold,seed)*twinkle*(.18+depth*.13);
        }
        // A few brighter pinpoints balance Scorpius without crowding the left-hand copy.
        vec2 accents[5];
        accents[0]=vec2(.075,.71);
        accents[1]=vec2(.245,.82);
        accents[2]=vec2(.135,.32);
        accents[3]=vec2(.055,.19);
        accents[4]=vec2(.275,.41);
        for(int i=0;i<5;i++){
          vec2 position=(accents[i]-.5)*vec2(uAspect,1.);
          position.y+=uProgress*.012;
          float d=length(p-position);
          float radius=max(.0008,fwidth(p.y)*1.15);
          float core=1.-smoothstep(0.,radius,d);
          float halo=exp(-d*d/.000012)*.035;
          float twinkle=.86+.14*sin(uTime*.6*uMotion+float(i)*1.9);
          light+=vec3(.57,.65,.73)*(core+halo)*twinkle;
        }
        return light;
      }
      vec3 scorpius(vec2 p){
        // Stylized positions from the ESO / IAU Scorpius chart, north upwards.
        // https://eso.org/public/images/eso1726d/
        float small=1.-smoothstep(.65,.95,uAspect);
        float size=mix(.25,.105,small);
        vec2 center=vec2(uAspect*mix(.34,.31,small),mix(.24,.37,small));
        center.y+=uProgress*.016;
        vec2 q=(p-center)/size+.5;
        q.y=1.-q.y;
        if(q.x<-.2||q.x>1.2||q.y<-.2||q.y>1.2)return vec3(0.);
        vec2 stars[16];
        stars[0]=vec2(.952,0.);     // Acrab
        stars[1]=vec2(.994,.124);   // Dschubba
        stars[2]=vec2(.994,.274);   // Pi Scorpii
        stars[3]=vec2(.78,.236);    // Alniyat
        stars[4]=vec2(.702,.268);   // Antares
        stars[5]=vec2(.638,.342);
        stars[6]=vec2(.506,.6);
        stars[7]=vec2(.492,.758);
        stars[8]=vec2(.478,.95);
        stars[9]=vec2(.334,.984);
        stars[10]=vec2(.132,.992);
        stars[11]=vec2(.034,.88);
        stars[12]=vec2(.07,.83);
        stars[13]=vec2(.132,.74);   // Shaula
        stars[14]=vec2(.158,.744);  // Lesath
        stars[15]=vec2(0.,.754);
        vec3 light=vec3(0.);
        for(int i=0;i<16;i++){
          if(i==4)continue;
          float d=length(q-stars[i]);
          float radius=max(.005,fwidth(q.x)*1.05);
          float core=1.-smoothstep(0.,radius,d);
          float shimmer=.88+.12*sin(uTime*.55*uMotion+float(i)*2.7);
          light+=vec3(.46,.54,.62)*(core+exp(-d*d/.00016)*.045)*shimmer;
        }
        float d=length(q-stars[4]);
        float core=1.-smoothstep(0.,max(.01,fwidth(q.x)*1.7),d);
        float halo=exp(-d*d/.0011)*.15+exp(-d*d/.005)*.014;
        float shimmer=.93+.07*sin(uTime*.48*uMotion);
        light+=(vec3(1.,.69,.4)*core+vec3(.9,.27,.09)*halo)*shimmer;
        return light;
      }
      void main(){
        vec2 p=(vUv-.5)*vec2(uAspect,1.);
        float inward=smoothstep(0.,.72,uProgress);
        float radius=mix(.72,.18,inward);
        // Two desaturated light fields converge behind the head as the visitor approaches.
        vec2 drift=vec2(sin(uTime*.12)*.015,cos(uTime*.09)*.012);
        vec2 left=p-vec2(-.48*(1.-inward),.07+inward*.1)-drift;
        vec2 right=p-vec2(.5*(1.-inward),-.12+inward*.22)+drift;
        float glow=exp(-dot(left,left)/(radius*radius))*.65
          +exp(-dot(right,right)/(radius*radius*.72))*.5;
        float distance=length(p*vec2(.8,1.));
        float wave=sin(distance*8.+inward*5.+p.y*2.+uTime*.06)*.5+.5;
        float current=wave*glow*sin(inward*3.14159)*.65;
        vec3 color=vec3(.00425,.0045,.0055);
        color+=vec3(.011,.01025,.013)*glow;
        color+=vec3(.012,.0105,.0145)*current;
        // A faint preview of the inner galaxy, behind the head and hero copy.
        color+=galaxyField(p,0.,0.,0.)*.22;
        color+=starField(p);
        color+=scorpius(p);
        float events=meteor(p,0.)+meteor(p,1.)+meteor(p,2.);
        color+=vec3(.7,.82,.9)*(events+pulse(p))*uMotion;
        color*=1.-smoothstep(.32,.85,uProgress)*.94;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`;
