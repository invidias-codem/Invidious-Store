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
    id: 'forge-01',
    handle: 'chrome-spun-hoodie-v1',
    title: 'CHROME-SPUN HOODIE [V1]',
    status: 'MESH_PENDING',
    description: 'Volumetric scan pending. 450 GSM Japanese loopwheel cotton structural test.',
    voteThreshold: 50,
    glbUrl: null,
    usdzUrl: null,
    images: [
      { url: '/assets/forge-hoodie-front.jpg', altText: 'Chrome-Spun Hoodie Front Proto' },
    ],
  },
  {
    id: 'forge-02',
    handle: 'obsidian-cargo-hardware',
    title: 'OBSIDIAN CARGO HARDWARE',
    status: 'MESH_PENDING',
    description: 'Custom .925 sterling silver hardware placement tests.',
    voteThreshold: 75,
    glbUrl: null,
    usdzUrl: null,
    images: [
      { url: '/assets/forge-cargo-detail.jpg', altText: 'Obsidian Cargo Silver Hardware Detail' },
    ],
  },
];
