<template>
  <div>
    <FeedbackCanvasToolbar
      ref="toolbar"
      class="fixed top-2 left-2 z-20"
      @undo="undo"
      @redo="redo"
      @clear-canvas="clearCanvas"
      @draw="setTool('draw')"
      @highlighter="setTool('highlighter')"
      @arrow="setTool('arrow')"
      @rectangle="setTool('rectangle')"
    />
    <canvas
      ref="drawingCanvas"
      loading="lazy"
      class="absolute top-0 left-0 bg-transparent z-10"
      :width="`${canvasDimensions.width}px`"
      :height="`${canvasDimensions.height}px`"
      @mousedown="handleStartDrawing"
      @mousemove="updateDrawing"
      @mouseup="stopDrawing"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive, watch, watchEffect } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { useColorMode } from '@vueuse/core'
import useFeedback from '../composables/useFeedback'
import FeedbackCanvasToolbar from './FeedbackCanvasToolbar.vue'

const mode = useColorMode()

interface DrawingObject {
  type: Tool
  start: Dimensions
  end?: Dimensions
  points?: Dimensions[]
}
const { saveDrawing, feedback } = useFeedback()

const isDark = computed(() => mode.value === 'dark')

const drawingCanvas = ref(null as HTMLCanvasElement | null)

const canvasDimensions = reactive({
  height: 0,
  width: 0
})

interface Dimensions {
  x: number
  y: number
}

const drawing = ref(false)

const config = reactive({
  color: computed(() => (isDark.value ? '#F2F2F2' : '#333333')),
  width: 2,
  alpha: 1
})

const ctx = ref<CanvasRenderingContext2D | null>(null)

watch(feedback, () => {
  console.log('saveDrawing', feedback)
  if (ctx.value) {
    console.log('saveDrawing2', feedback)
    saveDrawing(ctx.value)
  }
})

watchEffect(() => {
  if (drawingCanvas.value) {
    ctx.value = drawingCanvas.value.getContext('2d')
  }
})

const { x, y } = useMouseInElement(drawingCanvas)

watch(
  isDark,
  () => {
    redrawCanvas()
  },
  {
    immediate: false
  }
)

interface Dimensions {
  x: number
  y: number
}

interface Conf {
  color: string
  width: number
  alpha: number
}

interface DrawInput {
  start: Dimensions
  end: Dimensions
  conf?: Conf
}

function drawLineOrHighlight({
  start,
  end,
  conf = {
    color: config.color,
    width: 2,
    alpha: 1
  }
}: DrawInput) {
  if (!ctx.value) return
  ctx.value.beginPath()
  ctx.value.globalAlpha = conf.alpha
  ctx.value.strokeStyle = conf.color
  ctx.value.lineWidth = conf.width
  ctx.value.moveTo(start.x, start.y)
  ctx.value.lineTo(end.x, end.y)
  ctx.value.stroke()
}

function drawRectangle({ start, end }: DrawInput) {
  if (!ctx.value) return
  const widthRect = end.x - start.x
  const heightRect = end.y - start.y
  ctx.value.beginPath()
  ctx.value.globalAlpha = config.alpha
  ctx.value.strokeStyle = config.color
  ctx.value.lineWidth = config.width
  ctx.value.rect(start.x, start.y, widthRect, heightRect)
  ctx.value.stroke()
}

function drawArrow({ start, end }: DrawInput) {
  if (!ctx.value) return

  const headLength = 20 // Length of the arrow head
  const dx = end.x - start.x
  const dy = end.y - start.y
  const angle = Math.atan2(dy, dx)

  // Set styles
  ctx.value.globalAlpha = config.alpha
  ctx.value.strokeStyle = config.color
  ctx.value.fillStyle = config.color
  ctx.value.lineWidth = config.width

  // Draw line part of the arrow
  ctx.value.beginPath()
  ctx.value.moveTo(start.x, start.y)
  ctx.value.lineTo(end.x, end.y)
  ctx.value.stroke()

  // Draw the arrow head
  ctx.value.beginPath()
  ctx.value.moveTo(end.x, end.y)
  ctx.value.lineTo(
    end.x - headLength * Math.cos(angle - Math.PI / 6),
    end.y - headLength * Math.sin(angle - Math.PI / 6)
  )
  ctx.value.lineTo(
    end.x - headLength * Math.cos(angle + Math.PI / 6),
    end.y - headLength * Math.sin(angle + Math.PI / 6)
  )
  ctx.value.closePath()
  ctx.value.fill()
}

type Tool = 'draw' | 'arrow' | 'rectangle' | 'highlighter'
const activeTool = ref('draw' as Tool)

const setTool = (tool: Tool) => {
  activeTool.value = tool
}

function handleDrawingAction(start: Dimensions, end: Dimensions, isPreview = false) {
  // Temporary draw based on the active tool, without adding to drawings array
  if (!isPreview) {
    // Draw final shape on the canvas
    switch (activeTool.value) {
      case 'rectangle':
        drawRectangle({ start, end })
        break
      case 'arrow':
        drawArrow({ start, end })
        break
    }
  } else if (ctx.value && isPreview) {
    // Live preview logic, similar to above but not saved
    ctx.value.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height) // Clear canvas for live preview
    redrawCanvas() // Redraw existing drawings
    // Draw live preview
    switch (activeTool.value) {
      case 'rectangle':
        drawRectangle({ start, end })
        break
      case 'arrow':
        drawArrow({ start, end })
        break
    }
  }
}

const currentDrawing = ref(null as DrawingObject | null)
const drawings = ref([] as DrawingObject[])

const handleStartDrawing = () => {
  startDrawing()
}

const startDrawing = (touchValues = null as Dimensions | null) => {
  drawing.value = true
  // Initialize currentDrawing with start point and tool info
  const dimensions = touchValues ?? { x: x.value, y: y.value }

  currentDrawing.value = {
    type: activeTool.value,
    start: dimensions,
    points: [dimensions]
  }
}

const stopDrawing = () => {
  console.log('stopDrawing')
  if (!drawing.value || !currentDrawing.value) {
    return
  }
  console.log('stopDrawing2')

  currentDrawing.value.end = { x: x.value, y: y.value }

  drawings.value.push(currentDrawing.value)
  currentDrawing.value = null // Reset current drawing
  drawing.value = false
  redrawCanvas() // Redraw canvas with the new drawing added
}

const updateDrawing = () => {
  if (!drawing.value || !currentDrawing.value) return

  // Update only for live preview, not to save in drawings array yet
  const newPoint = { x: x.value, y: y.value }

  if (['draw', 'highlighter'].includes(activeTool.value)) {
    currentDrawing.value.points?.push(newPoint) // Add new point to points array
  }

  redrawCanvas() // First, redraw existing drawings to clear the previous live preview
  if (activeTool.value === 'draw') {
    freehandDraw({ drawing: currentDrawing.value })
  } else if (activeTool.value === 'highlighter') {
    freehandDraw({
      drawing: currentDrawing.value,
      conf: { color: 'orange', width: 10, alpha: 0.2 }
    })
  } else {
    handleDrawingAction(currentDrawing.value.start, newPoint, true) // The last parameter indicates live preview
  }
}

function freehandDraw({ drawing, conf = config }: { drawing: DrawingObject; conf?: Conf }) {
  if (drawing.points && drawing.points.length > 1) {
    for (let i = 0; i < drawing.points.length - 1; i++) {
      drawLineOrHighlight({
        start: drawing.points[i],
        end: drawing.points[i + 1],
        conf
      })
    }
  }
}

const redrawCanvas = () => {
  if (!ctx.value) return
  ctx.value.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height)

  // Draw current issue's drawings
  drawings.value.forEach((drawing) => {
    // Drawing logic here
    if (!ctx.value) return

    switch (drawing.type) {
      case 'draw':
        freehandDraw({ drawing })
        break
      case 'highlighter':
        freehandDraw({
          drawing,
          conf: { color: 'orange', width: 10, alpha: 0.2 }
        })
        break
      case 'rectangle':
        if (drawing.start && drawing.end) {
          drawRectangle({
            start: drawing.start,
            end: drawing.end
          })
        }
        break
      case 'arrow':
        console.log('drawingArrow', drawing)
        if (drawing.start && drawing.end) {
          drawArrow({ start: drawing.start, end: drawing.end })
        }
        break
    }

    ctx.value.stroke()
  })
}

// Touch Device Handlers:

function handleTouchStart(event: TouchEvent) {
  event.preventDefault()
  if (event.touches.length > 0) {
    const touch = event.touches[0] // Get the first touch
    const rect = event.target.getBoundingClientRect() // Get canvas position and size
    console.log('rect', rect, event)
    const touchX = touch.clientX - rect.left // Calculate touch X relative to canvas
    const touchY = touch.clientY - rect.top //
    startDrawing({ x: touchX, y: touchY })
  }
}

function handleTouchMove(event: TouchEvent) {
  event.preventDefault()
  updateDrawing()
}

function handleTouchEnd(event: TouchEvent) {
  event.preventDefault()
  stopDrawing()
}

// erase tools
const undoneLines = reactive<DrawingObject[]>([])
const undo = () => {
  if (drawings.value.length > 0) {
    const line = drawings.value.pop()
    if (line) undoneLines.push(line)
    redrawCanvas()
  }
}

const redo = () => {
  if (undoneLines.length > 0) {
    const line = undoneLines.pop()
    if (line) drawings.value.push(line)
    redrawCanvas()
  }
}

function clearCanvas() {
  console.log('clearing canvas')
  if (ctx.value) {
    drawings.value.splice(0, drawings.value.length)
    ctx.value.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height)

    console.log('clearing canvas2')
  }
}

// Function to disable clicks
const feedbackModeEnabled = ref(false)
function disableClicks(e) {
  if (feedbackModeEnabled.value) {
    e.preventDefault()
    e.stopPropagation()
  }
}

// Function to toggle feedback mode
// function toggleFeedbackMode() {
//   feedbackModeEnabled.value = !feedbackModeEnabled.value
//   if (feedbackModeEnabled.value) {
//     document.body.classList.add('custom-cursor')
//   } else {
//     document.body.classList.remove('custom-cursor')
//   }
// }

const toolbar = ref<HTMLElement | null>(null)
watch(feedbackModeEnabled, (newVal) => {
  if (newVal && document) {
    document.addEventListener(
      'click',
      function (e: MouseEvent) {
        // Check if the clicked element is inside the toolbar
        if (toolbar.value && !toolbar.value.contains(e.target)) {
          // Prevent the default action (click) from occurring
          console.log('clicking outside')
          e.preventDefault()
          e.stopPropagation()
        }
      },
      true
    )
  } else if (document) {
    document.removeEventListener('click', disableClicks, true)
  }
})

function resizeCanvas() {
  if (!drawingCanvas.value) {
    errors.value.push('Could not get drawing canvas context for resize')
    return
  }
  drawingCanvas.value.width = window.innerWidth
  drawingCanvas.value.height = window.innerHeight
  redrawCanvas()
}

onMounted(() => {
  // Resize canvas on window resize
  canvasDimensions.width = document.documentElement.clientWidth
  canvasDimensions.height = document.documentElement.scrollHeight
  window.addEventListener('resize', resizeCanvas)
})

// Errors
const errors = ref<string[]>([])

const setError = (error: string) => {
  errors.value.push(error)
}
</script>

<style scoped>
.custom-cursor {
  cursor: url('/cursor.cur'), auto;
}
</style>
