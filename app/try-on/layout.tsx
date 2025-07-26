export default function TryOnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link 
        rel="preload"
        href="https://aframe.io/releases/1.5.0/aframe.min.js"
        as="script"
        crossOrigin="anonymous"
      />
      <link 
        rel="preload"
        href="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-face-aframe.prod.js"
        as="script"
        crossOrigin="anonymous"
      />
      <script 
        src="https://aframe.io/releases/1.5.0/aframe.min.js"
        crossOrigin="anonymous"
        async
      ></script>
      <script 
        src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-face-aframe.prod.js"
        crossOrigin="anonymous"
        async
      ></script>
      {children}
    </>
  )
}
