import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#0B0B0B', color: '#F8F8F8', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 46, fontWeight: 800, letterSpacing: -3 }}>thecodemate<span style={{ color: '#FF7A00' }}>.</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, lineHeight: 1.02, fontWeight: 800, letterSpacing: -7 }}><div>Technology,</div><div style={{ color: '#FF7A00' }}>made visual.</div></div>
        <div style={{ fontSize: 27, color: '#BDBDBD' }}>Visual technology education and selected projects.</div>
      </div>
    </div>, size);
}
