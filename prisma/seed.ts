import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing database
  await prisma.navigationItem.deleteMany({});
  await prisma.homepageSection.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.bookReview.deleteMany({});
  await prisma.bookPurchaseLink.deleteMany({});
  await prisma.bookImage.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.work.deleteMany({});
  await prisma.galleryMedia.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.page.deleteMany({});

  console.log('Cleaned old records.');

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Shahid Fayaz',
      email: 'admin@shahidfayaz.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 3. Create Settings
  const settingsData = [
    { key: 'site_name', value: 'Shahid Fayaz', type: 'text', group: 'general', label: 'Site Name' },
    { key: 'site_title', value: 'Shahid Fayaz | Author, Philosopher & Thinker', type: 'text', group: 'general', label: 'Site Title' },
    { key: 'meta_description', value: 'The official literary archive and portal of Shahid Fayaz, presenting books, essays, research contributions, and philosophical works.', type: 'textarea', group: 'seo', label: 'Meta Description' },
    { key: 'meta_keywords', value: 'Shahid Fayaz, Author, Philosopher, Literature, Research, Essays, Echoes of the Valley, The Anatomy of Silences', type: 'text', group: 'seo', label: 'Meta Keywords' },
    { key: 'contact_email', value: 'contact@shahidfayaz.com', type: 'text', group: 'contact', label: 'Contact Email' },
    { key: 'contact_phone', value: '+44 20 7946 0958', type: 'text', group: 'contact', label: 'Contact Phone' },
    { key: 'contact_address', value: 'Kensington, London, UK', type: 'textarea', group: 'contact', label: 'Contact Address' },
    { key: 'social_twitter', value: 'https://twitter.com/shahidfayaz', type: 'text', group: 'social', label: 'Twitter URL' },
    { key: 'social_instagram', value: 'https://instagram.com/shahidfayaz', type: 'text', group: 'social', label: 'Instagram URL' },
    { key: 'social_linkedin', value: 'https://linkedin.com/in/shahidfayaz', type: 'text', group: 'social', label: 'LinkedIn URL' },
    { key: 'bio_short', value: 'Shahid Fayaz is an acclaimed author, philosopher, and social theorist whose work interrogates the intersections of geopolitical borderlands, silence as resistance, and post-colonial identities.', type: 'textarea', group: 'appearance', label: 'Short Biography' },
    { key: 'accent_color', value: '#23483B', type: 'color', group: 'appearance', label: 'Accent Color' },
  ];

  for (const set of settingsData) {
    await prisma.setting.create({ data: set });
  }
  console.log('Created global settings.');

  // 4. Create Categories
  const catPhilosophy = await prisma.category.create({
    data: { name: 'Philosophy & Ethics', slug: 'philosophy-ethics', type: 'book', description: 'Philosophical treatises and ethics essays.' },
  });
  const catFiction = await prisma.category.create({
    data: { name: 'Literary Fiction', slug: 'literary-fiction', type: 'book', description: 'Novels and anthologies.' },
  });
  const catEssays = await prisma.category.create({
    data: { name: 'Essays & Commentary', slug: 'essays-commentary', type: 'article', description: 'Short essays on contemporary society.' },
  });
  const catResearch = await prisma.category.create({
    data: { name: 'Research Papers', slug: 'research-papers', type: 'article', description: 'Peer-reviewed articles and policy briefs.' },
  });
  const catEvents = await prisma.category.create({
    data: { name: 'Book Signings & Events', slug: 'events', type: 'gallery', description: 'Moments from events worldwide.' },
  });
  console.log('Created categories.');

  // 5. Create Books
  const book1 = await prisma.book.create({
    data: {
      title: 'Echoes of the Valley',
      slug: 'echoes-of-the-valley',
      subtitle: 'A Memoir of Silence and Belonging',
      categoryId: catFiction.id,
      description: 'A deeply moving narrative exploring post-colonial memory, language, and geography in the high valleys. A poignant look at how cultural history is preserved in the oral traditions and silence of its people.',
      synopsis: 'Set against the backdrop of a changing landscape, Echoes of the Valley traces the lives of three generations trying to hold onto ancestral languages and identities. It is both a family saga and a philosophical meditation on geography and belonging.',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
      isbn: '978-0-123456-78-9',
      price: 24.99,
      currency: 'USD',
      publicationDate: new Date('2024-03-15'),
      pages: 312,
      language: 'English',
      publisher: 'HarperCollins Editorial',
      format: 'Hardcover',
      praise: '“A literary triumph. Shahid Fayaz writes with the precision of a surgeon and the soul of a poet.” — The Times Literary Supplement',
      excerpts: 'The valley did not speak in words; it spoke in the long, low shadows that crept down from the mountains at dusk...',
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
      metaTitle: 'Echoes of the Valley | Book by Shahid Fayaz',
      metaDescription: 'Discover Echoes of the Valley, the acclaimed memoir and novel by Shahid Fayaz exploring memory, silence, and post-colonial geography.',
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'The Anatomy of Silences',
      slug: 'the-anatomy-of-silences',
      subtitle: 'Political Resistance and the Unsaid',
      categoryId: catPhilosophy.id,
      description: 'A pioneering philosophical work on how silent spaces function as active mechanisms of political and cultural resistance in authoritarian spaces.',
      synopsis: 'The Anatomy of Silences presents a new framework for analyzing language, power, and resistance. Fayaz argues that silence is not merely the absence of speech, but a deliberate, structured linguistic act that shields communities from external surveillance and assimilation.',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
      isbn: '978-0-987654-32-1',
      price: 28.50,
      currency: 'USD',
      publicationDate: new Date('2025-01-10'),
      pages: 420,
      language: 'English',
      publisher: 'Oxford Philosophical Press',
      format: 'Hardcover',
      praise: '“An outstanding philosophical contribution that redefines our understanding of political discourse.” — Academic Review of Philosophy',
      excerpts: 'In the grammar of hegemony, speech is often structured to demand compliance. Thus, the only sovereign territory left is the unuttered...',
      isFeatured: true,
      isPublished: true,
      sortOrder: 2,
      metaTitle: 'The Anatomy of Silences | Shahid Fayaz',
      metaDescription: 'Read the latest philosophical treatise by Shahid Fayaz on political resistance and the strategic use of silence.',
    },
  });

  console.log('Created books.');

  // Create Book Reviews
  await prisma.bookReview.create({
    data: {
      bookId: book1.id,
      reviewerName: 'Dr. Evelyn Vance',
      reviewerSource: 'London Review of Books',
      content: 'Fayaz has crafted a masterpiece of modern literature. The prose is lush, demanding, and ultimately unforgettable.',
      rating: 5,
      isFeatured: true,
    },
  });

  await prisma.bookReview.create({
    data: {
      bookId: book2.id,
      reviewerName: 'Prof. Marcus Chen',
      reviewerSource: 'Contemporary Political Philosophy Journal',
      content: 'A vital read for anyone studying resistance. Fayaz provides a profound conceptual vocabulary for the spaces between words.',
      rating: 5,
      isFeatured: true,
    },
  });

  // Create Book Purchase Links
  await prisma.bookPurchaseLink.create({
    data: { bookId: book1.id, storeName: 'Amazon', url: 'https://amazon.com', priceLabel: '$24.99' },
  });
  await prisma.bookPurchaseLink.create({
    data: { bookId: book1.id, storeName: 'Bookshop.org', url: 'https://bookshop.org', priceLabel: '$23.75' },
  });
  await prisma.bookPurchaseLink.create({
    data: { bookId: book2.id, storeName: 'Amazon', url: 'https://amazon.com', priceLabel: '$28.50' },
  });

  // 6. Create Articles
  await prisma.article.create({
    data: {
      title: 'The Philosophy of Quiet Activism',
      slug: 'philosophy-of-quiet-activism',
      categoryId: catEssays.id,
      userId: admin.id,
      excerpt: 'In an age dominated by performative noise, this essay explores how deliberate quietness and strategic withdrawal form the core of authentic long-term activism.',
      body: `<h2>Introduction</h2>
<p>Our contemporary public sphere is loud. Social media algorithms reward immediate, high-volume expressions of outrage, creating a landscape of performative noise. But history suggests that the most durable shifts in social consciousness are often incubated in silent, deliberate spaces.</p>

<blockquote>"True power does not need to shout. It is the quiet river that shapes the canyon, not the sudden thunderclap."</blockquote>

<h2>The Limits of Performative Noise</h2>
<p>When communication becomes instantaneous and compulsory, its currency is devalued. Performative noise operates on the surface; it satisfies the immediate psychological need to be seen taking a side, but it rarely restructures the underlying power dynamics. Strategic silence, on the other hand, is a refusal to participate in the terms set by the oppressor.</p>

<h2>Quietness as Subversion</h2>
<p>Quiet activism is not passivity. It is an intentional withdrawal of attention from dominant structures, and the redirecting of that energy into localized, deep community building. By speaking less and listening more, we build the networks of trust required for sustainable resistance.</p>
<p>To cultivate quiet activism, one must embrace three key practices: deep study, refusal of instant feedback loops, and local cooperation. Only then does our work carry weight.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
      readingTime: 6,
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
      metaTitle: 'The Philosophy of Quiet Activism | Shahid Fayaz Essay',
      metaDescription: 'Read Shahid Fayaz’s essay on how strategic silence and quietness form the core of authentic long-term social activism.',
    },
  });

  await prisma.article.create({
    data: {
      title: 'Decentralized Literature in the Digital Age',
      slug: 'decentralized-literature-digital-age',
      categoryId: catResearch.id,
      userId: admin.id,
      excerpt: 'An investigation into how digital archives and decentralized platforms can protect dissident literature from centralized censorship and algorithmic filtering.',
      body: `<h2>Censorship and the Modern Web</h2>
<p>As internet infrastructure has become increasingly centralized in the hands of a few gatekeepers, the risk of systemic censorship has grown exponentially. Dissident voices, once threatened by direct government bans, are now quietly suppressed via algorithmic demotion and shadowbans.</p>
<h2>The Decentralized Repository</h2>
<p>By leveraging peer-to-peer storage systems and cryptographically secured distributed networks, writers can publish works that are mathematically impossible to erase. This shift represents a return to the samizdat tradition, but with global reach and instant accessibility.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
      readingTime: 8,
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2024-06-20'),
      metaTitle: 'Decentralized Literature in the Digital Age | Research by Shahid Fayaz',
      metaDescription: 'A research article exploring peer-to-peer systems, dissident writing, and the samizdat traditions of the future.',
    },
  });

  console.log('Created articles.');

  // 7. Create Works
  await prisma.work.create({
    data: {
      title: 'The Geopolitics of Himalayan Enclaves',
      slug: 'geopolitics-himalayan-enclaves',
      type: 'research',
      description: 'A comprehensive political research project documenting human rights, economic dependencies, and border shifts in the sub-Himalayan enclaves. Funded by the Global Humanities Council.',
      externalLink: 'https://example.org/research',
      date: new Date('2023-11-01'),
      tags: 'Geopolitics,Border Studies,Human Rights',
      isPublished: true,
      sortOrder: 1,
    },
  });

  await prisma.work.create({
    data: {
      title: 'The Oral Archives of Border Communities',
      slug: 'oral-archives-border-communities',
      type: 'social',
      description: 'A community-led project recording oral histories and songs from elder residents along borders, preserving languages that are rapidly disappearing.',
      externalLink: 'https://example.org/archive',
      date: new Date('2024-05-10'),
      tags: 'Oral History,Linguistics,Cultural Preservation',
      isPublished: true,
      sortOrder: 2,
    },
  });

  console.log('Created works.');

  // 8. Create Galleries
  const gallery1 = await prisma.gallery.create({
    data: {
      title: 'Echoes of the Valley Book Launch',
      slug: 'echoes-launch-london',
      description: 'Moments from the official book launch and reading at the London Literary Society in April 2024.',
      type: 'photo',
      album: 'London Launch 2024',
      categoryId: catEvents.id,
      isPublished: true,
      sortOrder: 1,
    },
  });

  await prisma.galleryMedia.create({
    data: {
      galleryId: gallery1.id,
      filePath: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
      type: 'image',
      caption: 'Shahid Fayaz in conversation with broadcaster Clare Higgins at the London Literary Society.',
      altText: 'Author reading event',
      sortOrder: 1,
    },
  });

  await prisma.galleryMedia.create({
    data: {
      galleryId: gallery1.id,
      filePath: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800',
      type: 'image',
      caption: 'The audience listening to the reading of Chapter 4 of Echoes of the Valley.',
      altText: 'Audience at reading',
      sortOrder: 2,
    },
  });

  console.log('Created gallery and media items.');

  // 9. Create Pages
  await prisma.page.create({
    data: {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      body: '<h1>Privacy Policy</h1><p>We respect your privacy. This website does not track or collect personal data, except for information explicitly provided by you in the contact and newsletter forms.</p>',
      isPublished: true,
      metaTitle: 'Privacy Policy | Shahid Fayaz',
      metaDescription: 'Privacy policy for the official website of author Shahid Fayaz.',
    },
  });

  await prisma.page.create({
    data: {
      title: 'Terms of Service',
      slug: 'terms',
      body: '<h1>Terms of Service</h1><p>All content on this website, including book excerpts and essays, is the intellectual property of Shahid Fayaz unless otherwise stated. You may quote sections with appropriate attribution.</p>',
      isPublished: true,
      metaTitle: 'Terms of Service | Shahid Fayaz',
      metaDescription: 'Terms of service for the official website of author Shahid Fayaz.',
    },
  });

  // 10. Create Homepage Sections
  const sections = [
    {
      key: 'hero',
      title: 'Writing the Spaces Between Silences',
      subtitle: 'Shahid Fayaz',
      content: 'An acclaimed author, philosopher, and social thinker examining geopolitical memory, language, and the power of the unsaid.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', // Editorial portrait placeholder
      buttonText: 'Explore Books',
      buttonLink: '/books',
      extraData: JSON.stringify({
        philosophy_quote: 'Silence is not the absence of voice, but a sovereign territory.',
        portrait_caption: 'Shahid Fayaz, London, 2025'
      }),
      isVisible: true,
      sortOrder: 1,
    },
    {
      key: 'about_preview',
      title: 'A Life Dedicated to Ideas',
      subtitle: 'Biography Brief',
      content: 'Shahid Fayaz is a post-colonial scholar and writer whose novels and philosophical treatises examine borders, language loss, and political resistance. Born in the sub-Himalayan valleys, he has spent decades recording oral archives and lecturing globally.',
      buttonText: 'Read Full Story',
      buttonLink: '/about',
      isVisible: true,
      sortOrder: 2,
    },
    {
      key: 'quote',
      title: 'The Sovereign Territory',
      subtitle: 'Philosophical Anchor',
      content: '“He who controls the grammar of power dictates what can be spoken. Therefore, silence is not merely a retreat; it is the final, unassailable fortress of human sovereignty.”',
      isVisible: true,
      sortOrder: 3,
    }
  ];

  for (const sec of sections) {
    await prisma.homepageSection.create({ data: sec });
  }

  // 11. Create Navigation
  const navItems = [
    { label: 'Home', url: '/', location: 'header', sortOrder: 1 },
    { label: 'Books', url: '/books', location: 'header', sortOrder: 2 },
    { label: 'About', url: '/about', location: 'header', sortOrder: 3 },
    { label: 'Works', url: '/works', location: 'header', sortOrder: 4 },
    { label: 'Gallery', url: '/gallery', location: 'header', sortOrder: 5 },
    { label: 'Articles', url: '/articles', location: 'header', sortOrder: 6 },
    { label: 'Contact', url: '/contact', location: 'header', sortOrder: 7 },

    { label: 'Privacy Policy', url: '/privacy-policy', location: 'footer', sortOrder: 1 },
    { label: 'Terms of Service', url: '/terms', location: 'footer', sortOrder: 2 },
  ];

  for (const nav of navItems) {
    await prisma.navigationItem.create({ data: nav });
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
