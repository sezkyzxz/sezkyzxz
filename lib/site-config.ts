export interface SiteConfig {
  email: string;
  whatsapp: string;        // Nomor WhatsApp dengan kode negara tanpa '+' (contoh: '6281234567890')
  instagram: string;       // Username Instagram tanpa '@' (contoh: 'sezky.studio')
  behance: string;         // URL profil Behance
  linkedin: string;        // URL profil LinkedIn
  dribbble: string;        // URL profil Dribbble
  github?: string;         // URL profil GitHub (opsional)
  discord?: string;        // URL profil Discord
  discordUsername?: string;// Username Discord (contoh: 'szkyy.zxz')
  cvUrl?: string;          // Link download CV (Google Drive / link langsung)
  photoUrl?: string;       // URL foto profil
  clients?: string[];      // Nama-nama klien
}

export const SITE_CONFIG: SiteConfig = {
  // Kontak Utama
  email: 'saputramuhammadrizky11@gmail.com',
  whatsapp: '6288293354651',

  // Sosial Media & Portofolio
  instagram: 'sezky.zxz',
  behance: 'https://www.behance.net/sezkyzxz',
  linkedin: 'https://www.linkedin.com/in/saputra-muhammad-rizky-859041371/?isSelfProfile=true',
  dribbble: 'https://dribbble.com/sezkyzxz',
  github: 'https://github.com/sezkyzxz',
  discord: 'https://discord.com/users/806179522545713223',
  discordUsername: 'sezky.zxz',

  // Link CV / Resume
  cvUrl: '/CV-Saputra-Muhammad-Rizky.pdf',

  // Foto & Klien
  photoUrl: '/assets/images/about-portrait.png',
  clients: ['Kopi Senja', 'Finlyst', 'Nusa Skincare'],
};
