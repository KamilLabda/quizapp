import Script from 'next/script';

/**
 * Load Video.js and IMA plugin for VAST/Adcash in-stream ads.
 * Order: Video.js → IMA SDK → videojs-ima.
 */
export default function VideoAdPlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        href="https://vjs.zencdn.net/8.10.0/video-js.css"
        rel="stylesheet"
      />
      <Script
        src="https://vjs.zencdn.net/8.10.0/video.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/2.3.0/videojs.ima.min.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
