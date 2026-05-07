import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export function SEO({ title, description, keywords, ogImage }: SEOProps) {
  const baseTitle = 'PT Kekar Jaya Security | Security Services';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const defaultDesc = 'PT Kekar Jaya Security adalah perusahaan penyedia jasa pengamanan terkemuka yang memberikan layanan keamanan profesional dan terpercaya.';
  const defaultKeywords = 'keamanan, security, satpam, pt kekar jaya security, pengamanan, jasa keamanan';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}
