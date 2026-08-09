#!/usr/bin/env python3
# Blender background script: generate a stylized Air Force 1 sneaker and export GLB.
# Run:
#   /Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/blender_generate_sneaker.py

import bpy
import mathutils
import os

OUTPUT_GLB = os.path.join(
    os.path.dirname(bpy.path.abspath(__file__)), "..", "public", "models", "af1.glb"
)
OUTPUT_GLB = os.path.normpath(OUTPUT_GLB)

# Clean slate
bpy.ops.wm.read_factory_settings(use_empty=True)

# Materials
mat_white = bpy.data.materials.new(name="WhiteLeather")
mat_white.use_nodes = True
bsdf = mat_white.node_tree.nodes["Principled BSDF"]
bsdf.inputs['Base Color'].default_value = (0.95, 0.95, 0.95, 1.0)
bsdf.inputs['Roughness'].default_value = 0.45
bsdf.inputs['Specular'].default_value = 0.35

mat_sole = bpy.data.materials.new(name="Sole")
mat_sole.use_nodes = True
bsdf2 = mat_sole.node_tree.nodes["Principled BSDF"]
bsdf2.inputs['Base Color'].default_value = (0.92, 0.92, 0.92, 1.0)
bsdf2.inputs['Roughness'].default_value = 0.55

# Collections
main_col = bpy.data.collections.new("Sneaker")
bpy.context.scene.collection.children.link(main_col)

# --- Sole ---
sole = bpy.data.objects.new("Sole", bpy.data.meshes.new("SoleMesh"))
bpy.context.collection.objects.link(sole)
sole.data.materials.append(mat_sole)

bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = sole
sole.select_set(True)

bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.primitive_cube_add(size=1)
bm = sole.data
# Roughly shape sole via vertex scale
for v in bm.vertices:
    x, y, z = v.co
    v.co = mathutils.Vector((x * 2.0, y * 0.9, z * 0.25))
bpy.ops.object.mode_set(mode='OBJECT')

# --- Midsole ---
mid = bpy.data.objects.new("Midsole", bpy.data.meshes.new("MidsoleMesh"))
bpy.context.collection.objects.link(mid)
mid.data.materials.append(mat_sole)
mid.location = (0, 0, 0.14)

bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = mid
mid.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.primitive_cube_add(size=1)
for v in mid.data.vertices:
    x, y, z = v.co
    v.co = mathutils.Vector((x * 1.9, y * 0.85, z * 0.2))
bpy.ops.object.mode_set(mode='OBJECT')

# --- Upper ---
upper = bpy.data.objects.new("Upper", bpy.data.meshes.new("UpperMesh"))
bpy.context.collection.objects.link(upper)
upper.data.materials.append(mat_white)
upper.location = (0, 0, 0.24)

bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = upper
upper.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.primitive_cube_add(size=1)
for v in upper.data.vertices:
    x, y, z = v.co
    v.co = mathutils.Vector((x * 1.8, y * 0.75, z * 0.7))
bpy.ops.object.mode_set(mode='OBJECT')

# --- Tongue ---
tongue = bpy.data.objects.new("Tongue", bpy.data.meshes.new("TongueMesh"))
bpy.context.collection.objects.link(tongue)
tongue.data.materials.append(mat_white)
tongue.location = (0, 0.15, 0.45)

bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = tongue
tongue.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.primitive_cube_add(size=1)
for v in tongue.data.vertices:
    x, y, z = v.co
    v.co = mathutils.Vector((x * 0.7, y * 0.25, z * 0.6))
bpy.ops.object.mode_set(mode='OBJECT')

# --- Heel tab ---
heel = bpy.data.objects.new("HeelTab", bpy.data.meshes.new("HeelMesh"))
bpy.context.collection.objects.link(heel)
heel.data.materials.append(mat_white)
heel.location = (0, -0.7, 0.55)

bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = heel
heel.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.primitive_cube_add(size=1)
for v in heel.data.vertices:
    x, y, z = v.co
    v.co = mathutils.Vector((x * 0.9, y * 0.08, z * 0.25))
bpy.ops.object.mode_set(mode='OBJECT')

# Export
bpy.ops.object.select_all(action='DESELECT')
for obj in main_col.objects:
    obj.select_set(True)

bpy.ops.export_scene.gltf(
    filepath=OUTPUT_GLB,
    export_format='GLB',
    export_apply=True,
    export_draco_mesh_compression_enable=False,
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False,
)
print(f"Exported GLB to: {OUTPUT_GLB}")
