export type TrustedLogo = {
  alt: string;
  src: string;
  widthRem: number;
  heightRem?: number;
  scale?: number;
};

export const trustedLogos: TrustedLogo[] = [
  { alt: 'World Bank', src: '/logos/trusted-portfolio/world-bank.png', widthRem: 6.1, heightRem: 2.45 },
  { alt: 'UNIDO', src: '/logos/trusted-portfolio/unido-real.svg', widthRem: 5.8, heightRem: 2.4, scale: 1.02 },
  { alt: 'FCDO', src: '/logos/trusted-portfolio/fcdo-real.svg', widthRem: 5.6, heightRem: 2.55, scale: 1.04 },
  { alt: 'GIZ', src: '/logos/trusted-portfolio/giz-real.svg', widthRem: 4.5, heightRem: 2.55, scale: 1.04 },
  { alt: 'USAID', src: '/logos/trusted-portfolio/usaid-real.png', widthRem: 6.5, heightRem: 2.45 },
  { alt: 'UNICEF', src: '/logos/trusted-portfolio/unicef.png', widthRem: 6.8, heightRem: 2.45 },
  { alt: 'Meta', src: '/logos/trusted-portfolio/meta.png', widthRem: 8.2, heightRem: 2.4 },
  { alt: 'UNODC', src: '/logos/trusted-portfolio/unodc-real.svg', widthRem: 6.8, heightRem: 2.45, scale: 1.02 },
  { alt: 'USIP', src: '/logos/trusted-portfolio/usip-real.svg', widthRem: 6.4, heightRem: 2.45, scale: 1.02 },
  { alt: 'Adam Smith International', src: '/logos/trusted-portfolio/asi-real.svg', widthRem: 5.1, heightRem: 2.45, scale: 1.04 },
  { alt: 'Oxford Policy Management', src: '/logos/trusted-portfolio/opm-real.svg', widthRem: 8.8, heightRem: 2.35, scale: 1.02 },
];
