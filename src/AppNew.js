import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import './App.css'

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; overscroll-behavior: none; }
  body { background: #000; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif; }

  .liquid-glass-nav {
    background: rgba(255,255,255,0.08);
    backdrop-filter: saturate(180%) blur(40px);
    -webkit-backdrop-filter: saturate(180%) blur(40px);
    border: 0.5px solid rgba(255,255,255,0.18);
    box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1);
  }

  .liquid-glass-btn {
    background: rgba(255,255,255,0.08);
    backdrop-filter: saturate(180%) blur(40px);
    -webkit-backdrop-filter: saturate(180%) blur(40px);
    border: 0.5px solid rgba(255,255,255,0.18);
    box-shadow: 0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.08);
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .liquid-glass-btn:active {
    transform: scale(0.97);
    background: rgba(255,255,255,0.12);
  }

  .poll-option {
    transition: background-color 0.15s ease, color 0.1s ease, padding 0.15s ease, font-size 0.1s ease;
    will-change: background-color;
    transform-origin: center;
  }
  .poll-option:active { transform: scale(0.97); }
  .poll-circle { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

  .no-sb::-webkit-scrollbar { display: none; }
  .no-sb { scrollbar-width: none; -ms-overflow-style: none; }

  .app-content {
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    padding: 0 20px;
  }
  @media (max-width: 480px) { .app-content { padding: 0 16px; } }
  @media (min-width: 1024px) { .app-content { padding: 0 24px; } }

  .input-bar-wrap {
    position: fixed;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 88px);
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 640px;
    z-index: 999;
  }
  @media (min-width: 768px) { .input-bar-wrap { width: calc(100% - 80px); } }

  .nav-bar-wrap {
    position: fixed;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
  }

  .feed-wrap { padding-bottom: 160px; }

  img { image-rendering: -webkit-optimize-contrast; }

  .nav-btn { transition: opacity 0.15s ease, transform 0.15s ease; }
  .nav-btn:active { opacity: 0.6; transform: scale(0.88); }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  @keyframes voicePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,59,48,0.4); }
    50% { box-shadow: 0 0 0 12px rgba(255,59,48,0); }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  textarea::-webkit-scrollbar { width: 3px; }
  textarea::-webkit-scrollbar-track { background: transparent; }
  textarea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }

  .bottom-glass-area {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 200px;
    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.01) 15%, rgba(0,0,0,0.04) 28%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.28) 52%, rgba(0,0,0,0.5) 64%, rgba(0,0,0,0.72) 76%, rgba(0,0,0,0.88) 86%, rgba(0,0,0,0.96) 94%, rgba(0,0,0,0.99) 100%);
    pointer-events: none;
    z-index: 998;
  }

  .home-sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 44px 0 32px;
    background: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,0.97) 25%, rgba(0,0,0,0.88) 35%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.28) 65%, rgba(0,0,0,0.12) 75%, rgba(0,0,0,0.04) 85%, rgba(0,0,0,0.01) 92%, transparent 100%);
    pointer-events: none;
    flex-shrink: 0;
  }
  .home-sticky-header h1,
  .home-sticky-header p {
    pointer-events: auto;
  }

  .gallery-swipe {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    height: 100%;
  }
  .gallery-swipe::-webkit-scrollbar { display: none; }
  .gallery-swipe-item {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    scroll-snap-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  textarea.link-mode::placeholder { color: #007AFF; opacity: 0.8; }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .media-grid-item {
    aspect-ratio: 1;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: #111;
  }
  .media-grid-item img,
  .media-grid-item video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Voice memo iMessage-style */
  .voice-record-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: rgba(28,28,30,0.95);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border-radius: 28px;
    border: 0.5px solid rgba(255,255,255,0.1);
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    animation: slideUp 0.2s ease-out;
  }

  .voice-wave-bar {
    width: 3px;
    border-radius: 2px;
    background: #FF3B30;
    animation: waveAnim 0.6s ease-in-out infinite alternate;
  }
  @keyframes waveAnim {
    0% { height: 4px; }
    100% { height: 20px; }
  }

  /* Media grid always 3x3 */

  /* Smooth button transitions globally */
  button, a, label {
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
  button:active, label:active {
    opacity: 0.7;
    transform: scale(0.96);
  }

  /* Preview overlay */
  .preview-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.95);
    z-index: 99998;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.2s ease-out;
  }
`

const FILE_TYPE_MAP = {
  pdf:    { label: 'PDF',        letter: 'P', bg: '#E53935' },
  doc:    { label: 'Word',       letter: 'W', bg: '#1565C0' },
  docx:   { label: 'Word',       letter: 'W', bg: '#1565C0' },
  xls:    { label: 'Excel',      letter: 'X', bg: '#2E7D32' },
  xlsx:   { label: 'Excel',      letter: 'X', bg: '#2E7D32' },
  csv:    { label: 'Excel',      letter: 'X', bg: '#2E7D32' },
  ppt:    { label: 'PPT',        letter: 'P', bg: '#E65100' },
  pptx:   { label: 'PPT',        letter: 'P', bg: '#E65100' },
  psd:    { label: 'Photoshop',  letter: 'P', bg: '#00B0FF' },
  ai:     { label: 'Illustrator',letter: 'A', bg: '#FF9800' },
  sketch: { label: 'Sketch',     letter: 'S', bg: '#F9A825' },
  fig:    { label: 'Figma',      letter: 'F', bg: '#A259FF' },
  sldprt: { label: 'SolidWorks', letter: 'S', bg: '#3E3E3E' },
  sldasm: { label: 'SolidWorks', letter: 'S', bg: '#3E3E3E' },
  dwg:    { label: 'AutoCAD',    letter: 'A', bg: '#1A1A1A' },
  dxf:    { label: 'AutoCAD',    letter: 'A', bg: '#1A1A1A' },
  logicx: { label: 'Logic Pro',  letter: 'L', bg: '#1C1C1E' },
  als:    { label: 'Ableton',    letter: 'A', bg: '#222'    },
  zip:    { label: 'ZIP',        letter: 'Z', bg: '#546E7A' },
  rar:    { label: 'RAR',        letter: 'R', bg: '#546E7A' },
  js:     { label: 'JavaScript', letter: 'J', bg: '#F7DF1E' },
  ts:     { label: 'TypeScript', letter: 'T', bg: '#3178C6' },
  py:     { label: 'Python',     letter: 'P', bg: '#3776AB' },
}

const getFileTypeInfo = (filename, mimeType) => {
  if (!filename) return { label: 'File', letter: 'F', bg: '#8E8E93' }
  const ext = filename.split('.').pop()?.toLowerCase()
  return FILE_TYPE_MAP[ext] || { label: ext?.toUpperCase() || 'File', letter: (ext?.[0] || 'F').toUpperCase(), bg: '#8E8E93' }
}

const getFilenameFromUrl = (url) => {
  if (!url) return 'File'
  try {
    const parts = decodeURIComponent(url).split('/')
    const last = parts[parts.length - 1]
    const clean = last.replace(/^[^/]+?-\d+-[\d.]+?\./, '')
    return clean || last
  } catch { return 'File' }
}

/* Smart filename truncation: shows start...end instead of start... */
const truncateFilename = (name, maxLen = 32) => {
  if (!name || name.length <= maxLen) return name
  const ext = name.includes('.') ? '.' + name.split('.').pop() : ''
  const base = name.slice(0, name.length - ext.length)
  if (base.length <= maxLen) return name
  const keepStart = Math.ceil((maxLen - 3) * 0.6)
  const keepEnd = Math.floor((maxLen - 3) * 0.4)
  return base.slice(0, keepStart) + '...' + base.slice(-keepEnd) + ext
}

/* ── Preview overlay — swipeable gallery for multiple attached files, shows actual content ── */
function AttachmentPreview({ files, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0)
  const [objUrls, setObjUrls] = useState([])
  const [textContents, setTextContents] = useState({})
  const [htmlContents, setHtmlContents] = useState({})
  const [pdfPages, setPdfPages] = useState({}) // { idx: [dataUrl, dataUrl, ...] }
  const [mammothLoaded, setMammothLoaded] = useState(false)
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false)
  const [xlsxLoaded, setXlsxLoaded] = useState(false)

  // Load libraries from CDN
  useEffect(() => {
    // Mammoth for docx
    if (window.mammoth) { setMammothLoaded(true) }
    else {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'
      s.onload = () => setMammothLoaded(true)
      document.head.appendChild(s)
    }
    // PDF.js for PDF rendering
    if (window.pdfjsLib) { setPdfjsLoaded(true) }
    else {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        setPdfjsLoaded(true)
      }
      document.head.appendChild(s)
    }
    // SheetJS for Excel
    if (window.XLSX) { setXlsxLoaded(true) }
    else {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
      s.onload = () => setXlsxLoaded(true)
      document.head.appendChild(s)
    }
  }, [])

  useEffect(() => {
    if (!files || !files.length) return
    const urls = files.map(f => URL.createObjectURL(f))
    setObjUrls(urls)
    files.forEach((f, i) => {
      const ext = f.name?.split('.').pop()?.toLowerCase()
      const isText = ['txt', 'md', 'json', 'csv', 'js', 'ts', 'py', 'html', 'css', 'xml', 'yaml', 'yml', 'log', 'sh', 'bat', 'ini', 'cfg', 'env'].includes(ext)
      if (isText) {
        const reader = new FileReader()
        reader.onload = (e) => setTextContents(prev => ({ ...prev, [i]: e.target.result }))
        reader.readAsText(f)
      }
    })
    return () => urls.forEach(u => URL.revokeObjectURL(u))
  }, [files])

  // Convert docx files to HTML
  useEffect(() => {
    if (!mammothLoaded || !files?.length) return
    files.forEach((f, i) => {
      const ext = f.name?.split('.').pop()?.toLowerCase()
      if (ext === 'docx' && window.mammoth && !htmlContents[i]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          window.mammoth.convertToHtml({ arrayBuffer: e.target.result })
            .then(result => { if (result.value) setHtmlContents(prev => ({ ...prev, [i]: result.value })) })
            .catch(() => {})
        }
        reader.readAsArrayBuffer(f)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mammothLoaded, files])

  // Render PDF pages as images
  useEffect(() => {
    if (!pdfjsLoaded || !files?.length) return
    files.forEach((f, i) => {
      const ext = f.name?.split('.').pop()?.toLowerCase()
      const isPdf = ext === 'pdf' || f.type === 'application/pdf'
      if (isPdf && window.pdfjsLib && !pdfPages[i]) {
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const pdf = await window.pdfjsLib.getDocument({ data: e.target.result }).promise
            const pages = []
            for (let p = 1; p <= pdf.numPages; p++) {
              const page = await pdf.getPage(p)
              const scale = 2
              const viewport = page.getViewport({ scale })
              const canvas = document.createElement('canvas')
              canvas.width = viewport.width
              canvas.height = viewport.height
              await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
              pages.push(canvas.toDataURL('image/jpeg', 0.85))
            }
            setPdfPages(prev => ({ ...prev, [i]: pages }))
          } catch {}
        }
        reader.readAsArrayBuffer(f)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfjsLoaded, files])

  // Convert Excel files to HTML tables
  useEffect(() => {
    if (!xlsxLoaded || !files?.length) return
    files.forEach((f, i) => {
      const ext = f.name?.split('.').pop()?.toLowerCase()
      if (['xls', 'xlsx', 'csv'].includes(ext) && window.XLSX && !htmlContents[i]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const wb = window.XLSX.read(e.target.result, { type: 'array' })
            const ws = wb.Sheets[wb.SheetNames[0]]
            const html = window.XLSX.utils.sheet_to_html(ws, { editable: false })
            setHtmlContents(prev => ({ ...prev, [i]: html }))
          } catch {}
        }
        reader.readAsArrayBuffer(f)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xlsxLoaded, files])

  if (!files || !files.length || !objUrls.length) return null
  const file = files[currentIndex]
  const objUrl = objUrls[currentIndex]
  if (!file || !objUrl) return null

  const renderFileContent = (f, url, idx) => {
    const fIsImg = f.type.startsWith('image/')
    const fIsVid = f.type.startsWith('video/')
    const fIsAudio = f.type.startsWith('audio/')
    const fIsPdf = f.type === 'application/pdf' || f.name?.toLowerCase().endsWith('.pdf')
    const ext = f.name?.split('.').pop()?.toLowerCase()
    const isOfficeDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)
    const isText = textContents[idx] !== undefined
    const hasHtml = htmlContents[idx] !== undefined
    const fTypeInfo = getFileTypeInfo(f.name, f.type)

    if (fIsImg) return <img src={url} alt={f.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} />
    if (fIsVid) return <video src={url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px' }} />
    if (fIsAudio) return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,122,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#007AFF"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </div>
        <audio src={url} controls style={{ width: '280px' }} />
      </div>
    )
    if (fIsPdf) {
      // Render PDF pages as stacked images (WhatsApp style)
      if (pdfPages[idx]) {
        return (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: '#000', padding: '8px 4px' }}>
            <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {pdfPages[idx].map((pageImg, pi) => (
                <div key={pi} style={{ position: 'relative' }}>
                  <img src={pageImg} alt={`Page ${pi + 1}`} style={{ width: '100%', display: 'block', borderRadius: pi === 0 ? '12px 12px 0 0' : pi === pdfPages[idx].length - 1 ? '0 0 12px 12px' : '0' }} />
                  <div style={{ position: 'absolute', top: '8px', left: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '3px 8px', fontSize: '11px', color: '#fff', fontWeight: '500' }}>{pi + 1} of {pdfPages[idx].length}</div>
                </div>
              ))}
            </div>
          </div>
        )
      }
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: '#E53935', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: '700', color: '#fff' }}>P</span>
          </div>
          <p style={{ fontSize: '17px', color: '#fff', margin: 0 }}>{f.name}</p>
          <div style={{ width: '24px', height: '24px', border: '2px solid #8E8E93', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'pulse 1s linear infinite' }} />
          <p style={{ fontSize: '13px', color: '#8E8E93' }}>Rendering pages...</p>
        </div>
      )
    }
    if (isText) return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto', background: 'rgba(28,28,30,0.95)', borderRadius: '12px', padding: '16px' }}>
        <pre style={{ color: '#e0e0e0', fontSize: '13px', fontFamily: 'SF Mono, Menlo, monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, lineHeight: '1.5' }}>{textContents[idx]}</pre>
      </div>
    )
    if (isOfficeDoc) {
      if (hasHtml) {
        const isExcel = ['xls', 'xlsx', 'csv'].includes(ext)
        const docStyles = `
          .doc-preview-content { color: #1a1a1a; font-size: ${isExcel ? '12px' : '14px'}; line-height: 1.65; font-family: ${isExcel ? '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' : '"Times New Roman", Georgia, serif'}; }
          .doc-preview-content p { margin: 0 0 8px 0; }
          .doc-preview-content h1 { font-size: 20px; font-weight: 700; margin: 16px 0 8px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
          .doc-preview-content h2 { font-size: 17px; font-weight: 700; margin: 14px 0 6px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
          .doc-preview-content h3 { font-size: 15px; font-weight: 600; margin: 12px 0 5px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
          .doc-preview-content strong, .doc-preview-content b { font-weight: 700; }
          .doc-preview-content em, .doc-preview-content i { font-style: italic; }
          .doc-preview-content u { text-decoration: underline; }
          .doc-preview-content table { border-collapse: collapse; width: max-content; min-width: 100%; margin: 0; font-size: ${isExcel ? '11px' : '11px'}; }
          .doc-preview-content td, .doc-preview-content th { border: 1px solid #d0d0d0; padding: ${isExcel ? '5px 8px' : '6px 8px'}; text-align: left; vertical-align: top; word-break: break-word; white-space: nowrap; }
          .doc-preview-content th, .doc-preview-content tr:first-child td { background: #f0f0f0; font-weight: 600; font-size: 11px; }
          .doc-preview-content img { max-width: 100%; height: auto; margin: 8px 0; border-radius: 4px; }
          .doc-preview-content ul, .doc-preview-content ol { margin: 6px 0; padding-left: 20px; }
          .doc-preview-content li { margin: 3px 0; }
          .doc-preview-content a { color: #1565C0; }
          @media (max-width: 480px) {
            .doc-preview-content { font-size: ${isExcel ? '11px' : '13px'}; }
            .doc-preview-content table { font-size: ${isExcel ? '10px' : '10px'}; }
            .doc-preview-content td, .doc-preview-content th { padding: 3px 5px; }
          }
        `
        return (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: '#000', padding: '8px 4px' }}>
            <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.3)', overflow: isExcel ? 'auto' : 'hidden' }}>
              <div style={{ padding: isExcel ? '12px 8px 20px' : '20px 16px 32px', overflowX: isExcel ? 'auto' : 'visible' }}>
                <style>{docStyles}</style>
                <div className="doc-preview-content" dangerouslySetInnerHTML={{ __html: htmlContents[idx] }} />
              </div>
            </div>
          </div>
        )
      }
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: fTypeInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: '700', color: '#fff' }}>{fTypeInfo.letter}</span>
          </div>
          <p style={{ fontSize: '17px', color: '#fff', margin: 0, textAlign: 'center', wordBreak: 'break-word', padding: '0 20px' }}>{f.name}</p>
          <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>{fTypeInfo.label} — {(f.size / 1024).toFixed(0)} KB</p>
          <div style={{ width: '24px', height: '24px', border: '2px solid #8E8E93', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'pulse 1s linear infinite' }} />
        </div>
      )
    }
    // Generic fallback
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '20px', background: fTypeInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span style={{ fontSize: '48px', fontWeight: '700', color: '#fff' }}>{fTypeInfo.letter}</span>
        </div>
        <p style={{ fontSize: '17px', color: '#fff', marginBottom: '4px' }}>{f.name}</p>
        <p style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '4px' }}>{fTypeInfo.label} — {(f.size / 1024).toFixed(0)} KB</p>
      </div>
    )
  }

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: 0, maxWidth: '60%', textAlign: 'center' }}>{truncateFilename(file.name, 30)}</p>
        {files.length > 1 ? (
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '500', minWidth: '44px', textAlign: 'right' }}>{currentIndex + 1}/{files.length}</span>
        ) : <div style={{ width: '44px' }} />}
      </div>
      {files.length > 1 ? (
        <div className="gallery-swipe no-sb"
          ref={el => { if (el) el.scrollLeft = currentIndex * el.offsetWidth }}
          onScroll={e => {
            const idx = Math.round(e.target.scrollLeft / e.target.offsetWidth)
            if (idx !== currentIndex && idx >= 0 && idx < files.length) setCurrentIndex(idx)
          }}
          style={{ flex: 1 }}
          onClick={e => e.stopPropagation()}>
          {files.map((f, i) => (
            <div key={i} className="gallery-swipe-item" style={{ padding: '16px' }}>
              {objUrls[i] ? renderFileContent(f, objUrls[i], i) : null}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', justifyContent: 'center', padding: '0', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
          {renderFileContent(file, objUrl, currentIndex)}
        </div>
      )}
      {/* Thumbnail strip for multiple files */}
      {files.length > 1 && (
        <div className="no-sb" style={{ padding: '10px 16px', display: 'flex', gap: '6px', overflowX: 'auto', background: 'rgba(0,0,0,0.7)', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {files.map((f, i) => {
            const url = objUrls[i]
            const fIsImg = f.type.startsWith('image/')
            const fIsVid = f.type.startsWith('video/')
            const fTypeInfo = getFileTypeInfo(f.name, f.type)
            return (
              <div key={i}
                onClick={() => { setCurrentIndex(i); const el = document.querySelector('.preview-overlay .gallery-swipe'); if (el) el.scrollTo({ left: i * el.offsetWidth, behavior: 'smooth' }) }}
                style={{ width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: i === currentIndex ? '2px solid #007AFF' : '2px solid transparent', opacity: i === currentIndex ? 1 : 0.55, flexShrink: 0, transition: 'opacity 0.2s, border 0.2s', background: fIsImg || fIsVid ? '#000' : fTypeInfo.bg }}>
                {fIsImg && url ? <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                 fIsVid && url ? <video src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted /> :
                 <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{fTypeInfo.letter}</span>
                 </div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DocumentCardLarge({ url, filename, mimeType, onOpen }) {
  const name = filename || getFilenameFromUrl(url)
  const typeInfo = getFileTypeInfo(name, mimeType)
  const ext = name.split('.').pop()?.toLowerCase()
  const isPdf = ext === 'pdf' || mimeType?.includes('pdf')
  const isImage = mimeType?.startsWith('image/')
  const showPreview = isPdf || isImage
  return (
    <div onClick={onOpen} style={{ background: 'rgba(28,28,30,0.9)', borderRadius: '20px', overflow: 'hidden', marginTop: '12px', cursor: 'pointer', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'stretch', minHeight: '160px' }}>
      <div style={{ width: '58%', flexShrink: 0, background: '#1a1a1a', overflow: 'hidden', position: 'relative', borderRadius: '16px', margin: '8px 0 8px 8px' }}>
        {showPreview ? (
          isImage ? <img src={url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <>
              <iframe src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} style={{ width: 'calc(100% + 20px)', height: '100%', border: 'none', pointerEvents: 'none' }} title={name} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '100%', background: '#1a1a1a' }} />
              <div style={{ position: 'absolute', inset: 0 }} />
            </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: typeInfo.bg }}>
            <span style={{ fontSize: '48px', fontWeight: '700', color: '#fff' }}>{typeInfo.letter}</span>
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: '16px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', overflow: 'hidden' }}>
        <p style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: 0, lineHeight: '1.3', wordBreak: 'break-word' }}>{name}</p>
        <span style={{ fontSize: '12px', color: '#007AFF', background: 'rgba(0,122,255,0.15)', borderRadius: '20px', padding: '3px 10px', fontWeight: '500', alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{typeInfo.label}</span>
      </div>
    </div>
  )
}

function DocumentViewer({ url, filename, mimeType, onClose, onDelete, onShare }) {
  const name = filename || getFilenameFromUrl(url)
  const ext = name.split('.').pop()?.toLowerCase()
  const isPdf = ext === 'pdf' || mimeType?.includes('pdf')
  const isImage = mimeType?.startsWith('image/')
  const isOfficeDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)
  const officeViewerUrl = isOfficeDoc ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}` : null
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 99999, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.8)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onClose} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
        </button>
        <p style={{ flex: 1, fontSize: '16px', fontWeight: '600', color: '#fff', margin: 0 }}>{truncateFilename(name, 34)}</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onShare} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
          </button>
          <button onClick={onDelete} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3B30' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#007AFF', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
          </a>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isImage ? <img src={url} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          : isPdf ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none' }} title={name} />
          : isOfficeDoc ? <iframe src={officeViewerUrl} style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }} title={name} />
          : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: getFileTypeInfo(name, mimeType).bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ fontSize: '36px', fontWeight: '700', color: '#fff' }}>{getFileTypeInfo(name, mimeType).letter}</span>
              </div>
              <p style={{ fontSize: '17px', color: '#fff', marginBottom: '8px' }}>{name}</p>
              <p style={{ fontSize: '15px', color: '#8E8E93', marginBottom: '24px' }}>This file type cannot be previewed.</p>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ padding: '12px 24px', background: '#007AFF', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }}>Open in Browser</a>
            </div>
          )
        }
      </div>
    </div>
  )
}

function LinkPreviewCard({ url }) {
  const [preview, setPreview] = useState({ title: '', image: null, loading: true })
  useEffect(() => {
    let cancelled = false
    const fetch_ = async () => {
      try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
        const data = await res.json()
        const html = data.contents || ''
        const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
          || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1]
        const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
          || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || ''
        if (!cancelled) setPreview({ title: ogTitle.slice(0, 80), image: ogImage || null, loading: false })
      } catch {
        if (!cancelled) setPreview({ title: '', image: null, loading: false })
      }
    }
    fetch_()
    return () => { cancelled = true }
  }, [url])
  const displayUrl = (() => {
    try {
      const u = new URL(url)
      const path = u.pathname.length > 28 ? u.pathname.slice(0, 28) + '…' : u.pathname
      return u.hostname + path
    } catch { return url.slice(0, 40) }
  })()
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', marginTop: '8px' }}>
      <div style={{ background: 'rgba(28,28,30,0.9)', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.08)' }}>
        {preview.image
          ? <img src={preview.image} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '90px', background: 'rgba(40,40,44,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm1-4h-4v2h4v-2z"/></svg>
            </div>
        }
        <div style={{ padding: '8px 12px 10px' }}>
          <p style={{ fontSize: '11px', color: '#8E8E93', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayUrl}</p>
          {preview.title
            ? <p style={{ fontSize: '14px', color: '#007AFF', margin: 0, fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.35' }}>{preview.title}</p>
            : <p style={{ fontSize: '13px', color: 'rgba(0,122,255,0.5)', margin: 0 }}>Loading preview…</p>
          }
        </div>
      </div>
    </a>
  )
}

function AppNew() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])
  const [newLog, setNewLog] = useState('')
  const [activeTab, setActiveTab] = useState('home')
  const [libraryFilter, setLibraryFilter] = useState('all')
  const [posting, setPosting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadingFile, setUploadingFile] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [videoLightbox, setVideoLightbox] = useState(null)
  const [galleryView, setGalleryView] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [docViewer, setDocViewer] = useState(null)
  const [expandedLogs, setExpandedLogs] = useState(new Set())
  const homeScrollRef = useRef(null)
  const libraryScrollRef = useRef(null)
  const mediaGridScrollRef = useRef(null)
  const [deleteAnimating, setDeleteAnimating] = useState(false)
  const [shareSheet, setShareSheet] = useState(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [eventData, setEventData] = useState({ title: '', description: '', startDate: new Date().toISOString().split('T')[0], startTime: '12:00', endDate: new Date().toISOString().split('T')[0], endTime: '13:00' })
  const [showPollModal, setShowPollModal] = useState(false)
  const [pollData, setPollData] = useState({ title: '', options: ['', ''] })
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingPoll, setEditingPoll] = useState(null)
  const [linkInputMode, setLinkInputMode] = useState(false)

  /* FIX 1: Gallery select mode — auto-triggered by action buttons */
  const [gallerySelectMode, setGallerySelectMode] = useState(false)
  const [gallerySelected, setGallerySelected] = useState(new Set())
  const [galleryAction, setGalleryAction] = useState(null) // 'share' | 'star' | 'delete' | 'save'

  /* FIX 2: Attachment preview before sending — stores index into selectedFiles */
  const [previewIndex, setPreviewIndex] = useState(null)

  /* Settings state */
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)

  /* iMessage-style voice memo — hold to record */
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingTimerRef = useRef(null)
  const recordedBlobRef = useRef(null)
  const [voiceReady, setVoiceReady] = useState(false)
  const [voicePreviewUrl, setVoicePreviewUrl] = useState(null)
  const voiceCancelledRef = useRef(false)
  const voiceTouchStartX = useRef(0)
  const [voiceSlideOffset, setVoiceSlideOffset] = useState(0)
  const analyserRef = useRef(null)
  const audioCtxRef = useRef(null)
  const waveformAnimRef = useRef(null)
  const [waveformData, setWaveformData] = useState(new Array(40).fill(3))

  useEffect(() => {
    const locked = !!(lightboxImage || galleryView || docViewer || videoLightbox || previewIndex !== null)
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxImage, galleryView, docViewer, videoLightbox, previewIndex])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setLoading(false)
      if (session) fetchLogs()
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session); if (session) fetchLogs()
    })
    const styleEl = document.createElement('style')
    styleEl.innerHTML = GLOBAL_CSS
    document.head.appendChild(styleEl)
    return () => { subscription.unsubscribe(); document.head.removeChild(styleEl) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToBottom = (ref) => { if (ref?.current) ref.current.scrollTop = ref.current.scrollHeight }

  // Auto-scroll library media to bottom on load (newest at bottom, same as home)
  useEffect(() => {
    if (activeTab === 'library' && libraryFilter === 'media' && libraryScrollRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = libraryScrollRef.current
          if (el && el.scrollHeight > el.clientHeight) {
            el.scrollTop = el.scrollHeight - el.clientHeight
          }
        })
      })
    }
  }, [activeTab, libraryFilter, logs])

  const fetchLogs = async () => {
    const { data, error } = await supabase.from('logs').select('*').order('created_at', { ascending: true })
    if (error) console.error(error)
    else {
      setLogs(data || [])
      setTimeout(() => scrollToBottom(homeScrollRef), 80)
    }
  }

  // Load saved profile data from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('airlog_display_name')
    const savedPhoto = localStorage.getItem('airlog_profile_photo')
    if (savedName) setDisplayName(savedName)
    if (savedPhoto) setProfilePhotoUrl(savedPhoto)
  }, [])

  const handleProfilePhotoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfilePhoto(file)
    const url = URL.createObjectURL(file)
    setProfilePhotoUrl(url)
    // Also save as base64 to localStorage for persistence
    const reader = new FileReader()
    reader.onload = (ev) => { localStorage.setItem('airlog_profile_photo', ev.target.result) }
    reader.readAsDataURL(file)
  }

  const handleDisplayNameChange = (name) => {
    setDisplayName(name)
    localStorage.setItem('airlog_display_name', name)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    if (!files.length) return
    setSelectedFiles(prev => [...prev, ...files].slice(0, 5))
    setShowAttachMenu(false)
  }

  const uploadFiles = async (files) => {
    const results = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${session.user.id}/${Date.now()}-${Math.random().toFixed(6)}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, file)
      if (error) { console.error(error); continue }
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
      results.push({ url: publicUrl, type: file.type, name: file.name })
    }
    return results
  }

  /* ── iMessage-style voice memo with real waveform ── */
  const startRecording = async () => {
    if (recording) return
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const ua = navigator.userAgent || ''
      const isHTTP = window.location.protocol === 'http:' && window.location.hostname !== 'localhost'
      const isInAppBrowser = /FBAN|FBAV|Instagram|Line|Twitter|Snapchat|WhatsApp|WeChat|MicroMessenger/i.test(ua)
      const isWebView = /wv|WebView/i.test(ua)
      let msg = isHTTP ? 'Voice recording requires HTTPS.\n\nFix: Open this link in your browser:\nhttps://' + window.location.host + window.location.pathname + '\n\nOr deploy to Vercel/Netlify for auto HTTPS.'
        : (isInAppBrowser || isWebView) ? 'Voice recording does not work in in-app browsers.\n\nFix: Tap ••• then "Open in Safari" or "Open in Chrome".'
        : 'Voice recording is not available.\n\nFix: Open in Safari or Chrome over HTTPS.'
      alert(msg); return
    }
    voiceCancelledRef.current = false
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch (permErr) {
      let msg = 'Could not access microphone.'
      if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') msg = 'Microphone access denied.\n\niOS Safari: Settings → Safari → Microphone → Allow.\nThen reload this page.'
      else if (permErr.name === 'NotFoundError') msg = 'No microphone found on this device.'
      else msg = `Microphone error: ${permErr.name} — ${permErr.message}`
      alert(msg); return
    }
    try {
      // Set up audio analyser for real waveform
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 128
      source.connect(analyser)
      analyserRef.current = analyser
      audioCtxRef.current = audioCtx

      const mimeType = MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2') ? 'audio/mp4;codecs=mp4a.40.2'
        : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4'
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      const chunks = []
      recorder.ondataavailable = (e) => { if (e.data?.size > 0) chunks.push(e.data) }
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        audioCtx.close().catch(() => {})
        analyserRef.current = null; audioCtxRef.current = null
        if (voiceCancelledRef.current) { voiceCancelledRef.current = false; return }
        const blobType = mimeType || recorder.mimeType || 'audio/webm'
        const blob = new Blob(chunks, { type: blobType })
        recordedBlobRef.current = { blob, mimeType: blobType }
        setVoicePreviewUrl(URL.createObjectURL(blob))
        setVoiceReady(true)
      }
      recorder.start(100)
      setMediaRecorder(recorder); setRecording(true); setShowAttachMenu(false); setRecordingTime(0)
      setWaveformData(new Array(40).fill(3))
      recordingTimerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
      // Start waveform animation
      const updateWaveform = () => {
        if (!analyserRef.current) return
        const data = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(data)
        // Sample 40 bars from the frequency data
        const bars = []
        const step = Math.floor(data.length / 40)
        for (let i = 0; i < 40; i++) {
          const val = data[i * step] || 0
          bars.push(Math.max(3, (val / 255) * 28))
        }
        setWaveformData(bars)
        waveformAnimRef.current = requestAnimationFrame(updateWaveform)
      }
      waveformAnimRef.current = requestAnimationFrame(updateWaveform)
    } catch (err) {
      stream.getTracks().forEach(t => t.stop())
      alert('Recording failed: ' + err.message)
    }
  }

  const stopRecording = (cancel = false) => {
    if (cancel) voiceCancelledRef.current = true
    if (mediaRecorder && mediaRecorder.state !== 'inactive') { mediaRecorder.stop(); setRecording(false) }
    if (recordingTimerRef.current) { clearInterval(recordingTimerRef.current); recordingTimerRef.current = null }
    if (waveformAnimRef.current) { cancelAnimationFrame(waveformAnimRef.current); waveformAnimRef.current = null }
    setVoiceSlideOffset(0)
    if (cancel) { setRecording(false); setVoiceReady(false); setVoicePreviewUrl(null); recordedBlobRef.current = null; setRecordingTime(0) }
  }

  const cancelVoice = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') { voiceCancelledRef.current = true; mediaRecorder.stop() }
    setRecording(false); setVoiceReady(false); setVoicePreviewUrl(null)
    recordedBlobRef.current = null; setRecordingTime(0); setVoiceSlideOffset(0)
    if (recordingTimerRef.current) { clearInterval(recordingTimerRef.current); recordingTimerRef.current = null }
  }

  const confirmVoice = async () => {
    if (!recordedBlobRef.current) return
    const { blob, mimeType } = recordedBlobRef.current
    const ext = mimeType?.includes('mp4') ? 'm4a' : 'webm'
    const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: mimeType || 'audio/webm' })
    setSelectedFiles(prev => [...prev, file])
    setVoiceReady(false); setVoicePreviewUrl(null); recordedBlobRef.current = null; setRecordingTime(0)
    setShowAttachMenu(false)
  }

  const handleVoiceTouchStart = (e) => {
    voiceTouchStartX.current = e.touches[0].clientX
    startRecording()
  }
  const handleVoiceTouchMove = (e) => {
    if (!recording) return
    const dx = e.touches[0].clientX - voiceTouchStartX.current
    if (dx < 0) setVoiceSlideOffset(Math.max(dx, -120))
  }
  const handleVoiceTouchEnd = () => {
    if (!recording) return
    if (voiceSlideOffset < -60) {
      stopRecording(true) // cancel
    } else {
      stopRecording(false) // finish
    }
  }

  const formatRecordingTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  const textareaRef = useRef(null)
  const resetTextarea = () => { if (textareaRef.current) textareaRef.current.style.height = '44px' }

  const handlePaste = (e) => {
    if (!recording && !voiceReady) {
      const items = e.clipboardData?.items
      if (items) {
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            e.preventDefault()
            const file = item.getAsFile()
            if (file) setSelectedFiles(prev => [...prev, file])
            return
          }
        }
      }
    }
    if (linkInputMode) {
      const text = e.clipboardData?.getData('text')
      if (text && text.startsWith('http')) {
        e.preventDefault()
        setNewLog(text.trim())
        setLinkInputMode(false)
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
          setTimeout(() => { if (textareaRef.current) textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px' }, 0)
        }
      }
    }
  }

  const handlePostLog = async (e) => {
    e.preventDefault()
    if (!newLog.trim() && !selectedFiles.length) return
    setPosting(true); setLinkInputMode(false)

    // Separate media (img/vid) from documents/audio
    const mediaFiles = selectedFiles.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'))
    const docFiles = selectedFiles.filter(f => !f.type.startsWith('image/') && !f.type.startsWith('video/'))

    // If there are media files, group them into one log (like before)
    if (mediaFiles.length > 0) {
      setUploadingFile(true)
      const res = await uploadFiles(mediaFiles)
      setUploadingFile(false)
      if (res.length) {
        const mediaUrls = res.map(r => r.url)
        const { error } = await supabase.from('logs').insert([{
          content: newLog || '',
          user_id: session.user.id,
          media_url: mediaUrls[0],
          media_urls: mediaUrls,
          media_type: res[0].type,
          is_starred: false,
          log_type: 'text'
        }])
        if (error) alert('Error: ' + error.message)
      }
    }

    // Post each document file as its own separate log entry
    if (docFiles.length > 0) {
      setUploadingFile(true)
      for (const file of docFiles) {
        const res = await uploadFiles([file])
        if (res.length) {
          await supabase.from('logs').insert([{
            content: !mediaFiles.length && newLog.trim() ? newLog : file.name,
            user_id: session.user.id,
            media_url: res[0].url,
            media_urls: [res[0].url],
            media_type: res[0].type,
            is_starred: false,
            log_type: 'text'
          }])
        }
      }
      setUploadingFile(false)
    }

    // If text only (no files)
    if (!selectedFiles.length && newLog.trim()) {
      const { error } = await supabase.from('logs').insert([{
        content: newLog,
        user_id: session.user.id,
        media_url: null,
        media_urls: null,
        media_type: null,
        is_starred: false,
        log_type: 'text'
      }])
      if (error) alert('Error: ' + error.message)
    }

    setNewLog(''); setSelectedFiles([]); setShowAttachMenu(false); resetTextarea(); fetchLogs()
    setPosting(false)
  }

  const handlePostEvent = async () => {
    if (!eventData.title.trim()) { alert('Please enter event title'); return }
    setPosting(true)
    const { error } = await supabase.from('logs').insert([{ user_id: session.user.id, log_type: 'event', event_title: eventData.title, event_description: eventData.description, event_start: new Date(`${eventData.startDate}T${eventData.startTime}`).toISOString(), event_end: new Date(`${eventData.endDate}T${eventData.endTime}`).toISOString(), is_starred: false }])
    if (error) alert('Error: ' + error.message)
    else { setEventData({ title: '', description: '', startDate: new Date().toISOString().split('T')[0], startTime: '12:00', endDate: new Date().toISOString().split('T')[0], endTime: '13:00' }); setShowEventModal(false); setShowAttachMenu(false); fetchLogs() }
    setPosting(false)
  }

  const handleUpdateEvent = async () => {
    if (!eventData.title.trim()) { alert('Please enter event title'); return }
    setPosting(true)
    const { error } = await supabase.from('logs').update({ event_title: eventData.title, event_description: eventData.description, event_start: new Date(`${eventData.startDate}T${eventData.startTime}`).toISOString(), event_end: new Date(`${eventData.endDate}T${eventData.endTime}`).toISOString() }).eq('id', editingEvent)
    if (error) alert('Error: ' + error.message)
    else { setEventData({ title: '', description: '', startDate: new Date().toISOString().split('T')[0], startTime: '12:00', endDate: new Date().toISOString().split('T')[0], endTime: '13:00' }); setEditingEvent(null); setShowEventModal(false); fetchLogs() }
    setPosting(false)
  }

  const handlePostPoll = async () => {
    const valid = pollData.options.filter(o => o.trim())
    if (!pollData.title.trim()) { alert('Please enter poll title'); return }
    if (valid.length < 2) { alert('At least 2 options required'); return }
    setPosting(true)
    const { error } = await supabase.from('logs').insert([{ user_id: session.user.id, log_type: 'poll', poll_title: pollData.title, poll_options: valid.map(o => ({ text: o, votes: 0 })), poll_votes: {}, is_starred: false }])
    if (error) alert('Error: ' + error.message)
    else { setPollData({ title: '', options: ['', ''] }); setShowPollModal(false); setShowAttachMenu(false); fetchLogs() }
    setPosting(false)
  }

  const handleUpdatePoll = async () => {
    const valid = pollData.options.filter(o => o.trim())
    if (!pollData.title.trim()) { alert('Please enter poll title'); return }
    if (valid.length < 2) { alert('At least 2 options required'); return }
    setPosting(true)
    const { error } = await supabase.from('logs').update({ poll_title: pollData.title, poll_options: valid.map(o => ({ text: o, votes: 0 })), poll_votes: {} }).eq('id', editingPoll)
    if (error) alert('Error: ' + error.message)
    else { setPollData({ title: '', options: ['', ''] }); setEditingPoll(null); setShowPollModal(false); fetchLogs() }
    setPosting(false)
  }

  const handleVotePoll = async (logId, idx) => {
    const log = logs.find(l => l.id === logId); if (!log) return
    const opts = log.poll_options.map(o => ({ ...o })), votes = { ...log.poll_votes }
    const prevVote = votes[session.user.id]
    if (prevVote !== undefined) opts[prevVote].votes = Math.max(0, opts[prevVote].votes - 1)
    if (prevVote === idx) { delete votes[session.user.id] } else { opts[idx].votes++; votes[session.user.id] = idx }
    // Optimistic: update local state instantly
    setLogs(prev => prev.map(l => l.id === logId ? { ...l, poll_options: opts, poll_votes: votes } : l))
    // Then sync to DB in background (no await blocking UI)
    supabase.from('logs').update({ poll_options: opts, poll_votes: votes }).eq('id', logId).then(({ error }) => {
      if (error) fetchLogs() // revert on error
    })
  }

  const toggleStar = async (logId, cur) => {
    setLogs(logs.map(l => l.id === logId ? { ...l, is_starred: !cur } : l))
    if (lightboxImage?.log.id === logId) setLightboxImage({ ...lightboxImage, log: { ...lightboxImage.log, is_starred: !cur } })
    if (galleryView?.log.id === logId) setGalleryView({ ...galleryView, log: { ...galleryView.log, is_starred: !cur } })
    const { error } = await supabase.from('logs').update({ is_starred: !cur }).eq('id', logId)
    if (error) { setLogs(logs.map(l => l.id === logId ? { ...l, is_starred: cur } : l)); alert('Error: ' + error.message) }
  }

  const deleteLog = async (logId) => {
    const { error } = await supabase.from('logs').delete().eq('id', logId)
    if (!error) { setLogs(logs.filter(l => l.id !== logId)); setDeleteConfirm(null); fetchLogs() }
    else alert('Error: ' + error.message)
  }

  /* Save media directly to device gallery */
  const saveMediaToDevice = async (url) => {
    try {
      // Try fetch + blob download first
      const response = await fetch(url, { mode: 'cors' })
      if (!response.ok) throw new Error('fetch failed')
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      const ext = url.split('.').pop()?.split('?')[0] || 'jpg'
      a.download = `airlog-${Date.now()}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch {
      // Fallback: open in new tab (user can long-press to save on mobile)
      const a = document.createElement('a')
      a.href = url
      a.download = `airlog-${Date.now()}`
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  /* Share actual media file to apps (WhatsApp, IG, Telegram, etc) */
  const shareMedia = async (url, filename) => {
    // Try native share with file blob first
    try {
      const response = await fetch(url, { mode: 'cors' })
      if (!response.ok) throw new Error('fetch failed')
      const blob = await response.blob()
      const ext = filename?.split('.').pop() || url.split('.').pop()?.split('?')[0] || 'jpg'
      const name = filename || `airlog-${Date.now()}.${ext}`
      const file = new File([blob], name, { type: blob.type || 'application/octet-stream' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: name })
        return
      }
    } catch {}
    // Fallback: share URL via native share sheet
    try {
      if (navigator.share) {
        await navigator.share({ title: filename || 'AirLog Media', url })
        return
      }
    } catch {}
    // Final fallback: open in new tab
    window.open(url, '_blank')
  }

  /* FIX 1: Gallery action handlers — only affect selected items */
  const handleGalleryAction = (action) => {
    setGalleryAction(action)
    setGallerySelectMode(true)
    setGallerySelected(new Set())
  }

  const executeGalleryAction = async () => {
    const selected = [...gallerySelected]
    if (!selected.length) return

    if (galleryAction === 'share') {
      for (const url of selected) {
        await shareMedia(url, getFilenameFromUrl(url))
      }
    } else if (galleryAction === 'save') {
      for (const url of selected) {
        await saveMediaToDevice(url)
      }
    } else if (galleryAction === 'star') {
      // Find all unique logs that contain the selected URLs and star them
      const logsMap = galleryView?.logsMap
      const logsToStar = new Set()
      if (logsMap) {
        selected.forEach(url => {
          const idx = galleryView.urls.indexOf(url)
          if (idx >= 0 && logsMap[idx]) logsToStar.add(logsMap[idx].id)
        })
      } else if (galleryView?.log) {
        logsToStar.add(galleryView.log.id)
      }
      for (const logId of logsToStar) {
        const log = logs.find(l => l.id === logId)
        if (log) await toggleStar(logId, log.is_starred)
      }
    } else if (galleryAction === 'delete') {
      // Group selected URLs by their parent log, then update each log
      const logsMap = galleryView?.logsMap
      const urlsByLog = {}

      if (logsMap) {
        selected.forEach(url => {
          const idx = galleryView.urls.indexOf(url)
          if (idx >= 0 && logsMap[idx]) {
            const logId = logsMap[idx].id
            if (!urlsByLog[logId]) urlsByLog[logId] = { log: logsMap[idx], urlsToRemove: [] }
            urlsByLog[logId].urlsToRemove.push(url)
          }
        })
      } else if (galleryView?.log) {
        urlsByLog[galleryView.log.id] = { log: galleryView.log, urlsToRemove: selected }
      }

      for (const logId of Object.keys(urlsByLog)) {
        const { log, urlsToRemove } = urlsByLog[logId]
        const allUrls = log.media_urls || (log.media_url ? [log.media_url] : [])
        const remaining = allUrls.filter(u => !urlsToRemove.includes(u))

        if (remaining.length === 0) {
          // All URLs removed from this log — delete the entire log
          await supabase.from('logs').delete().eq('id', log.id)
        } else {
          // Update the log with remaining URLs
          await supabase.from('logs').update({
            media_urls: remaining,
            media_url: remaining[0]
          }).eq('id', log.id)
        }
      }

      // Refresh and update gallery
      await fetchLogs()
      // Rebuild gallery URLs excluding deleted ones
      const remainingUrls = galleryView.urls.filter(u => !selected.includes(u))
      if (remainingUrls.length === 0) {
        setGalleryView(null)
      } else {
        const newLogsMap = galleryView.logsMap ? galleryView.logsMap.filter((_, i) => !selected.includes(galleryView.urls[i])) : undefined
        const newIndex = Math.min(galleryView.index, remainingUrls.length - 1)
        setGalleryView(prev => ({
          ...prev,
          urls: remainingUrls,
          index: newIndex,
          logsMap: newLogsMap,
          log: newLogsMap ? newLogsMap[newIndex] : prev.log
        }))
      }
    }
    setGallerySelectMode(false)
    setGallerySelected(new Set())
    setGalleryAction(null)
  }

  const formatTimestamp = (ts) => {
    const d = new Date(ts), mins = Math.floor((new Date() - d) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  const formatEventTime = (s) => new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })

  const isDocumentLog = (log) => {
    const url = log.media_url || log.media_urls?.[0]
    if (!url) return false
    if (!log.media_type) return true
    return !log.media_type.startsWith('image/') && !log.media_type.startsWith('video/') && !log.media_type.startsWith('audio/')
  }

  const renderMedia = (log) => {
    if (!log.media_url && (!log.media_urls || !log.media_urls.length)) return null
    const urls = log.media_urls || [log.media_url]
    if (log.media_type?.startsWith('image/')) {
      if (urls.length > 1) return (
        <div onClick={() => setGalleryView({ urls, index: 0, log })} style={{ display: 'grid', gridTemplateColumns: urls.length === 2 ? '1fr 1fr' : urls.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr', gap: '4px', marginTop: '12px', cursor: 'pointer' }}>
          {urls.slice(0, 4).map((url, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={url} alt="Media" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }} />
              {i === 3 && urls.length > 4 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: '600' }}>+{urls.length - 4}</div>}
            </div>
          ))}
        </div>
      )
      return (
        <div onClick={() => setLightboxImage({ url: urls[0], log })} style={{ marginTop: '12px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
          <img src={urls[0]} alt="Media" style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }} />
        </div>
      )
    }
    if (log.media_type?.startsWith('video/')) return (
      <div onClick={() => setVideoLightbox({ url: urls[0], log })} style={{ marginTop: '12px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', position: 'relative', background: '#000', height: '300px' }}>
        <video src={urls[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
    )
    if (log.media_type?.startsWith('audio/')) return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(0,122,255,0.1)', borderRadius: '12px', marginTop: '12px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#007AFF"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        <audio src={urls[0]} controls style={{ flex: 1 }} />
      </div>
    )
    const docFilename = log.content || getFilenameFromUrl(urls[0])
    return <DocumentCardLarge url={urls[0]} filename={docFilename} mimeType={log.media_type} onOpen={() => setDocViewer({ url: urls[0], filename: docFilename, mimeType: log.media_type, log })} />
  }

  const renderLogContent = (log) => {
    if (log.log_type === 'event') return (
      <div style={{ background: 'rgba(28,28,30,0.6)', borderRadius: '16px', padding: '16px', marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '600', margin: 0, flex: 1 }}>{log.event_title}</h3>
          <button onClick={() => { setEditingEvent(log.id); setEventData({ title: log.event_title, description: log.event_description || '', startDate: new Date(log.event_start).toISOString().split('T')[0], startTime: new Date(log.event_start).toTimeString().slice(0, 5), endDate: new Date(log.event_end).toISOString().split('T')[0], endTime: new Date(log.event_end).toTimeString().slice(0, 5) }); setShowEventModal(true) }}
            style={{ padding: '4px 12px', background: 'rgba(60,60,67,0.7)', border: 'none', borderRadius: '20px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
        </div>
        {log.event_description && <p style={{ fontSize: '15px', color: '#8E8E93', marginBottom: '12px' }}>{log.event_description}</p>}
        <span style={{ fontSize: '13px', color: '#007AFF' }}>{formatEventTime(log.event_start)}</span>
      </div>
    )
    if (log.log_type === 'poll') {
      const userVote = log.poll_votes?.[session.user.id]
      const userInitial = (session.user.email?.[0] || 'U').toUpperCase()
      return (
        <div style={{ background: 'rgba(28,28,30,0.8)', borderRadius: '20px', padding: '16px', marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: '#8E8E93', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Poll</span>
            <button onClick={() => { setEditingPoll(log.id); setPollData({ title: log.poll_title, options: log.poll_options.map(o => o.text) }); setShowPollModal(true) }}
              style={{ padding: '4px 12px', background: 'rgba(60,60,67,0.7)', border: 'none', borderRadius: '20px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 14px 0', color: '#fff' }}>{log.poll_title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {log.poll_options.map((opt, i) => {
              const sel = userVote === i
              return (
                <button key={i} onClick={() => handleVotePoll(log.id, i)} className="poll-option"
                  style={{ padding: sel ? '14px 16px' : '11px 16px', background: sel ? '#007AFF' : 'rgba(0,80,200,0.25)', border: 'none', borderRadius: '50px', color: sel ? '#fff' : 'rgba(100,160,255,0.9)', fontSize: sel ? '16px' : '15px', fontWeight: sel ? '600' : '400', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{opt.text}</span>
                  {sel ? <div className="poll-circle" style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(30,30,30,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{userInitial}</div>
                       : <div className="poll-circle" style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid rgba(100,160,255,0.6)', flexShrink: 0 }} />}
                </button>
              )
            })}
          </div>
        </div>
      )
    }
    const isExp = expandedLogs.has(log.id)
    const isLong = (log.content && log.content.split('\n').length > 3) || (log.content && log.content.length > 180)
    const urlMatch = log.content?.match(/https?:\/\/[^\s]+/)
    const detectedUrl = urlMatch?.[0]
    const displayContent = detectedUrl && !log.media_url ? log.content.replace(detectedUrl, '').trim() : log.content
    return (
      <>
        {displayContent && (
          <div>
            <p style={{ fontSize: '17px', lineHeight: '1.4', marginBottom: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: isExp ? 'unset' : 3, WebkitBoxOrient: 'vertical' }}>{displayContent}</p>
            {isLong && (
              <button onClick={e => { e.stopPropagation(); setExpandedLogs(prev => { const n = new Set(prev); n.has(log.id) ? n.delete(log.id) : n.add(log.id); return n }) }}
                style={{ background: 'none', border: 'none', padding: '2px 0 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#007AFF', fontSize: '14px', fontWeight: '500' }}>
                {isExp ? <>Show less <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg></> : <>more <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg></>}
              </button>
            )}
          </div>
        )}
        {detectedUrl && !log.media_url && <LinkPreviewCard url={detectedUrl} />}
        {renderMedia(log)}
      </>
    )
  }

  const getLogIcon = (log) => {
    if (log.log_type === 'event') return <svg width="20" height="20" viewBox="0 0 24 24" fill="#007AFF"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
    if (log.log_type === 'poll') return <svg width="20" height="20" viewBox="0 0 24 24" fill="#007AFF"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
    if (!log.media_url && (!log.media_urls || !log.media_urls.length)) {
      if (log.content?.match(/https?:\/\//)) return <svg width="20" height="20" viewBox="0 0 24 24" fill="#007AFF"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm1-4h-4v2h4v-2z"/></svg>
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="#007AFF"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
    }
    const count = log.media_urls?.length || 1
    if (log.media_type?.startsWith('image/') || log.media_type?.startsWith('video/')) return (
      <div style={{ position: 'relative' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#007AFF"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        {count > 1 && <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#007AFF', borderRadius: '10px', padding: '2px 6px', fontSize: '10px', fontWeight: '600', color: '#fff' }}>{count}</div>}
      </div>
    )
    if (log.media_type?.startsWith('audio/')) return <svg width="20" height="20" viewBox="0 0 24 24" fill="#007AFF"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="#007AFF"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>
  }

  // FIX 5: library — newest first
  const filteredLogs = logs.slice().reverse().filter(log => {
    if (libraryFilter === 'starred') { if (!log.is_starred) return false }
    else if (libraryFilter === 'text') { if (log.log_type !== 'text' || log.media_type || log.media_url || log.media_urls?.length > 0 || log.content?.match(/https?:\/\//)) return false }
    else if (libraryFilter === 'media') { if (!log.media_type?.startsWith('image/') && !log.media_type?.startsWith('video/')) return false }
    else if (libraryFilter === 'voice') { if (!log.media_type?.startsWith('audio/')) return false }
    else if (libraryFilter === 'links') { if (!log.content?.includes('http')) return false }
    else if (libraryFilter === 'documents') { if (!isDocumentLog(log)) return false }
    else if (libraryFilter === 'events') { if (log.log_type !== 'event') return false }
    else if (libraryFilter === 'polls') { if (log.log_type !== 'poll') return false }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const fn = log.content || getFilenameFromUrl(log.media_url || log.media_urls?.[0])
      if (!log.content?.toLowerCase().includes(q) && !log.event_title?.toLowerCase().includes(q) && !log.event_description?.toLowerCase().includes(q) && !log.poll_title?.toLowerCase().includes(q) && !fn?.toLowerCase().includes(q)) return false
    }
    return true
  })

  // Media grid: oldest at top, newest at bottom (same as home feed)
  const mediaGridItems = filteredLogs.slice().reverse().flatMap(log => {
    const urls = log.media_urls || (log.media_url ? [log.media_url] : [])
    return urls.map(url => ({ url, log, isVideo: log.media_type?.startsWith('video/') }))
  })
  const mediaPhotos = mediaGridItems.filter(i => !i.isVideo).length
  const mediaVideos = mediaGridItems.filter(i => i.isVideo).length

  if (loading) return <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>
  if (!session) return <Auth />

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>

      {/* ── HOME TAB ── */}
      {activeTab === 'home' && (
        <div className="app-content no-sb" ref={homeScrollRef}
          style={{ height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div className="home-sticky-header">
            <h1 style={{ fontSize: '34px', fontWeight: '700', margin: 0, color: '#fff' }}>Home</h1>
          </div>
          <div className="feed-wrap" style={{ flex: 1 }}>
            {logs.map(log => (
              <SwipeableLogItem key={log.id} log={log} onDelete={() => setDeleteConfirm(log)} onStar={() => toggleStar(log.id, log.is_starred)} renderContent={renderLogContent} getLogIcon={getLogIcon} formatTimestamp={formatTimestamp} />
            ))}
          </div>
        </div>
      )}

      {/* ── INPUT BAR ── */}
      {activeTab === 'home' && (
        <div className="input-bar-wrap">
          {/* iMessage voice recording bar — real waveform */}
          {recording && (
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '0', animation: 'slideUp 0.2s ease-out' }}>
              {/* Slide left to cancel zone */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(28,28,30,0.95)', backdropFilter: 'blur(40px)', borderRadius: '24px', padding: '10px 14px', border: '0.5px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', transform: `translateX(${voiceSlideOffset}px)`, transition: voiceSlideOffset === 0 ? 'transform 0.25s ease' : 'none', gap: '10px' }}>
                {/* Red recording dot */}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF3B30', flexShrink: 0, animation: 'pulse 1.2s infinite' }} />
                {/* Real waveform bars */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5px', height: '32px', overflow: 'hidden' }}>
                  {waveformData.map((h, i) => (
                    <div key={i} style={{ width: '2.5px', height: `${h}px`, borderRadius: '1.5px', background: '#007AFF', flexShrink: 0, transition: 'height 0.08s ease' }} />
                  ))}
                </div>
                {/* Timer */}
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: '500', fontVariantNumeric: 'tabular-nums', flexShrink: 0, minWidth: '42px', textAlign: 'right' }}>{formatRecordingTime(recordingTime)}</span>
              </div>
              {/* Stop / send button */}
              <button onClick={() => stopRecording(false)}
                style={{ width: '44px', height: '44px', borderRadius: '22px', background: '#007AFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
              </button>
            </div>
          )}
          {/* Slide left hint */}
          {recording && voiceSlideOffset < -20 && (
            <div style={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 142px)', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '6px', color: '#FF3B30', fontSize: '13px', fontWeight: '500', animation: 'fadeIn 0.15s ease' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
              Slide to cancel
            </div>
          )}

          {/* Voice preview after recording — iMessage style */}
          {voiceReady && voicePreviewUrl && !recording && (
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideUp 0.2s ease-out' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(28,28,30,0.95)', backdropFilter: 'blur(40px)', borderRadius: '24px', padding: '8px 14px', border: '0.5px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                <audio src={voicePreviewUrl} controls style={{ flex: 1, height: '32px', opacity: 0.9 }} />
                <span style={{ color: '#8E8E93', fontSize: '13px', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{formatRecordingTime(recordingTime)}</span>
              </div>
              {/* Delete */}
              <button onClick={cancelVoice} style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'rgba(255,59,48,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF3B30"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
              {/* Send */}
              <button onClick={confirmVoice} style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#007AFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          )}

          {showAttachMenu && !recording && !voiceReady && (
            <div style={{ marginBottom: '10px', display: 'flex', gap: '8px', justifyContent: 'center', animation: 'slideUp 0.15s ease-out' }}>
              <label style={{ width: '48px', height: '44px', background: '#007AFF', border: 'none', borderRadius: '22px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                <input type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
              </label>
              <button onClick={() => { setLinkInputMode(true); setNewLog(''); setShowAttachMenu(false); setTimeout(() => textareaRef.current?.focus(), 80) }}
                style={{ width: '48px', height: '44px', background: '#007AFF', border: 'none', borderRadius: '22px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm1-4h-4v2h4v-2z"/></svg>
              </button>
              <button onClick={() => setShowPollModal(true)} style={{ width: '48px', height: '44px', background: '#007AFF', border: 'none', borderRadius: '22px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
              </button>
              <button onClick={() => setShowEventModal(true)} style={{ width: '48px', height: '44px', background: '#007AFF', border: 'none', borderRadius: '22px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
              </button>
              <label style={{ width: '48px', height: '44px', background: '#007AFF', border: 'none', borderRadius: '22px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>
                <input type="file" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
              </label>
            </div>
          )}

          <form onSubmit={handlePostLog}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', background: 'rgba(28,28,30,0.8)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: '28px', padding: '8px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', border: linkInputMode ? '0.5px solid rgba(0,122,255,0.5)' : '0.5px solid rgba(255,255,255,0.1)' }}>
              <button type="button"
                onClick={() => { if (recording) { stopRecording(true) } else if (voiceReady) { cancelVoice() } else if (linkInputMode) { setLinkInputMode(false); setNewLog('') } else { setShowAttachMenu(!showAttachMenu) } }}
                style={{ width: '44px', height: '44px', borderRadius: '22px', background: (recording || voiceReady || showAttachMenu || linkInputMode) ? '#FF3B30' : 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, fontSize: '22px', fontWeight: '300' }}>
                {(recording || voiceReady || showAttachMenu || linkInputMode) ? '×' : '+'}
              </button>
              <textarea ref={textareaRef} className={linkInputMode ? 'link-mode' : ''} value={newLog}
                onChange={e => { setNewLog(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
                onKeyDown={e => {
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                  if (e.key === 'Enter' && !e.shiftKey && !isMobile) { e.preventDefault(); if (newLog.trim() || selectedFiles.length > 0) handlePostLog(e) }
                }}
                onPaste={handlePaste}
                placeholder={linkInputMode ? 'Paste your link here…' : 'Log things to yourself'}
                rows={1}
                style={{ flex: 1, background: 'none', border: 'none', color: linkInputMode ? '#007AFF' : '#fff', fontSize: '17px', outline: 'none', resize: 'none', lineHeight: '1.4', padding: '10px 0', minHeight: '44px', maxHeight: '120px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', overflowY: 'auto' }}
              />
              {/* Mic button — hold to record, click to record (iMessage) */}
              {!newLog.trim() && selectedFiles.length === 0 && !recording && !voiceReady && !linkInputMode && (
                <button type="button"
                  onTouchStart={handleVoiceTouchStart}
                  onTouchMove={handleVoiceTouchMove}
                  onTouchEnd={handleVoiceTouchEnd}
                  onMouseDown={() => startRecording()}
                  onMouseUp={() => { if (recording) stopRecording(false) }}
                  style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#007AFF', flexShrink: 0, marginRight: '2px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                </button>
              )}
              {(newLog.trim() || selectedFiles.length > 0) && (
                <button type="submit" disabled={posting || uploadingFile} style={{ width: '44px', height: '44px', borderRadius: '22px', background: '#007AFF', border: 'none', cursor: posting || uploadingFile ? 'not-allowed' : 'pointer', opacity: posting || uploadingFile ? 0.5 : 1, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              )}
            </div>
            {/* FIX 2: Attached files — tap to preview */}
            {selectedFiles.length > 0 && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {selectedFiles.map((file, idx) => {
                  const typeInfo = getFileTypeInfo(file.name, file.type)
                  const isImg = file.type.startsWith('image/'); const isVid = file.type.startsWith('video/')
                  const objUrl = (isImg || isVid) ? URL.createObjectURL(file) : null
                  return (
                    <div key={idx} style={{ position: 'relative', flexShrink: 0, width: isImg || isVid ? '90px' : '120px', height: '90px', borderRadius: '12px', overflow: 'hidden', background: isImg || isVid ? '#000' : typeInfo.bg, cursor: 'pointer' }}
                      onClick={() => setPreviewIndex(idx)}>
                      {isImg && <img src={objUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      {isVid && <video src={objUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />}
                      {!isImg && !isVid && (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px' }}>
                          <span style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>{typeInfo.letter}</span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{file.name.split('.')[0]}</span>
                        </div>
                      )}
                      <button type="button" onClick={e => { e.stopPropagation(); setSelectedFiles(selectedFiles.filter((_, i) => i !== idx)) }}
                        style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '11px', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }}>✕</button>
                    </div>
                  )
                })}
              </div>
            )}
          </form>
        </div>
      )}

      {/* ── LIBRARY TAB ── */}
      {activeTab === 'library' && libraryFilter === 'media' && (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Fixed header for media only */}
          <div style={{ flexShrink: 0, paddingTop: '48px', background: '#000', zIndex: 10, position: 'relative' }}>
            <div className="app-content">
              <h1 style={{ fontSize: '34px', fontWeight: '700', marginBottom: '16px' }}>Library</h1>
              <div style={{ padding: '8px 16px', background: 'rgba(28,28,30,0.6)', borderRadius: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#8E8E93"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '17px', outline: 'none', flex: 1 }} />
                {searchQuery.length > 0 && (
                  <button onClick={() => setSearchQuery('')} style={{ width: '20px', height: '20px', borderRadius: '10px', background: 'rgba(142,142,147,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                )}
              </div>
              <div className="no-sb" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '14px' }}>
                {['all', 'starred', 'media', 'text', 'links', 'voice', 'documents', 'polls', 'events'].map(f => (
                  <button key={f} onClick={() => setLibraryFilter(f)}
                    style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: libraryFilter === f ? '#007AFF' : 'rgba(28,28,30,0.6)', color: '#fff', fontSize: '15px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize', flexShrink: 0 }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Scrollable media grid — same width as other content */}
          <div className="app-content no-sb" ref={libraryScrollRef} style={{ flex: 1, overflowY: 'auto' }}>
            <div ref={mediaGridScrollRef} style={{ paddingBottom: '84px', paddingTop: '2px' }}>
              {mediaGridItems.length === 0
                ? <p style={{ color: '#8E8E93', textAlign: 'center', marginTop: '60px' }}>No media yet</p>
                : <>
                    <div className="media-grid" style={{ width: '100%' }}>
                      {mediaGridItems.map((item, idx) => (
                        <div key={idx} className="media-grid-item"
                          onClick={() => {
                            if (item.isVideo) {
                              setVideoLightbox({ url: item.url, log: item.log })
                            } else {
                              const allPhotos = mediaGridItems.filter(i => !i.isVideo)
                              const allUrls = allPhotos.map(i => i.url)
                              const allLogs = allPhotos.map(i => i.log)
                              const indexInAll = allUrls.indexOf(item.url)
                              if (allUrls.length > 1) {
                                setGalleryView({ urls: allUrls, index: Math.max(0, indexInAll), log: item.log, logsMap: allLogs })
                              } else {
                                setLightboxImage({ url: item.url, log: item.log })
                              }
                            }
                          }}>
                          {item.isVideo
                            ? <>
                                <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                                <div style={{ position: 'absolute', bottom: '4px', right: '6px' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                              </>
                            : <img src={item.url} alt="" loading="lazy" />
                          }
                        </div>
                      ))}
                    </div>
                    <p style={{ color: '#8E8E93', fontSize: '13px', textAlign: 'center', marginTop: '16px', marginBottom: '8px' }}>
                      {mediaPhotos > 0 && `${mediaPhotos} Photo${mediaPhotos !== 1 ? 's' : ''}`}
                      {mediaPhotos > 0 && mediaVideos > 0 && '  ·  '}
                      {mediaVideos > 0 && `${mediaVideos} Video${mediaVideos !== 1 ? 's' : ''}`}
                    </p>
                  </>
              }
            </div>
          </div>
        </div>
      )}

      {/* ── LIBRARY TAB — non-media filters (scrolls normally, header not fixed) ── */}
      {activeTab === 'library' && libraryFilter !== 'media' && (
        <div className="app-content no-sb" ref={libraryScrollRef} style={{ height: '100vh', overflowY: 'auto' }}>
          <h1 style={{ fontSize: '34px', fontWeight: '700', marginBottom: '16px', paddingTop: '48px' }}>Library</h1>
          <div style={{ padding: '8px 16px', background: 'rgba(28,28,30,0.6)', borderRadius: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#8E8E93"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '17px', outline: 'none', flex: 1 }} />
            {searchQuery.length > 0 && (
              <button onClick={() => setSearchQuery('')} style={{ width: '20px', height: '20px', borderRadius: '10px', background: 'rgba(142,142,147,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            )}
          </div>
          <div className="no-sb" style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
            {['all', 'starred', 'media', 'text', 'links', 'voice', 'documents', 'polls', 'events'].map(f => (
              <button key={f} onClick={() => setLibraryFilter(f)}
                style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: libraryFilter === f ? '#007AFF' : 'rgba(28,28,30,0.6)', color: '#fff', fontSize: '15px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize', flexShrink: 0 }}>
                {f}
              </button>
            ))}
          </div>
          <div className="feed-wrap">
            {filteredLogs.length === 0 && <p style={{ color: '#8E8E93', textAlign: 'center', marginTop: '60px' }}>Nothing here yet</p>}
            {filteredLogs.map(log => (
              <SwipeableLogItem key={log.id} log={log} onDelete={() => setDeleteConfirm(log)} onStar={() => toggleStar(log.id, log.is_starred)} renderContent={renderLogContent} getLogIcon={getLogIcon} formatTimestamp={formatTimestamp} />
            ))}
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === 'settings' && !showProfileSettings && (
        <div className="app-content no-sb" style={{ height: '100vh', overflowY: 'auto', paddingTop: '48px', paddingBottom: '100px' }}>
          <h1 style={{ fontSize: '34px', fontWeight: '700', marginBottom: '30px' }}>Settings</h1>
          {/* Profile card — tap to open profile settings */}
          <div onClick={() => setShowProfileSettings(true)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: 'rgba(60,60,67,0.6)', borderRadius: '16px', marginBottom: '30px', cursor: 'pointer' }}>
            <label style={{ cursor: 'pointer', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '30px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '60px', height: '60px', borderRadius: '30px', background: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#fff', fontWeight: '600' }}>
                  {(displayName || session.user.email)?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleProfilePhotoSelect} style={{ display: 'none' }} />
            </label>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '17px', fontWeight: '600', marginBottom: '4px' }}>{displayName || session.user.email.split('@')[0]}</p>
              <p style={{ fontSize: '15px', color: '#8E8E93' }}>{session.user.email}</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#8E8E93"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
          </div>

          <p style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '12px', marginLeft: '16px', fontWeight: '600' }}>Billing</p>
          <div style={{ background: 'rgba(60,60,67,0.6)', borderRadius: '16px', overflow: 'hidden', marginBottom: '30px' }}>
            <div style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '17px', color: '#007AFF' }}>Free Trial</span>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '12px', marginLeft: '16px', fontWeight: '600' }}>About</p>
          <div style={{ background: 'rgba(60,60,67,0.6)', borderRadius: '16px', overflow: 'hidden', marginBottom: '30px' }}>
            <button style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: '0.5px solid rgba(142,142,147,0.2)', color: '#fff', fontSize: '17px', textAlign: 'left', cursor: 'pointer' }}>Feedback</button>
            <button style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: '0.5px solid rgba(142,142,147,0.2)', color: '#fff', fontSize: '17px', textAlign: 'left', cursor: 'pointer' }}>Help Center</button>
            <button onClick={() => setShowPrivacyPolicy(true)} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: '0.5px solid rgba(142,142,147,0.2)', color: '#fff', fontSize: '17px', textAlign: 'left', cursor: 'pointer' }}>Privacy Policy</button>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '17px', color: '#fff' }}>App Version</span>
              <span style={{ fontSize: '17px', color: '#8E8E93' }}>AirLog v1.0.0</span>
            </div>
          </div>

          <button onClick={() => supabase.auth.signOut()} className="liquid-glass-btn"
            style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', color: '#FF3B30', fontSize: '17px', textAlign: 'center', cursor: 'pointer', fontWeight: '600' }}>
            Log out
          </button>
        </div>
      )}

      {/* ── PROFILE SETTINGS PAGE ── */}
      {activeTab === 'settings' && showProfileSettings && (
        <div className="app-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '0' }}>
          {/* Header with back button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0', paddingTop: '48px', position: 'relative' }}>
            <button onClick={() => setShowProfileSettings(false)}
              style={{ position: 'absolute', left: '0', width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
            </button>
            <span style={{ fontSize: '17px', fontWeight: '600', color: '#fff' }}>Profile Settings</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
            {/* Profile photo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0 24px' }}>
              <label style={{ cursor: 'pointer', position: 'relative' }}>
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '60px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.15)' }} />
                ) : (
                  <div style={{ width: '120px', height: '120px', borderRadius: '60px', background: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#fff', fontWeight: '600', border: '3px solid rgba(255,255,255,0.15)' }}>
                    {(displayName || session.user.email)?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleProfilePhotoSelect} style={{ display: 'none' }} />
              </label>
              <label style={{ cursor: 'pointer' }}>
                <span style={{ color: '#007AFF', fontSize: '15px', fontWeight: '500', marginTop: '12px', display: 'block' }}>Edit Photo</span>
                <input type="file" accept="image/*" onChange={handleProfilePhotoSelect} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Profile info */}
            <p style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '8px', marginLeft: '16px', fontWeight: '600' }}>Profile Info</p>
            <div style={{ background: 'rgba(60,60,67,0.6)', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
              <input type="text" placeholder="Name" value={displayName}
                onChange={e => handleDisplayNameChange(e.target.value)}
                style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', color: '#fff', fontSize: '17px', outline: 'none' }} />
            </div>
            <p style={{ fontSize: '13px', color: '#8E8E93', margin: '0 16px', lineHeight: '1.5' }}>
              AirLog does not have access to or store this data, it is securely synced via your account. Your name and photo are optional and used only to personalize the app.
            </p>
          </div>
        </div>
      )}

      {/* ── PRIVACY POLICY MODAL ── */}
      {showPrivacyPolicy && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowPrivacyPolicy(false)}>
          <div style={{ background: 'rgba(28,28,30,0.98)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', border: '0.5px solid rgba(255,255,255,0.12)', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            {/* Handle bar + close */}
            <div style={{ flexShrink: 0, padding: '12px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '36px' }} />
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
              <button onClick={() => setShowPrivacyPolicy(false)} className="liquid-glass-btn"
                style={{ width: '32px', height: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            {/* Scrollable content */}
            <div className="no-sb" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px', WebkitOverflowScrolling: 'touch' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>Airlog Privacy Policy</h2>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '8px', marginTop: '16px' }}>Information We Collect</h3>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 6px' }}>We collect the following information:</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '16px' }}>Email address (for account creation and login)</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '16px' }}>Content you create, including:</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '32px' }}>Text logs</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '32px' }}>Photos and videos</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '32px' }}>Voice recordings</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 12px', paddingLeft: '32px' }}>Files you upload</p>

              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '8px', marginTop: '16px' }}>How We Use Your Information</h3>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 6px' }}>We use your information to:</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '16px' }}>Provide and operate AirLog</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '16px' }}>Store and display your logs</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '16px' }}>Sync your data across devices</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 12px', paddingLeft: '16px' }}>Authenticate your account</p>

              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '8px', marginTop: '16px' }}>Data Storage</h3>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px' }}>Your data is securely stored using Supabase.</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 12px' }}>We take reasonable steps to protect your information, but no system is completely secure.</p>

              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '8px', marginTop: '16px' }}>Data Sharing</h3>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px' }}>We do not sell, trade, or share your personal data with third parties for advertising purposes.</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 12px' }}>Your content remains private to your account.</p>

              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '8px', marginTop: '16px' }}>Your Rights</h3>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 6px' }}>You can:</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '16px' }}>Access your data at any time</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px', paddingLeft: '16px' }}>Delete your logs</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 12px', paddingLeft: '16px' }}>Request account and data deletion</p>

              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '8px', marginTop: '16px' }}>Third-Party Services</h3>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 6px' }}>We use third-party services to operate the app, including:</p>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 12px', paddingLeft: '16px' }}>Supabase (data storage and authentication)</p>

              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '8px', marginTop: '16px' }}>Contact</h3>
              <p style={{ fontSize: '14px', color: '#c0c0c0', lineHeight: '1.6', margin: '0 0 4px' }}>If you have questions, contact us at:</p>
              <p style={{ fontSize: '14px', color: '#007AFF', lineHeight: '1.6', margin: '0' }}>your@email.com</p>
            </div>
          </div>
        </div>
      )}

      {/* ── EVENT MODAL ── */}
      {showEventModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => { setShowEventModal(false); setEditingEvent(null) }}>
          <div style={{ background: 'rgba(28,28,30,0.95)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: '24px', padding: '24px', maxWidth: '400px', width: '100%', border: '0.5px solid rgba(255,255,255,0.1)', animation: 'slideUp 0.25s ease-out' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
            <input type="text" placeholder="Title" value={eventData.title} onChange={e => setEventData({ ...eventData, title: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(60,60,67,0.6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '17px', marginBottom: '12px', outline: 'none' }} />
            <textarea placeholder="Description" value={eventData.description} onChange={e => setEventData({ ...eventData, description: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(60,60,67,0.6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '17px', marginBottom: '12px', outline: 'none', resize: 'vertical', minHeight: '80px' }} />
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '8px', display: 'block' }}>Starts</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="date" value={eventData.startDate} onChange={e => setEventData({ ...eventData, startDate: e.target.value })} style={{ flex: 1, padding: '12px', background: 'rgba(60,60,67,0.6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none' }} />
                <input type="time" value={eventData.startTime} onChange={e => setEventData({ ...eventData, startTime: e.target.value })} style={{ padding: '12px', background: 'rgba(60,60,67,0.6)', border: 'none', borderRadius: '12px', color: '#007AFF', fontSize: '15px', outline: 'none' }} />
              </div>
            </div>
            <button onClick={editingEvent ? handleUpdateEvent : handlePostEvent} disabled={posting} style={{ width: '100%', padding: '14px', background: '#007AFF', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '17px', fontWeight: '600', cursor: posting ? 'not-allowed' : 'pointer', opacity: posting ? 0.5 : 1 }}>
              {posting ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </div>
      )}

      {/* ── POLL MODAL ── */}
      {showPollModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => { setShowPollModal(false); setEditingPoll(null) }}>
          <div style={{ background: 'rgba(28,28,30,0.95)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: '24px', padding: '24px', maxWidth: '400px', width: '100%', border: '0.5px solid rgba(255,255,255,0.1)', maxHeight: '80vh', overflowY: 'auto', animation: 'slideUp 0.25s ease-out' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>{editingPoll ? 'Edit Poll' : 'Create Poll'}</h2>
            <input type="text" placeholder="Poll Title" value={pollData.title} onChange={e => setPollData({ ...pollData, title: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(60,60,67,0.6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '17px', marginBottom: '16px', outline: 'none' }} />
            {pollData.options.map((opt, i) => (
              <input key={i} type="text" placeholder={`Choice ${i + 1}`} value={opt} onChange={e => { const o = [...pollData.options]; o[i] = e.target.value; setPollData({ ...pollData, options: o }) }}
                style={{ width: '100%', padding: '12px', background: 'rgba(60,60,67,0.6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', marginBottom: '8px', outline: 'none' }} />
            ))}
            <button onClick={() => setPollData({ ...pollData, options: [...pollData.options, ''] })} style={{ width: '100%', padding: '12px', background: 'rgba(60,60,67,0.6)', border: 'none', borderRadius: '12px', color: '#007AFF', fontSize: '15px', marginBottom: '16px', cursor: 'pointer' }}>+ Add Option</button>
            <button onClick={editingPoll ? handleUpdatePoll : handlePostPoll} disabled={posting} style={{ width: '100%', padding: '14px', background: '#007AFF', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '17px', fontWeight: '600', cursor: posting ? 'not-allowed' : 'pointer', opacity: posting ? 0.5 : 1 }}>
              {posting ? (editingPoll ? 'Updating...' : 'Creating...') : (editingPoll ? 'Update Poll' : 'Create Poll')}
            </button>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => setDeleteConfirm(null)}>
          <div style={{ background: 'rgba(40,40,42,0.95)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: '24px', padding: '32px 24px 24px', maxWidth: '340px', width: '100%', border: '0.5px solid rgba(255,255,255,0.1)', animation: 'slideUp 0.2s ease-out' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: '17px', lineHeight: '1.5', textAlign: 'center', marginBottom: '24px', color: '#fff' }}>This log will be permanently deleted and cannot be restored.</p>
            <button onClick={() => { setDeleteAnimating(true); setTimeout(() => { setDeleteAnimating(false); deleteLog(deleteConfirm.id) }, 180) }}
              style={{ width: '100%', padding: '16px', background: 'rgba(60,60,67,0.6)', border: 'none', borderRadius: '14px', color: '#FF3B30', fontSize: '17px', fontWeight: '600', cursor: 'pointer', transform: deleteAnimating ? 'scale(0.95)' : 'scale(1)', transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)' }}>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ── IMAGE LIGHTBOX ── */}
      {lightboxImage && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
            <button onClick={() => setLightboxImage(null)} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => shareMedia(lightboxImage.url, getFilenameFromUrl(lightboxImage.url))} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
              </button>
              <button onClick={() => saveMediaToDevice(lightboxImage.url)} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              </button>
              <button onClick={() => { setDeleteConfirm(lightboxImage.log); setLightboxImage(null) }} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3B30' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
              <button onClick={() => toggleStar(lightboxImage.log.id, lightboxImage.log.is_starred)} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={lightboxImage.log.is_starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={lightboxImage.url} alt="Full size" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      )}

      {/* ── GALLERY VIEW — FIX 1: action buttons at top, auto-select mode ── */}
      {galleryView && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', background: '#000' }}>
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)', flexShrink: 0 }}>
            <button onClick={() => { setGalleryView(null); setGallerySelectMode(false); setGallerySelected(new Set()); setGalleryAction(null) }}
              style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
            </button>

            {gallerySelectMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#8E8E93', fontSize: '13px' }}>{gallerySelected.size} selected</span>
                <button onClick={executeGalleryAction} disabled={gallerySelected.size === 0}
                  style={{ padding: '8px 18px', borderRadius: '22px', background: gallerySelected.size > 0 ? '#007AFF' : 'rgba(60,60,67,0.4)', border: 'none', cursor: gallerySelected.size > 0 ? 'pointer' : 'default', color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                  {galleryAction === 'share' ? 'Share' : galleryAction === 'save' ? 'Save' : galleryAction === 'star' ? 'Star' : galleryAction === 'delete' ? 'Delete' : 'Done'}
                </button>
                <button onClick={() => { setGallerySelectMode(false); setGallerySelected(new Set()); setGalleryAction(null) }}
                  style={{ padding: '8px 14px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: '500' }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center' }}>{galleryView.index + 1} / {galleryView.urls.length}</span>
              </div>
            )}
          </div>

          <div className="gallery-swipe no-sb"
            ref={el => { if (el && !gallerySelectMode) el.scrollLeft = galleryView.index * el.offsetWidth }}
            onScroll={e => {
              if (gallerySelectMode) return
              const idx = Math.round(e.target.scrollLeft / e.target.offsetWidth)
              if (idx !== galleryView.index && idx >= 0 && idx < galleryView.urls.length) {
                setGalleryView(g => ({
                  ...g,
                  index: idx,
                  log: g.logsMap ? g.logsMap[idx] : g.log
                }))
              }
            }}
            style={{ flex: 1 }}>
            {galleryView.urls.map((url, i) => {
              const isSel = gallerySelected.has(url)
              return (
                <div key={i} className="gallery-swipe-item" style={{ position: 'relative' }}
                  onClick={() => {
                    if (gallerySelectMode) {
                      setGallerySelected(prev => { const n = new Set(prev); n.has(url) ? n.delete(url) : n.add(url); return n })
                    }
                  }}>
                  <img src={url} alt={`${i + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none', opacity: gallerySelectMode && !isSel ? 0.45 : 1, transition: 'opacity 0.2s' }} />
                  {gallerySelectMode && (
                    <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${isSel ? '#007AFF' : 'rgba(255,255,255,0.7)'}`, background: isSel ? '#007AFF' : 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSel && <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* FIX 1: Bottom toolbar — action buttons trigger select mode */}
          {!gallerySelectMode && (
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-around', background: 'rgba(0,0,0,0.8)', flexShrink: 0 }}>
              <button onClick={() => handleGalleryAction('share')}
                style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
              </button>
              <button onClick={() => handleGalleryAction('save')}
                style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              </button>
              <button onClick={() => toggleStar(galleryView.log.id, galleryView.log.is_starred)}
                style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={galleryView.log.is_starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </button>
              <button onClick={() => handleGalleryAction('delete')}
                style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3B30' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            </div>
          )}

          {/* Thumbnail strip */}
          {galleryView.urls.length > 1 && !gallerySelectMode && (
            <div className="no-sb" style={{ padding: '10px 16px', display: 'flex', gap: '6px', overflowX: 'auto', background: 'rgba(0,0,0,0.7)', flexShrink: 0 }}>
              {galleryView.urls.map((url, i) => (
                <img key={i} src={url} alt={`Thumb ${i}`}
                  onClick={() => { setGalleryView(g => ({ ...g, index: i })); const el = document.querySelector('.gallery-swipe'); if (el) el.scrollTo({ left: i * el.offsetWidth, behavior: 'smooth' }) }}
                  style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: i === galleryView.index ? '2px solid #007AFF' : '2px solid transparent', opacity: i === galleryView.index ? 1 : 0.55, flexShrink: 0, transition: 'opacity 0.2s, border 0.2s' }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VIDEO LIGHTBOX ── */}
      {videoLightbox && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
            <button onClick={() => setVideoLightbox(null)} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => shareMedia(videoLightbox.url, getFilenameFromUrl(videoLightbox.url))} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
              </button>
              <button onClick={() => saveMediaToDevice(videoLightbox.url)} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              </button>
              <button onClick={() => { setDeleteConfirm(videoLightbox.log); setVideoLightbox(null) }} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3B30' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
              <button onClick={() => toggleStar(videoLightbox.log.id, videoLightbox.log.is_starred)} style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'rgba(60,60,67,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={videoLightbox.log.is_starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <video src={videoLightbox.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </div>
        </div>
      )}

      {/* ── DOCUMENT VIEWER ── */}
      {docViewer && (
        <DocumentViewer url={docViewer.url} filename={docViewer.filename} mimeType={docViewer.mimeType}
          onClose={() => setDocViewer(null)}
          onDelete={() => { const log = docViewer.log; setDocViewer(null); if (log) setDeleteConfirm(log) }}
          onShare={() => shareMedia(docViewer.url, docViewer.filename)}
        />
      )}

      {/* ── FIX 2+5: Attachment preview with swipe gallery ── */}
      {previewIndex !== null && selectedFiles.length > 0 && <AttachmentPreview files={selectedFiles} initialIndex={previewIndex} onClose={() => setPreviewIndex(null)} />}

      {/* ── SHARE SHEET (simplified — uses native share) ── */}
      {shareSheet && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShareSheet(null)}>
          <div style={{ background: 'rgba(30,30,32,0.97)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '600px', padding: '20px 20px 40px', border: '0.5px solid rgba(255,255,255,0.1)', animation: 'slideUp 0.25s ease-out' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)', margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={async () => { await shareMedia(shareSheet.url, shareSheet.filename); setShareSheet(null) }} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '16px', cursor: 'pointer', textAlign: 'left' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                Share to App
              </button>
              <button onClick={async () => { try { await navigator.clipboard.writeText(shareSheet.url) } catch {} setShareSheet(null) }} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '16px', cursor: 'pointer', textAlign: 'left' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                Copy Link
              </button>
              <button onClick={async () => { await saveMediaToDevice(shareSheet.url); setShareSheet(null) }} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '16px', cursor: 'pointer', textAlign: 'left' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                Save to Device
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bottom-glass-area" />

      <div className="nav-bar-wrap">
        <div className="liquid-glass-nav" style={{ display: 'flex', alignItems: 'center', borderRadius: '40px', padding: '8px 16px' }}>
          {[{ tab: 'home', path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' }, { tab: 'library', path: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' }, { tab: 'settings', path: null }].map(({ tab, path }) => (
            <button key={tab} onClick={() => {
              if (activeTab === tab) {
                if (tab === 'home' && homeScrollRef.current) homeScrollRef.current.scrollTo({ top: homeScrollRef.current.scrollHeight, behavior: 'smooth' })
                if (tab === 'library' && libraryScrollRef.current) {
                  if (libraryFilter === 'media') {
                    libraryScrollRef.current.scrollTo({ top: libraryScrollRef.current.scrollHeight, behavior: 'smooth' })
                  } else {
                    libraryScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }
              } else {
                setActiveTab(tab)
                if (tab === 'home') setTimeout(() => scrollToBottom(homeScrollRef), 60)
              }
            }} className="nav-btn"
              style={{ background: activeTab === tab ? 'rgba(0,122,255,0.2)' : 'none', border: 'none', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '30px' }}>
              {tab === 'settings'
                ? <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === tab ? '#007AFF' : 'rgba(255,255,255,0.75)'}><circle cx="12" cy="8" r="4"/><path d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z"/></svg>
                : <svg width="26" height="26" viewBox="0 0 24 24" fill={activeTab === tab ? '#007AFF' : 'rgba(255,255,255,0.75)'}><path d={path}/></svg>
              }
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SwipeableLogItem({ log, onDelete, onStar, renderContent, getLogIcon, formatTimestamp }) {
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showAction, setShowAction] = useState(null)
  const startX = useRef(0), startY = useRef(0)
  const isSwiping = useRef(false)
  const containerRef = useRef(null)

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY
    isSwiping.current = false; setIsDragging(true)
  }
  const handleTouchMove = (e) => {
    if (!isDragging) return
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current
    if (!isSwiping.current) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
      if (Math.abs(dy) > Math.abs(dx)) { setIsDragging(false); return }
      isSwiping.current = true
    }
    e.preventDefault()
    setOffsetX(Math.max(-150, Math.min(150, dx)))
    setShowAction(dx > 30 ? 'star' : dx < -30 ? 'delete' : null)
  }
  const handleTouchEnd = () => {
    setIsDragging(false)
    if (isSwiping.current) { if (offsetX > 80) onStar(); else if (offsetX < -80) onDelete() }
    setOffsetX(0); setShowAction(null); isSwiping.current = false
  }

  useEffect(() => {
    const el = containerRef.current; if (!el) return
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  })

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {showAction === 'star' && offsetX > 0 && (
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${Math.min(offsetX, 150)}px`, display: 'flex', alignItems: 'center', paddingLeft: '16px', zIndex: 1 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </div>
        </div>
      )}
      {showAction === 'delete' && offsetX < 0 && (
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: `${Math.min(Math.abs(offsetX), 150)}px`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '16px', zIndex: 1 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF3B30"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </div>
        </div>
      )}
      <div style={{ padding: '16px 0', borderBottom: '0.5px solid rgba(142,142,147,0.2)', background: '#000', position: 'relative', zIndex: 2, transform: `translateX(${offsetX}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease-out' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'rgba(0,122,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {getLogIcon(log)}
          </div>
          <div style={{ flex: 1 }}>
            {renderContent(log)}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>{formatTimestamp(log.created_at)}</p>
              {log.is_starred && <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppNew