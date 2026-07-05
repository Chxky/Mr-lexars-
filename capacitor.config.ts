import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mrlexar.transport',
  appName: 'MR Lexars',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0B0B0C',
      androidScaleType: 'CENTER_CROP',
    },
  },
};

export default config;
