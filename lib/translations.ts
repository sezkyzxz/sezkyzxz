export type Language = 'en' | 'id';

export interface TranslationDictionary {
  nav: {
    home: string;
    about: string;
    portfolio: string;
    contact: string;
    resume: string;
    localTime: string;
    menu: string;
    skip: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    lead: string;
    rating: string;
    letsTalk: string;
    viewWork: string;
    viewCv: string;
    carousel: Array<{ c: string; h: string }>;
    sbarDesign: string;
    sbarLocation: string;
    sbarScroll: string;
  };
  spotify: {
    title: string;
    badge: string;
    sub: string;
  };
  about: {
    badge: string;
    hiPrefix: string;
    hiName: string;
    hiDesc: string;
    viewCv: string;
    contactMe: string;
    viewPortfolio: string;
    bioText: string;
    eduTitle: string;
    expTitle: string;
    education: Array<{ degree: string; institution: string; period: string }>;
    experience: Array<{ role: string; company: string; period: string }>;
    metric1Number: string;
    metric1Title: string;
    metric1Desc: string;
    metric2Number: string;
    metric2Title: string;
    metric2Desc: string;
    metric3Number: string;
    metric3Title: string;
    metric3Desc: string;
  };
  createBand: {
    w1: string;
    w2: string;
    w3: string;
  };
  portfolio: {
    title: string;
    tabProjects: string;
    tabCertificates: string;
    tabTechStack: string;
    filterAll: string;
    loading: string;
    loadError: string;
    viewCaseStudy: string;
    liveDemo: string;
    showMore: string;
    showLess: string;
    noProjects: string;
    certIssuer: string;
    certYear: string;
    certPreview: string;
  };
  services: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    items: Array<{ number: string; title: string; desc: string }>;
  };
  process: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    steps: Array<{ number: string; title: string; desc: string }>;
  };
  stats: {
    eyebrow: string;
    title: string;
    label1: string;
    label2: string;
    label3: string;
    label4: string;
  };
  whySezky: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      tag: string;
      desc: string;
    }>;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: Array<{
      quote: string;
      name: string;
      role: string;
      initials: string;
      photo?: string;
      projectTag?: string;
    }>;
  };
  faq: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    items: Array<{ q: string; a: string }>;
  };
  contact: {
    badge: string;
    formTitle: string;
    formSub: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    btnSubmit: string;
    btnSending: string;
    successTitle: string;
    successDesc: string;
    btnSendAnother: string;
    findMeTitle: string;
    cvCardTitle: string;
    cvCardDesc: string;
    whatsappCardDesc: string;
    emailCardDesc: string;
  };
  modal: {
    title: string;
    sub: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    close: string;
    successTitle: string;
    successDesc: string;
  };
  comments: {
    title: string;
    sub: string;
    nameLabel: string;
    namePlaceholder: string;
    commentLabel: string;
    commentPlaceholder: string;
    photoLabel: string;
    photoChange: string;
    photoRemove: string;
    btnSubmit: string;
    btnSubmitting: string;
    success: string;
    error: string;
    empty: string;
    pinnedBadge: string;
    adminReplyLabel: string;
  };
  footer: {
    designerRole: string;
    allRights: string;
    backToTop: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      portfolio: 'Portfolio',
      contact: 'Contact',
      resume: 'Resume / CV',
      localTime: 'Local time',
      menu: 'Menu',
      skip: 'Skip to content',
    },
    hero: {
      eyebrow: 'Brand Identity & Package Designer',
      titleLine1: 'Branding that',
      titleLine2: 'you need',
      titleLine3: 'Indeed',
      lead: 'Elevate your brand with custom identity and package design. Showcase your story through bold visuals and strategic design solutions.',
      rating: '180+ design projects completed',
      letsTalk: "Let's Talk",
      viewWork: 'View Work',
      viewCv: 'View CV ↗',
      carousel: [
        { c: 'Brand identity', h: 'Designed to be remembered.' },
        { c: 'Package design', h: 'Made to be picked up.' },
        { c: 'Mockup design', h: 'Seen before it is made.' },
      ],
      sbarDesign: 'Brand & package design',
      sbarLocation: 'Based in Jakarta, working worldwide',
      sbarScroll: 'Scroll to explore',
    },
    spotify: {
      title: 'Daily Rotation',
      badge: 'Spotify',
      sub: 'A curated collection of tracks that keep me in the zone and inspired while designing.',
    },
    about: {
      badge: 'About Me',
      hiPrefix: "Hi, I'm",
      hiName: 'SEZKY',
      hiDesc: 'Brand Identity & Package Designer focused on creating memorable brands and tactile packaging experiences.',
      viewCv: 'Download / View CV',
      contactMe: 'Get in Touch',
      viewPortfolio: 'View Portfolio',
      bioText:
        'As a Brand & Package Designer, I focus on crafting visual identities that are not only aesthetic, but also deliver a powerful, strategic, and tangible impact for your business growth.',
      eduTitle: 'Education & Background',
      expTitle: 'Experience',
      education: [
        {
          degree: 'Informatics Engineering (Backend & UI/UX Design)',
          institution: 'Universitas Bina Sarana Informatika',
          period: '2022 – 2026',
        },
        {
          degree: 'Design Systems, Prototyping & API Architecture',
          institution: 'UI/UX & Backend Masterclass',
          period: '2022 – 2026',
        },
      ],
      experience: [
        {
          role: 'Lead Brand Identity & Package Designer',
          company: 'SEZKY Studio',
          period: '2023 – Present',
        },
        {
          role: 'Packaging & Visual System Designer',
          company: 'GreenLeaf & UrbanFit Co',
          period: '2021 – 2023',
        },
      ],
      metric1Number: '30+',
      metric1Title: 'Projects Completed',
      metric1Desc: 'Custom brand identities & packaging designs delivered to clients worldwide.',
      metric2Number: '4+',
      metric2Title: 'Years of Experience',
      metric2Desc: 'Dedicated journey in brand strategy, packaging, and digital interfaces.',
      metric3Number: '99%',
      metric3Title: 'Client Satisfaction',
      metric3Desc: 'Proven track record of client happiness, on-time delivery & precision.',
    },
    createBand: {
      w1: 'We',
      w2: 'Build',
      w3: 'Better',
    },
    portfolio: {
      title: 'Portfolio',
      tabProjects: 'Projects',
      tabCertificates: 'Certificates',
      tabTechStack: 'Tech Stack',
      filterAll: 'All',
      loading: 'Loading projects...',
      loadError: 'Failed to load projects. Showing sample showcase.',
      viewCaseStudy: 'View Project',
      liveDemo: 'Live Demo',
      showMore: 'View All Projects',
      showLess: 'Show Less',
      noProjects: 'No projects available in this category.',
      certIssuer: 'Issued by',
      certYear: 'Year',
      certPreview: 'View Certificate',
    },
    services: {
      eyebrow: 'Services',
      titleLine1: 'Design services that',
      titleLine2: 'make brands stand out',
      items: [
        {
          number: '01',
          title: 'Brand Identity',
          desc: 'Crafting unique, memorable brand identities that resonate with your audience, from logos to comprehensive visual systems.',
        },
        {
          number: '02',
          title: 'Package Design',
          desc: 'Sleek, impactful packaging that connects with your ideal customers and turns first impressions into lasting loyalty.',
        },
        {
          number: '03',
          title: 'Brand Design',
          desc: 'Bringing your brand to life across every touchpoint so it feels consistent, premium, and unmistakably yours.',
        },
        {
          number: '04',
          title: 'Mockup Design',
          desc: 'High-fidelity 3D product mockups that preview exactly how your packaging and visuals look in the physical world.',
        },
      ],
    },
    process: {
      eyebrow: 'Design Process',
      titleLine1: 'A clear process,',
      titleLine2: 'from first call to delivery',
      steps: [
        {
          number: '01',
          title: 'Define Your Vision',
          desc: 'Tell me about your brand, goals, and audience through a discovery call or form, agreeing on scope and direction upfront.',
        },
        {
          number: '02',
          title: 'Submit Your Request',
          desc: "Share your requirements, moodboards, and references. I'll confirm deliverables, milestones, and design timelines.",
        },
        {
          number: '03',
          title: 'Project Delivered',
          desc: 'Delivered on time with meticulous craft: typically 2–3 days for packaging and 1–2 weeks for complete brand systems.',
        },
      ],
    },
    stats: {
      eyebrow: 'By the numbers',
      title: 'Proven track record in brand design',
      label1: 'Design projects',
      label2: 'Client satisfaction',
      label3: 'Industry awards',
      label4: 'Average rating',
    },
    whySezky: {
      eyebrow: 'Why Work With SEZKY',
      title: 'Design precision that elevates your commercial value',
      subtitle: 'Beyond aesthetics: thoughtful packaging and brand systems tailored to dominate shelves and win customer trust.',
      items: [
        {
          title: 'Rapid & Agile Turnaround',
          tag: '2–3 Days',
          desc: 'Quick initial concepts and mockup iterations with zero bureaucratic friction and dedicated direct communication.',
        },
        {
          title: 'Factory-Ready Precision',
          tag: '100% Print Ready',
          desc: 'Exact dielines, calibrated CMYK color spaces, and sharp vector master files (AI, PDF, EPS) ready for mass production.',
        },
        {
          title: 'Photorealistic 3D Mockups',
          tag: 'High-Fidelity',
          desc: 'Lifelike 3D product visualizations that let you review real-world shelf appeal and material finishes before printing.',
        },
        {
          title: 'Full Commercial Rights',
          tag: '100% Original',
          desc: 'Handcrafted custom designs from scratch with complete intellectual property handover and zero template risk.',
        },
      ],
    },
    testimonials: {
      eyebrow: 'Client Words',
      title: 'What clients say',
      items: [
        {
          quote:
            'Wow is all I can say! SEZKY did an absolute phenomenal job from start to finish! He captured and created exactly what I wanted and exceeded my expectations. Highly recommend SEZKY!',
          name: 'Shula Aurellia',
          role: 'Shareholder, BOO Djimber (Djivar Oma)',
          initials: 'SA',
          photo: '/assets/images/testimonials/shula.jpg',
          projectTag: 'Brand Identity & Visuals',
        },
        {
          quote:
            'The process was highly collaborative, and the final result exceeded our expectations. Our brand packaging now stands out on every coffee shop shelf.',
          name: 'Amanda Putri',
          role: 'Founder, Kopi Senja',
          initials: 'AP',
          photo: '/assets/images/testimonials/amanda.jpg',
          projectTag: 'Cold Brew Packaging',
        },
        {
          quote:
            'Clear communication, on-time delivery, and the design truly reflects our brand vision and appeals to modern customers. Outstanding aesthetic sense.',
          name: 'Rizky Hadi',
          role: 'CEO, Finlyst',
          initials: 'RH',
          photo: '/assets/images/testimonials/rizky.jpg',
          projectTag: 'Fintech Visual System',
        },
        {
          quote:
            'Rebranding our packaging immediately impacted retail shelf presence and sales. Highly recommended for any serious business looking to elevate.',
          name: 'Sari Wulandari',
          role: 'Owner, Nusa Skincare',
          initials: 'SW',
          photo: '/assets/images/testimonials/sari.jpg',
          projectTag: 'Cosmetics Label Design',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      titleLine1: 'Answers to common',
      titleLine2: 'questions',
      items: [
        {
          q: 'What services do you provide?',
          a: 'I specialize in brand identity and package design, with experience in UI/UX systems and creating comprehensive brand touchpoints that resonate with target audiences.',
        },
        {
          q: 'How do I start working with you?',
          a: 'Simply send a message through the contact form or direct channels. We will discuss your project scope, timeline, and goals to ensure a perfect alignment.',
        },
        {
          q: 'What design tools do you use?',
          a: 'I primarily work with Figma, Adobe Illustrator, Photoshop, Blender 3D, and modern frontend tools to bring design concepts into production.',
        },
        {
          q: 'How long does a project take?',
          a: 'Most projects are completed within 2–3 days for packaging, while comprehensive brand identities take 1–2 weeks depending on scope.',
        },
        {
          q: 'Do you provide revisions?',
          a: 'Yes! Every project includes iterative feedback rounds to ensure the final design matches your vision precisely.',
        },
        {
          q: 'What industries do you work with?',
          a: 'I work with clients across F&B, consumer goods, wellness, lifestyle, and tech. The strategic design process adapts seamlessly to your niche.',
        },
        {
          q: 'What is your pricing structure?',
          a: 'Pricing is tailored to project scope and deliverables. Contact me directly for a transparent quote customized to your exact timeline and needs.',
        },
      ],
    },
    contact: {
      badge: 'Get In Touch',
      formTitle: 'Contact',
      formSub: 'Have an idea or project in mind? Send a message and let’s talk!',
      nameLabel: 'Full Name',
      namePlaceholder: 'Enter your full name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'name@email.com',
      messageLabel: 'Project Requirements / Message',
      messagePlaceholder: 'Tell me about your project, branding ideas, or packaging goals...',
      btnSubmit: 'Send Message',
      btnSending: 'Sending Message...',
      successTitle: 'Message Sent Successfully!',
      successDesc: 'Thank you for reaching out to SEZKY Studio. I will get back to you shortly.',
      btnSendAnother: 'Send Another Message',
      findMeTitle: 'FIND ME',
      cvCardTitle: 'Curriculum Vitae (CV)',
      cvCardDesc: 'View / Download PDF Resume',
      whatsappCardDesc: 'Direct Chat',
      emailCardDesc: 'Quick Response',
    },
    comments: {
      title: 'Comments',
      sub: 'Leave your thoughts, feedback, or say hi!',
      nameLabel: 'Name',
      namePlaceholder: 'Enter your name...',
      commentLabel: 'Message',
      commentPlaceholder: 'Write your message or comment here...',
      photoLabel: 'Profile Photo (Optional)',
      photoChange: 'Change photo',
      photoRemove: 'Remove',
      btnSubmit: 'Post Comment',
      btnSubmitting: 'Posting...',
      success: 'Comment posted successfully!',
      error: 'Failed to post comment. Please try again.',
      empty: 'No comments yet. Be the first to say hi!',
      pinnedBadge: 'Pinned',
      adminReplyLabel: 'SEZKY (Owner)',
    },
    modal: {
      title: "Let's Talk",
      sub: "Tell me about your project. I'll get back to you within 24 hours.",
      name: 'Your Name',
      email: 'Your Email',
      message: 'Message / Project Details',
      send: 'Send Message',
      sending: 'Sending...',
      close: 'Close',
      successTitle: 'Message Received!',
      successDesc: 'Thank you for reaching out. I will review your inquiry and reply promptly.',
    },
    footer: {
      designerRole: 'Brand Identity & Package Designer',
      allRights: 'All rights reserved.',
      backToTop: 'Back to top ↑',
    },
  },
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      portfolio: 'Portofolio',
      contact: 'Kontak',
      resume: 'Resume / CV',
      localTime: 'Waktu lokal',
      menu: 'Menu',
      skip: 'Lewati ke konten',
    },
    hero: {
      eyebrow: 'Desainer Identitas Merek & Kemasan',
      titleLine1: 'Branding yang',
      titleLine2: 'Anda butuhkan',
      titleLine3: 'Nyata & Terbukti',
      lead: 'Tingkatkan nilai bisnis Anda dengan desain identitas merek dan kemasan kustom. Ceritakan keunikan produk Anda melalui visual berani dan solusi desain strategis.',
      rating: '180+ proyek desain terselesaikan',
      letsTalk: 'Konsultasi Sekarang',
      viewWork: 'Lihat Karya',
      viewCv: 'Lihat CV ↗',
      carousel: [
        { c: 'Identitas Merek', h: 'Dirancang untuk selalu diingat.' },
        { c: 'Desain Kemasan', h: 'Dibuat untuk menarik perhatian.' },
        { c: 'Desain Mockup', h: 'Terlihat nyata sebelum diproduksi.' },
      ],
      sbarDesign: 'Desain branding & kemasan produk',
      sbarLocation: 'Berbasis di Jakarta, melayani klien global',
      sbarScroll: 'Gulir untuk menjelajah',
    },
    spotify: {
      title: 'Rotasi Harian',
      badge: 'Spotify',
      sub: 'Koleksi musik pilihan yang menemani fokus dan menginspirasi saya saat mendesain setiap karya.',
    },
    about: {
      badge: 'Tentang Saya',
      hiPrefix: 'Halo, Saya',
      hiName: 'SEZKY',
      hiDesc: 'Desainer Identitas Merek & Kemasan yang berfokus menciptakan merek berkarakter kuat dan pengalaman kemasan yang memikat.',
      viewCv: 'Unduh / Lihat CV',
      contactMe: 'Hubungi Saya',
      viewPortfolio: 'Lihat Portofolio',
      bioText:
        'Sebagai Desainer Brand & Kemasan, saya berfokus pada pengembangan identitas visual yang tidak hanya estetik, tetapi juga menghadirkan pengalaman visual yang kuat, strategis, dan berdampak nyata bagi pertumbuhan bisnis Anda.',
      eduTitle: 'Pendidikan & Latar Belakang',
      expTitle: 'Pengalaman Kerja',
      education: [
        {
          degree: 'Informatics Engineering (Backend & UI/UX Design)',
          institution: 'Universitas Bina Sarana Informatika',
          period: '2022 – 2026',
        },
        {
          degree: 'Sistem Desain, Prototyping & Arsitektur API',
          institution: 'UI/UX & Backend Masterclass',
          period: '2022 – 2026',
        },
      ],
      experience: [
        {
          role: 'Lead Desainer Identitas Merek & Kemasan',
          company: 'SEZKY Studio',
          period: '2023 – Sekarang',
        },
        {
          role: 'Desainer Kemasan & Sistem Visual',
          company: 'GreenLeaf & UrbanFit Co',
          period: '2021 – 2023',
        },
      ],
      metric1Number: '30+',
      metric1Title: 'Proyek Selesai',
      metric1Desc: 'Desain identitas merek & kemasan kustom untuk berbagai klien di Indonesia dan mancanegara.',
      metric2Number: '4+',
      metric2Title: 'Tahun Pengalaman',
      metric2Desc: 'Perjalanan berdedikasi dalam strategi merek, kemasan produk, dan antarmuka digital.',
      metric3Number: '99%',
      metric3Title: 'Kepuasan Klien',
      metric3Desc: 'Reputasi terbukti dalam kepuasan klien, ketepatan waktu pengiriman, dan presisi karya.',
    },
    createBand: {
      w1: 'Karya',
      w2: 'Nyata',
      w3: 'Berdampak',
    },
    portfolio: {
      title: 'Portofolio',
      tabProjects: 'Proyek',
      tabCertificates: 'Sertifikat',
      tabTechStack: 'Teknologi',
      filterAll: 'Semua',
      loading: 'Memuat data proyek...',
      loadError: 'Gagal memuat proyek. Menampilkan portofolio cadangan.',
      viewCaseStudy: 'Lihat Detail Proyek',
      liveDemo: 'Kunjungi Situs',
      showMore: 'Lihat Semua Proyek',
      showLess: 'Tampilkan Lebih Sedikit',
      noProjects: 'Belum ada proyek di kategori ini.',
      certIssuer: 'Diterbitkan oleh',
      certYear: 'Tahun',
      certPreview: 'Lihat Sertifikat',
    },
    services: {
      eyebrow: 'Layanan',
      titleLine1: 'Layanan desain yang',
      titleLine2: 'membuat merek Anda tampil unggul',
      items: [
        {
          number: '01',
          title: 'Identitas Merek',
          desc: 'Membangun identitas merek yang unik dan mudah diingat, mulai dari desain logo, palet warna, tipografi, hingga panduan visual komprehensif.',
        },
        {
          number: '02',
          title: 'Desain Kemasan',
          desc: 'Desain kemasan elegan dan bernilai jual tinggi yang langsung memikat calon pembeli di rak dan mengubah kesan pertama menjadi pelanggan setia.',
        },
        {
          number: '03',
          title: 'Desain Visual Brand',
          desc: 'Menghidupkan karakter merek Anda di setiap titik kontak promosi agar konsisten, profesional, dan berkelas.',
        },
        {
          number: '04',
          title: 'Desain Mockup 3D',
          desc: 'Visualisasi mockup produk dan kemasan 3D fotorealistis untuk memvisualisasikan wujud nyata produk Anda sebelum proses cetak/produksi.',
        },
      ],
    },
    process: {
      eyebrow: 'Alur Kerja',
      titleLine1: 'Proses yang jelas & terukur,',
      titleLine2: 'dari diskusi awal hingga hasil akhir',
      steps: [
        {
          number: '01',
          title: 'Pahami Visi Anda',
          desc: 'Ceritakan tentang produk, target audiens, dan tujuan bisnis Anda agar kita menyepakati arah konsep dan lingkup kerja sebelum memulai.',
        },
        {
          number: '02',
          title: 'Eksplorasi & Perancangan',
          desc: 'Kirimkan referensi atau kebutuhan spesifik Anda. Saya akan menyusun konsep visual, timeline, dan progres secara berkala.',
        },
        {
          number: '03',
          title: 'Penyelesaian & Pengiriman',
          desc: 'Pengiriman tepat waktu dengan detail maksimal: 2–3 hari untuk desain kemasan dan 1–2 minggu untuk paket identitas merek lengkap.',
        },
      ],
    },
    stats: {
      eyebrow: 'Pencapaian',
      title: 'Rekam jejak terbukti dalam desain visual merek',
      label1: 'Proyek desain',
      label2: 'Kepuasan klien',
      label3: 'Penghargaan industri',
      label4: 'Rating rata-rata',
    },
    whySezky: {
      eyebrow: 'Mengapa Memilih SEZKY',
      title: 'Presisi desain visual yang melipatgandakan nilai jual produk',
      subtitle: 'Lebih dari sekadar visual cantik: sistem identitas & kemasan yang dirancang strategis untuk memikat konsumen dan menonjol di etalase.',
      items: [
        {
          title: 'Pengerjaan Cepat & Responsif',
          tag: '2–3 Hari',
          desc: 'Konsep awal dan revisi mockup cepat dalam 2-3 hari kerja dengan alur komunikasi langsung tanpa birokrasi rumit.',
        },
        {
          title: 'Standar Siap Cetak Pabrik',
          tag: '100% Siap Cetak',
          desc: 'Garis pola (dieline) akurat, kalibrasi warna CMYK presisi, dan master file vektor tajam (AI, PDF, EPS) siap masuk mesin cetak.',
        },
        {
          title: 'Visualisasi Mockup 3D Nyata',
          tag: 'Fotorealistik',
          desc: 'Pratinjau 3D fotorealistik beresolusi tinggi sehingga Anda bisa melihat kemasan fisik produk sebelum mulai produksi massal.',
        },
        {
          title: 'Hak Komersial Penuh & Orisinil',
          tag: '100% Original',
          desc: 'Karya dibuat orisinil dari nol tanpa template pasaran, dilengkapi penyerahan hak cipta komersial penuh untuk bisnis Anda.',
        },
      ],
    },
    testimonials: {
      eyebrow: 'Testimoni Klien',
      title: 'Apa kata mereka',
      items: [
        {
          quote:
            'Luar biasa puas! SEZKY mengerjakan proyek desain ini dengan hasil yang sangat memukau dari awal hingga akhir. Apa yang saya bayangkan diwujudkan dengan sempurna, bahkan melampaui ekspektasi. Sangat merekomendasikan SEZKY!',
          name: 'Shula Aurellia',
          role: 'Shareholder, BOO Djimber (Djivar Oma)',
          initials: 'SA',
          photo: '/assets/images/testimonials/shula.jpg',
          projectTag: 'Identitas Brand & Visual',
        },
        {
          quote:
            'Proses kerjanya sangat kolaboratif dan komunikatif. Hasil akhirnya jauh melampaui ekspektasi kami. Desain kemasan kami kini sangat eye-catching di rak toko.',
          name: 'Amanda Putri',
          role: 'Founder, Kopi Senja',
          initials: 'AP',
          photo: '/assets/images/testimonials/amanda.jpg',
          projectTag: 'Desain Kemasan Cold Brew',
        },
        {
          quote:
            'Komunikasi cepat dan solutif, selesai tepat waktu, dan visual kemasan yang dibuat benar-benar mencerminkan standar brand premium modern.',
          name: 'Rizky Hadi',
          role: 'CEO, Finlyst',
          initials: 'RH',
          photo: '/assets/images/testimonials/rizky.jpg',
          projectTag: 'Sistem Visual Fintech',
        },
        {
          quote:
            'Rebranding kemasan produk kami langsung terasa dampaknya pada peningkatan penjualan ritel. Sangat direkomendasikan untuk pemilik bisnis yang ingin naik kelas.',
          name: 'Sari Wulandari',
          role: 'Owner, Nusa Skincare',
          initials: 'SW',
          photo: '/assets/images/testimonials/sari.jpg',
          projectTag: 'Desain Label Kosmetik',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      titleLine1: 'Pertanyaan yang sering',
      titleLine2: 'diajukan',
      items: [
        {
          q: 'Layanan apa saja yang Anda sediakan?',
          a: 'Saya berspesialisasi dalam Brand Identity dan Desain Kemasan Produk, didukung keahlian dalam desain UI/UX, mockup 3D, dan sistem visual digital.',
        },
        {
          q: 'Bagaimana cara memulai kerja sama proyek?',
          a: 'Cukup kirimkan pesan melalui formulir kontak atau WhatsApp. Kita akan mendiskusikan kebutuhan proyek, target waktu, dan estimasi biaya secara terbuka.',
        },
        {
          q: 'Aplikasi desain apa yang Anda gunakan?',
          a: 'Saya menggunakan Figma, Adobe Illustrator, Adobe Photoshop, Canva, Blender 3D, dan teknologi web modern untuk mewujudkan desain terbaik.',
        },
        {
          q: 'Berapa lama waktu pengerjaan proyek?',
          a: 'Umumnya 2–3 hari kerja untuk desain kemasan, dan 1–2 minggu untuk identitas merek menyeluruh tergantung kompleksitas dan jumlah revisi.',
        },
        {
          q: 'Apakah ada garansi revisi?',
          a: 'Tentu! Setiap proyek mencakup sesi revisi bertahap untuk memastikan hasil akhir benar-benar memuaskan dan sesuai visi Anda.',
        },
        {
          q: 'Industri apa saja yang bisa Anda bantu?',
          a: 'Saya telah menangani brand di bidang kuliner (F&B), produk retail, fashion, skincare, dan teknologi. Metode desain disesuaikan dengan karakteristik audiens Anda.',
        },
        {
          q: 'Bagaimana skema biaya jasanya?',
          a: 'Biaya disesuaikan dengan ruang lingkup dan kebutuhan spesifik proyek Anda. Hubungi saya langsung untuk mendapatkan penawaran yang transparan.',
        },
      ],
    },
    contact: {
      badge: 'Hubungi Saya',
      formTitle: 'Hubungi',
      formSub: 'Ada yang ingin didiskusikan? Langsung kirim pesan, mari wujudkan ide brilian Anda!',
      nameLabel: 'Nama Lengkap',
      namePlaceholder: 'Masukkan nama lengkap Anda',
      emailLabel: 'Alamat Email',
      emailPlaceholder: 'nama@email.com',
      messageLabel: 'Pesan / Kebutuhan Proyek',
      messagePlaceholder: 'Ceritakan tentang proyek, rencana branding, atau kemasan yang Anda butuhkan...',
      btnSubmit: 'Kirim Pesan',
      btnSending: 'Mengirim Pesan...',
      successTitle: 'Pesan Berhasil Terkirim!',
      successDesc: 'Terima kasih sudah menghubungi SEZKY Studio. Saya akan segera membalas pesan Anda.',
      btnSendAnother: 'Kirim Pesan Lainnya',
      findMeTitle: 'KONTAK LANGSUNG',
      cvCardTitle: 'Curriculum Vitae (CV)',
      cvCardDesc: 'Lihat / Unduh Resume PDF',
      whatsappCardDesc: 'Chat Langsung',
      emailCardDesc: 'Respon Cepat',
    },
    comments: {
      title: 'Komentar',
      sub: 'Tinggalkan jejak, pesan kesan, atau sekadar sapa!',
      nameLabel: 'Nama Lengkap',
      namePlaceholder: 'Masukkan nama Anda...',
      commentLabel: 'Komentar',
      commentPlaceholder: 'Tuliskan pesan atau kesan Anda di sini...',
      photoLabel: 'Foto Profil (Opsional)',
      photoChange: 'Ganti foto',
      photoRemove: 'Hapus',
      btnSubmit: 'Kirim Komentar',
      btnSubmitting: 'Mengirim...',
      success: 'Komentar berhasil dikirim!',
      error: 'Gagal mengirim komentar. Silakan coba lagi.',
      empty: 'Belum ada komentar. Jadilah yang pertama menyapa!',
      pinnedBadge: 'Disematkan',
      adminReplyLabel: 'SEZKY (Owner)',
    },
    modal: {
      title: 'Mari Berdiskusi',
      sub: 'Ceritakan tentang ide proyek Anda. Saya akan merespons dalam waktu 24 jam.',
      name: 'Nama Anda',
      email: 'Email Anda',
      message: 'Detail Proyek / Pesan',
      send: 'Kirim Pesan',
      sending: 'Mengirim...',
      close: 'Tutup',
      successTitle: 'Pesan Diterima!',
      successDesc: 'Terima kasih telah menghubungi. Saya akan meninjau pesan Anda dan segera membalas.',
    },
    footer: {
      designerRole: 'Desainer Identitas Merek & Kemasan',
      allRights: 'Hak cipta dilindungi undang-undang.',
      backToTop: 'Kembali ke atas ↑',
    },
  },
};
