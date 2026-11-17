export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoText: string;
  color: string;
}

export interface SiteConfig {
  name: string;
  brandTagline: string;
  shortDescription: string;
  aboutText: string;
  aboutHighlight: string;
  category: string;
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  contact: {
    address: string;
    city: string;
    country: string;
    whatsapp: string;
    whatsappRaw: string;
    email: string;
    openingHours: string;
    googleMapsUrl: string;
    googleMapsEmbedUrl: string;
  };
  bankAccounts: BankAccount[];
  navigation: Array<{
    label: string;
    href: string;
  }>;
  trustBadges: string[];
  strengths: Array<{
    number: string;
    icon: string;
    title: string;
    description: string;
  }>;
  products: Array<{
    id: string;
    badge: string;
    badgeVariant: 'powder' | 'butter' | 'warm' | 'toasted';
    priceInfo: string;
    name: string;
    description: string;
    image: string;
    alt: string;
    tags?: string[];
    servingTip?: string;
    ctaText: string;
    ctaHref: string;
  }>;
  articles: Array<{
    id: string;
    tag: string;
    tagVariant: 'butter' | 'powder' | 'warm';
    date: string;
    title: string;
    excerpt: string;
    slug: string;
  }>;
  socials: Array<{
    platform: string;
    icon: string;
    href: string;
  }>;
}

export const siteConfig: SiteConfig = {
  name: "Ricake",
  brandTagline: "Manisnya Momen, Hangatnya Buatan Rumah.",
  shortDescription: "Dari churros frozen hingga aneka bolu, brownies, dan soft cookies, Ricake menghadirkan pilihan homemade untuk menemani momen santai dan hari-hari spesialmu.",
  aboutText: "Ricake adalah brand homemade yang menghadirkan aneka camilan dan kue untuk dinikmati dalam berbagai suasana. Mulai dari churros frozen yang praktis, bolu dengan pilihan rasa favorit, brownies, hingga soft cookies. Kami ingin menghadirkan pilihan camilan yang bisa menemani waktu santai, berkumpul bersama keluarga, maupun momen spesial bersama orang-orang terdekat.",
  aboutHighlight: "Crafted with Heart in Small Batches",
  category: "Homemade Bakery",
  logo: {
    src: "/images/ricake-logo.png",
    alt: "Ricake Homemade Bakery Logo",
    width: 140,
    height: 48,
  },
  contact: {
    address: "Indo Alam Residence Citayam, Ragajaya, Bojonggede, Bogor, Jawa Barat 16920",
    city: "Bogor / Depok",
    country: "Indonesia",
    whatsapp: "+62 812-3456-7890",
    whatsappRaw: "6281234567890",
    email: "halo@ricakebakery.com",
    openingHours: "Senin - Sabtu: 07.30 - 18.00 WIB",
    googleMapsUrl: "https://maps.app.goo.gl/68xM6GscVb6JGMhT9",
    // Embed Google Maps generated from coordinate -6.4443556, 106.7726671 (Indo Alam Residence Citayam)
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=-6.4443556,106.7726671&hl=id&z=16&output=embed",
  },
  bankAccounts: [
    {
      bankName: "BCA (Bank Central Asia)",
      accountNumber: "8410293847",
      accountHolder: "Ricake Bakery / Dhabith",
      logoText: "BCA",
      color: "bg-[#00529C] text-white",
    },
    {
      bankName: "Bank Mandiri",
      accountNumber: "1570008923412",
      accountHolder: "Ricake Bakery / Dhabith",
      logoText: "MANDIRI",
      color: "bg-[#002D62] text-white",
    },
    {
      bankName: "Bank Syariah Indonesia (BSI)",
      accountNumber: "7192837465",
      accountHolder: "Ricake Bakery / Dhabith",
      logoText: "BSI",
      color: "bg-[#00A39D] text-white",
    },
  ],
  navigation: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "News", href: "#news" },
    { label: "Contact", href: "#contact" },
  ],
  trustBadges: [
    "100% Real Butter",
    "Freshly Baked Daily",
    "Tanpa Pengawet",
  ],
  strengths: [
    {
      number: "01",
      icon: "cottage",
      title: "Homemade Character",
      description: "Pilihan camilan dan kue dari brand rumahan dengan sentuhan yang personal dan penuh kehangatan.",
    },
    {
      number: "02",
      icon: "cookie",
      title: "More to Enjoy",
      description: "Beragam pilihan produk lezat, mulai dari churros frozen hingga aneka bolu, brownies, dan soft cookies.",
    },
    {
      number: "03",
      icon: "cake",
      title: "Custom Orders",
      description: "Ada kebutuhan kue tertentu? Kamu bisa menghubungi Ricake untuk mendiskusikan pesanan custom impianmu.",
    },
  ],
  products: [
    {
      id: "churros-frozen",
      badge: "FROZEN TREATS",
      badgeVariant: "powder",
      priceInfo: "Mulai dari Rp25.000 / 2 box",
      name: "Churros Frozen",
      description: "Churros praktis dalam kemasan frozen untuk dinikmati di rumah. Simpan dalam keadaan frozen, lalu goreng saat ingin disajikan untuk kerenyahan sempurna.",
      image: "/images/products/churros.jpg",
      alt: "Artisan churros sticks crispy dengan saus dipping coklat",
      tags: [
        "Coklat Belgia",
        "Mango Puree",
        "Matcha Green Tea",
        "Strawberry Bliss",
        "Roasted Pistachio",
        "Tiramisu Crema",
      ],
      servingTip: "Goreng langsung pada minyak panas selama 2-3 menit hingga keemasan.",
      ctaText: "Order Churros",
      ctaHref: "#contact",
    },
    {
      id: "custom-bolu",
      badge: "HOMEMADE CAKES",
      badgeVariant: "butter",
      priceInfo: "Tersedia Custom Size",
      name: "Custom Bolu",
      description: "Punya rasa bolu favorit atau kebutuhan kue untuk momen perayaan? Ricake menerima pertanyaan dan pesanan bolu custom sesuai pilihan: Bolu Keju Melimpah, Bolu Pisang Wangi, dan Bolu Cokelat Lembut.",
      image: "/images/products/bolu.jpg",
      alt: "Fluffy bolu cake dengan taburan keju dan pisang",
      servingTip: "Bisa custom tulisan topper & packaging hampers.",
      ctaText: "Create a Cake Order",
      ctaHref: "#contact",
    },
    {
      id: "brownies",
      badge: "CHOCOLATE TREATS",
      badgeVariant: "warm",
      priceInfo: "Fudgy & Shiny Crust",
      name: "Fudgy Brownies",
      description: "Pilihan camilan cokelat fudgy untuk menemani waktu santai atau dibagikan bersama orang tersayang. Dibuat dengan dark cocoa premium dan taburan topping melimpah.",
      image: "/images/products/brownies.jpg",
      alt: "Brownies cokelat potong dengan permukaan crinkly shiny crust",
      ctaText: "Ask About Brownies",
      ctaHref: "#contact",
    },
    {
      id: "soft-cookies",
      badge: "COOKIE COLLECTION",
      badgeVariant: "toasted",
      priceInfo: "Lumer & Lembut",
      name: "Artisan Soft Cookies",
      description: "Cookies bertekstur lembut dan lumer untuk teman ngemil, menemani waktu belajar, bekerja, atau berkumpul santai bersama kerabat terdekat di sore hari.",
      image: "/images/products/cookies.jpg",
      alt: "Soft baked cookies dengan coklat leleh di bagian tengah",
      ctaText: "Ask About Soft Cookies",
      ctaHref: "#contact",
    },
  ],
  articles: [
    {
      id: "1",
      tag: "BRAND STORY",
      tagVariant: "butter",
      date: "12 Okt 2024",
      title: "Meet Ricake: A Little Homemade Happiness",
      excerpt: "Kenali Ricake, brand homemade yang menghadirkan churros frozen, aneka bolu, brownies, dan soft cookies untuk menemani momen manismu.",
      slug: "meet-ricake-a-little-homemade-happiness",
    },
    {
      id: "2",
      tag: "PRODUCT SPOTLIGHT",
      tagVariant: "powder",
      date: "28 Sep 2024",
      title: "Churros Frozen: Your Favorite Treat, Ready When You Are",
      excerpt: "Kenali pilihan rasa Churros Frozen Ricake dan cara menikmati churros hangat renyah setelah digoreng di rumah bersama secangkir kopi.",
      slug: "churros-frozen-ready-when-you-are",
    },
    {
      id: "3",
      tag: "CUSTOM ORDER",
      tagVariant: "warm",
      date: "15 Sep 2024",
      title: "Make Your Moment Sweeter with a Custom Cake",
      excerpt: "Dari bolu keju hingga bolu cokelat, cari tahu pilihan pesanan bolu custom yang bisa kamu tanyakan kepada Ricake untuk acara keluarga.",
      slug: "make-your-moment-sweeter-with-custom-cake",
    },
  ],
  socials: [
    { platform: "Instagram", icon: "photo_camera", href: "https://instagram.com" },
    { platform: "WhatsApp", icon: "chat_bubble", href: "https://wa.me/6281234567890" },
    { platform: "Email", icon: "mail", href: "mailto:halo@ricakebakery.com" },
  ],
};
