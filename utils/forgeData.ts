export interface ForgeArtifact {
  id: string;
  handle: string;
  title: string;
  status: 'RENDER_COMPLETE' | 'MESH_PENDING' | 'ARCHIVED';
  description: string;
  voteThreshold: number;
  glbUrl: string | null;
  usdzUrl: string | null;
  images: { url: string; altText: string }[];
}

export const mockForgeArtifacts: ForgeArtifact[] = [
  {
    id: 'forge-03',
    handle: 'invidious-tee',
    title: 'INVIDIOUS T-SHIRT [TEST]',
    status: 'RENDER_COMPLETE',
    description: 'Exported GLB from source USDZ for web/Android rotation; iOS AR via USDZ.',
    voteThreshold: 25,
    glbUrl: '/3d/invidious-tee/artifact.glb',
    usdzUrl: '/3d/invidious-tee/artifact.usdz',
    images: [
      { url: '/assets/forge-hoodie-front.jpg', altText: 'Invidious T-Shirt USdz Test' },
    ],
  },
  {
    id: 'forge-04',
    handle: 'premium-hoodie',
    title: 'PREMIUM HOODIE [TEST]',
    status: 'RENDER_COMPLETE',
    description: 'Exported GLB from source USDZ for web/Android rotation; iOS AR via USDZ.',
    voteThreshold: 25,
    glbUrl: '/3d/premium-hoodie/artifact.glb',
    usdzUrl: '/3d/premium-hoodie/artifact.usdz',
    images: [
      { url: '/assets/forge-cargo-detail.jpg', altText: 'Premium Hoodie USdz Test' },
    ],
  },
];
