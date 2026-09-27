"""Build the finale's posed human from MakeHuman CC0 source data.
Run in Blender with --background --python scripts/build-finale-figure.py.
Source files are cached in /private/tmp; provenance is in public/models/NOTICE.md.
"""
import bpy, json, math
from mathutils import Vector, Quaternion
from pathlib import Path

SOURCE=Path('/private/tmp')
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
vertices=[]; faces=[]; group=''; groups={}
for line in (SOURCE/'mind-human-base.obj').read_text().splitlines():
    words=line.split()
    if not words: continue
    if words[0]=='v': vertices.append(Vector(map(float,words[1:4])))
    elif words[0]=='g': group=words[1]
    elif words[0]=='f':
        face=[int(w.split('/')[0])-1 for w in words[1:]]
        groups.setdefault(group,[]).append(face)
        if group=='body': faces.append(face)
for name in ['asian-male-young.target','universal-male-young-averagemuscle-averageweight.target']:
    for line in (SOURCE/name).read_text().splitlines():
        words=line.split()
        if len(words)==4 and words[0].isdigit(): vertices[int(words[0])]+=Vector(map(float,words[1:]))
# MakeHuman Y-up to Blender Z-up, in metres.
verts=[Vector((v.x,-v.z,v.y))*.1 for v in vertices]
skel=json.loads((SOURCE/'default.mhskel').read_text())
weights=json.loads((SOURCE/'default_weights.mhw').read_text())['weights']
def joint(name):
    indices=skel['joints'][name]
    return sum((verts[i] for i in indices),Vector())/len(indices)
arm=bpy.data.armatures.new('Human rig');rig=bpy.data.objects.new('Human rig',arm);bpy.context.collection.objects.link(rig)
bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
for name, bone in skel['bones'].items():
    b=arm.edit_bones.new(name);b.head=joint(bone['head']);b.tail=joint(bone['tail'])
for name, bone in skel['bones'].items():
    if bone.get('parent'): arm.edit_bones[name].parent=arm.edit_bones[bone['parent']]
bpy.ops.object.mode_set(mode='OBJECT');rig.select_set(False)
mesh=bpy.data.meshes.new('Human anatomical topology');mesh.from_pydata(verts,[],faces);mesh.update()
body=bpy.data.objects.new('Human',mesh);bpy.context.collection.objects.link(body)
for name, entries in weights.items():
    vg=body.vertex_groups.new(name=name)
    for idx, weight in entries: vg.add([idx],weight,'REPLACE')
mod=body.modifiers.new('Pose','ARMATURE');mod.object=rig;mod.use_deform_preserve_volume=True

def turn(name,axis,degrees):
    bone=rig.pose.bones[name];bone.rotation_mode='QUATERNION'
    rest=bone.bone.matrix_local.to_quaternion()
    bone.rotation_quaternion=(rest.inverted() @ Quaternion(Vector(axis),math.radians(degrees)) @ rest) @ bone.rotation_quaternion
# Relaxed arms, gentle knee flexion and a small asymmetry in the suspended legs.
turn('upperarm01.L',(0,1,0),24)
turn('upperarm01.R',(0,1,0),-21)
turn('lowerarm01.L',(1,0,0),-6)
turn('lowerarm01.R',(1,0,0),-9)
turn('upperleg01.L',(0,1,0),6)
turn('upperleg01.R',(0,1,0),-6)
turn('upperleg01.L',(1,0,0),-25)
turn('lowerleg01.L',(1,0,0),67)
turn('lowerleg01.L',(0,1,0),4)
turn('head',(0,1,0),-3)
for name in rig.pose.bones.keys():
    if name.startswith('finger') and not name.startswith('finger1'):
        turn(name,(1,0,0),7)
bpy.context.view_layer.update()

mat=bpy.data.materials.new('Shadow');mat.diffuse_color=(.006,.008,.01,1);mat.use_nodes=True
bsdf=mat.node_tree.nodes.get('Principled BSDF');bsdf.inputs['Base Color'].default_value=(.006,.008,.01,1);bsdf.inputs['Roughness'].default_value=.95
body.data.materials.append(mat)
# Tailor a plain shirt, trousers and shoe shell from the real body topology.
# The soft shell follows the rig, retaining hands, neck and face proportions.
original_normals=[v.normal.copy() for v in mesh.vertices]
objects=[body]
for label,predicate,offset in [
 ('Shirt',lambda c:c.y>.15 and c.y<5.6 and (abs(c.x)<1.95 or c.y>3.8),.085),
 ('Trousers',lambda c:c.y<.4 and c.y>-7.5,.13),
 ('Shoes',lambda c:c.y<-7.43,.095),
 ('Hair',lambda c:c.y>7.8 or (c.y>7.05 and c.z<.15),.075),
]:
    chosen=[f for f in faces if all(predicate(vertices[i]) for i in f)]
    ids=sorted(set(i for f in chosen for i in f));remap={old:new for new,old in enumerate(ids)}
    geo=bpy.data.meshes.new(label);geo.from_pydata([verts[i]+original_normals[i]*offset*.1 for i in ids],[],[[remap[i] for i in f] for f in chosen]);geo.update()
    obj=bpy.data.objects.new(label,geo);bpy.context.collection.objects.link(obj);geo.materials.append(mat)
    for name,entries in weights.items():
        vg=obj.vertex_groups.new(name=name)
        for idx,weight in entries:
            if idx in remap:vg.add([remap[idx]],weight,'REPLACE')
    m=obj.modifiers.new('Pose','ARMATURE');m.object=rig;m.use_deform_preserve_volume=True
    objects.append(obj)
# Keep skin weights so shoulders, elbows, clothing and hands move together.
for obj in objects:
    bpy.context.view_layer.objects.active=obj;obj.select_set(True)
    obj.modifiers.remove(obj.modifiers['Pose'])
    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.delete_loose();bpy.ops.object.mode_set(mode='OBJECT')
    sub=obj.modifiers.new('Smooth anatomy','SUBSURF');sub.levels=1
    bpy.ops.object.modifier_apply(modifier=sub.name)
    for poly in obj.data.polygons:poly.use_smooth=True
    obj.select_set(False)
for obj in objects:obj.select_set(True)
bpy.context.view_layer.objects.active=body;bpy.ops.object.join()
reduce=body.modifiers.new('Delivery geometry','DECIMATE');reduce.ratio=.35
bpy.ops.object.modifier_apply(modifier=reduce.name)
mod=body.modifiers.new('Living silhouette','ARMATURE');mod.object=rig
mod.use_deform_preserve_volume=True
bpy.context.view_layer.update()
# Normalize using the accepted relaxed pose; rising arms must not rescale the body.
evaluated=body.evaluated_get(bpy.context.evaluated_depsgraph_get())
lo=Vector((min(v.co[i] for v in evaluated.data.vertices) for i in range(3)))
hi=Vector((max(v.co[i] for v in evaluated.data.vertices) for i in range(3)))
centre=(lo+hi)*.5;scale=1.9/(hi.z-lo.z)
root=bpy.data.objects.new('Floating human silhouette',None);bpy.context.collection.objects.link(root)
body.parent=rig;rig.parent=root
root.scale=(scale,)*3;root.location=-centre*scale
# Preserve the accepted loose, suspended pose. A small opening of the arms
# responds to the upward current, then settles without an overhead gesture.
arm_names=['upperarm01.L','upperarm01.R','lowerarm01.L','lowerarm01.R',
           'spine02','head','upperleg01.L','lowerleg01.L']
rest={name:rig.pose.bones[name].rotation_quaternion.copy() for name in arm_names}
turn('upperarm01.L',(0,1,0),-17)
turn('upperarm01.R',(0,1,0),21)
turn('lowerarm01.L',(1,0,0),-8)
turn('lowerarm01.R',(1,0,0),-10)
turn('spine02',(1,0,0),-1)
turn('head',(1,0,0),-2)
turn('upperleg01.L',(1,0,0),3)
turn('lowerleg01.L',(1,0,0),-4)
drifting={name:rig.pose.bones[name].rotation_quaternion.copy() for name in arm_names}
def smooth(x):
    x=max(0,min(1,x));return x*x*x*(x*(x*6-15)+10)
for frame in range(1,132):
    t=(frame-1)/130
    for name in arm_names:
        release=.26 if name.endswith('.R') else .33
        if name.startswith('lowerarm'): release+=.09
        if name in ['head','spine02'] or 'leg' in name: release=.43
        drift=1-smooth((t-release)/(1-release))
        bone=rig.pose.bones[name]
        bone.rotation_quaternion=rest[name].slerp(drifting[name],drift)
        bone.keyframe_insert(data_path='rotation_quaternion',frame=frame,group=name)
rig.animation_data.action.name='Gentle floating arrival'
bpy.context.scene.render.fps=30
bpy.context.scene.frame_start=1;bpy.context.scene.frame_end=131
bpy.context.scene.frame_set(131)
bpy.ops.object.select_all(action='DESELECT')
for obj in [root,body,rig]:obj.select_set(True)
bpy.context.view_layer.objects.active=body
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/inner-world-figure.glb'),export_format='GLB',use_selection=True,export_animations=True,export_yup=True)
print('EXPORTED',len(body.data.vertices),'vertices with ascent arm animation')
