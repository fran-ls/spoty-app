import { getDeviceType } from "./getDeviceType";

const device = getDeviceType();
const isDesktop = device === 'desktop';

export const STYLES = {
  heightHeader: 64,
  heightFooter: 88,
  maxHeightMain: isDesktop ? 'max-h-[calc(100dvh-64px-88px)]' : 'max-h-[calc(100dvh-64px-52px-56px)]',
  minHeightMain: isDesktop ? 'min-h-[calc(100dvh-64px-88px)]' : 'min-h-[calc(100dvh-64px-52px-56px)]'
} as const;