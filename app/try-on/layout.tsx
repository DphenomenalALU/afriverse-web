export default function TryOnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-face-aframe.prod.js"></script>
      {children}
    </>
  )
}
