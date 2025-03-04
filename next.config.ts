import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "lsco.scene7.com" },
      { protocol: "https", hostname: "www.lego.com" },
      { protocol: "https", hostname: "images.samsung.com" },
      { protocol: "https", hostname: "i5.walmartimages.com" },
      { protocol: "https", hostname: "images.tokopedia.net" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "static.nike.com" },
      { protocol: "https", hostname: "encrypted-tbn2.gstatic.com" },
      { protocol: "https", hostname: "encrypted-tbn3.gstatic.com" },
      { protocol: "https", hostname: "www.mixandgrind.com.au" },
      { protocol: "https", hostname: "encrypted-tbn1.gstatic.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "product-images.weber.com" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "down-id.img.susercontent.com" },
      { protocol: "https", hostname: "cdn.builder.io" },
    ],
    domains: ["lh3.googleusercontent.com", "i.ibb.co"],
  },
};

export default nextConfig;
