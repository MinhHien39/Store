/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  import { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}
