import React, { useRef, useEffect, useState } from 'react'
import './Maincontent.css'
import { jsPDF } from 'jspdf'

const Maincontent = () => {
  const canvasRef = useRef(null)
  const [penColor, setPenColor] = useState('#000000')
  const [penWidth, setPenWidth] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    resizeCanvas()
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    if (isFullScreen) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    } else {
      canvas.width = window.innerWidth
      canvas.height = 400
    }
    context.putImageData(imageData, 0, 0)
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
    setTimeout(resizeCanvas, 0)
  }

  const preventScroll = (e) => {
    if (isDrawing) {
      e.preventDefault()
    }
  }

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getEventCoords(e)
    const context = canvasRef.current.getContext('2d')
    context.strokeStyle = penColor
    context.lineWidth = penWidth
    context.beginPath()
    context.moveTo(offsetX, offsetY)
    setIsDrawing(true)
    document.body.addEventListener('touchmove', preventScroll, { passive: false })
  }

  const draw = (e) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = getEventCoords(e)
    const context = canvasRef.current.getContext('2d')
    context.lineTo(offsetX, offsetY)
    context.stroke()
  }

  const stopDrawing = () => {
    const context = canvasRef.current.getContext('2d')
    context.closePath()
    setIsDrawing(false)
    document.body.removeEventListener('touchmove', preventScroll)
  }

  const handleDoubleClick = () => {
    if (isFullScreen) {
      toggleFullScreen()
    }
  }

  const getEventCoords = (e) => {
    if (e.nativeEvent) e = e.nativeEvent
    if (e.touches && e.touches.length > 0) {
      return { offsetX: e.touches[0].pageX - e.target.offsetLeft, offsetY: e.touches[0].pageY - e.target.offsetTop }
    }
    return { offsetX: e.offsetX, offsetY: e.offsetY }
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  const downloadImage = (format) => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `canvas.${format}`
    link.href = canvas.toDataURL(`image/${format}`)
    link.click()
  }

  const downloadPDF = () => {
    const canvas = canvasRef.current
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF()
    pdf.addImage(imgData, 'PNG', 0, 0)
    pdf.save('canvas.pdf')
  }

  return (
    <div className={`maincontent ${isFullScreen ? 'fullscreen' : ''}`}>
      {!isFullScreen && (
        <button id="enter-canvas-btn" onClick={toggleFullScreen}>Enter Canvas</button>
      )}
      <div className="top-buttons">
        <label htmlFor="bg-color-picker">Change Background: </label>
        <input type="color" className="color" id="bg-color-picker" onChange={(e) => {
          const canvas = canvasRef.current
          const context = canvas.getContext('2d')
          context.fillStyle = e.target.value
          context.fillRect(0, 0, canvas.width, canvas.height)
        }} />
        <label htmlFor="pen-color-picker">Change Pen Color: </label>
        <input type="color" className="color" id="pen-color-picker" value={penColor} onChange={(e) => setPenColor(e.target.value)} />
        <label htmlFor="pen-width-picker">Change Pen Width: </label>
        <input type="range" id="pen-width-picker" min="1" max="10" value={penWidth} onChange={(e) => setPenWidth(e.target.value)} />
      </div>
      <div className="canvas">
        <canvas
          id="signature-pad"
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onDoubleClick={handleDoubleClick}
        />
      </div>
      <div className="bottom-buttons">
        <button id="clear-btn" onClick={handleClear}>Clear</button>
        <button id="download-png" onClick={() => downloadImage('png')}>Download as PNG</button>
        <button id="download-jpg" onClick={() => downloadImage('jpeg')}>Download as JPG</button>
        <button id="download-pdf" onClick={downloadPDF}>Download as PDF</button>
      </div>
    </div>
  )
}

export default Maincontent
