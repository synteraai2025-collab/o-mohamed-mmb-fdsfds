import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxury Hotel Experience - Book Your Perfect Stay",
  description: "Discover unparalleled comfort and exceptional service at our luxury hotel. Located in the heart of the city with world-class amenities, fine dining, and premium accommodations.",
  keywords: ["luxury hotel", "hotel booking", "premium accommodation", "city center hotel", "fine dining", "spa", "business travel", "vacation stay"],
  authors: [{ name: "Luxury Hotel Team" }],
  creator: "Luxury Hotel",
  publisher: "Luxury Hotel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://3000-4b8e61d8-28e5-4fd1-8ac8-24a8ebe74801.proxy.syntera-happybox.obelion.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Luxury Hotel Experience - Book Your Perfect Stay",
    description: "Discover unparalleled comfort and exceptional service at our luxury hotel. Located in the heart of the city with world-class amenities, fine dining, and premium accommodations.",
    url: "https://3000-4b8e61d8-28e5-4fd1-8ac8-24a8ebe74801.proxy.syntera-happybox.obelion.ai",
    siteName: "Luxury Hotel Experience",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Luxury hotel exterior view",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Hotel Experience - Book Your Perfect Stay",
    description: "Discover unparalleled comfort and exceptional service at our luxury hotel. Located in the heart of the city with world-class amenities, fine dining, and premium accommodations.",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better SEO and mobile experience */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#d97706" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Luxury Hotel" />
        
        {/* Schema.org structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              "name": "Luxury Hotel Experience",
              "description": "Discover unparalleled comfort and exceptional service at our luxury hotel",
              "url": "https://3000-4b8e61d8-28e5-4fd1-8ac8-24a8ebe74801.proxy.syntera-happybox.obelion.ai",
              "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "City Center",
                "addressRegion": "State",
                "addressCountry": "US"
              },
              "telephone": "+1-555-HOTEL",
              "priceRange": "$$$",
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Free WiFi",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification", 
                  "name": "Swimming Pool",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Spa",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Restaurant",
                  "value": true
                }
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
