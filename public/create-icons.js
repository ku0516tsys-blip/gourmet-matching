const { createCanvas } = require('canvas')
const fs = require('fs')

function createIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#ec4899')
  gradient.addColorStop(1, '#f97316')
  ctx.fillStyle = gradient
  ctx.roundRect(0, 0, size, size, size * 0.2)
  ctx.fill()
  
  // 絵文字
  ctx.font = `${size * 0.5}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🍽', size / 2, size / 2)
  
  return canvas.toBuffer('image/png')
}

fs.writeFileSync('public/icon-192.png', createIcon(192))
fs.writeFileSync('public/icon-512.png', createIcon(512))
console.log('Icons created!')
