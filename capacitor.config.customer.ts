import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cyber10xtech.safesightcustomer',
  appName: 'Safesight Customer',
  webDir: 'dist',
  server: {
    url: 'https://e0223ea6-6a9e-4635-95ad-ee74eddc58bb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
