/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'nypost.com', 
      'img.webmd.com',
      'www.healthline.com',
      'media.cnn.com',
      'cdn.cnn.com',
      'healthblog.uofmhealth.org',
      'www.mayoclinic.org',
      'www.health.harvard.edu',
      'static01.nyt.com',
      'www.nih.gov',
      'www.cdc.gov',
      's.yimg.com',
      'media.npr.org',
      'images.everydayhealth.com',
      'assets.medpagetoday.net',
      'www.medicalnewstoday.com',
      'images.theconversation.com',
      'www.washingtonpost.com',
      'i.insider.com',
      'www.statnews.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Properly configure experimental features
  experimental: {
    // Enable server actions which implicitly supports middleware
    serverActions: true,
  }
};

module.exports = nextConfig; 