import html2canvas from 'html2canvas'
import { onMounted, ref, reactive } from 'vue'
import { $fetch } from 'ofetch'

export default function useFeedback() {
  interface FeedbackMessage {
    userId?: string
    title: string | null
    category: string | null
    body: string | null
  }

  interface Feedback extends FeedbackMessage {
    image: {
      blob: any
      src: string | null
    }
    userInfo?: {}
  }

  const feedback = reactive<Feedback>({
    title: null,
    body: null,
    category: null,
    image: {
      blob: null,
      src: null
    }
  })

  function addFeedback(message: FeedbackMessage) {
    const minFeedbackLength = 6
    const maxFeedbackLength = 240
    if (!message.title) {
      // setError("no title provided for feedback issue");
      return
    }

    if (message.title.length < minFeedbackLength) {
      // setError("message too short");
      return
    }

    if (message.title.length > maxFeedbackLength) {
      // setError("message too long");
      return
    }
    feedback.body = message.body
    feedback.title = message.title
    feedback.category = message.category
    feedback.userInfo = { id: message.userId ?? 'default' }
    console.log('feedback', feedback)
  }

  // Checks & Utils
  type Compression = 'lossy' | 'lossless' | 'alpha' | 'animation'

  async function checkWebpFeature(feature: Compression): Promise<boolean> {
    return new Promise((resolve) => {
      const kTestImages = {
        lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
        lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
        alpha:
          'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
        animation:
          'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
      }

      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = 'data:image/webp;base64,' + kTestImages[feature]
    })
  }

  // Use this inside your setup function
  const webpSupport = ref(false)

  onMounted(async () => {
    for (const feature of ['lossy', 'lossless', 'alpha', 'animation'] as Compression[]) {
      const result = await checkWebpFeature(feature)
      if (result) {
        webpSupport.value = true
        break
      }
    }
  })

  // Check video support:

  // const types = [
  //   "video/webm",
  //   "audio/webm",
  //   "video/webm;codecs=vp8",
  //   "video/webm;codecs=daala",
  //   "video/webm;codecs=h264",
  //   "audio/webm;codecs=opus",
  //   "video/mpeg",
  // ];

  // for (const type of types) {
  //   console.log(
  //     `Is ${type} supported? ${
  //       MediaRecorder.isTypeSupported(type) ? "Maybe!" : "Nope :("
  //     }`,
  //   );
  // }

  const saveDrawing = async (ctx: CanvasRenderingContext2D) => {
    // Capture the HTML content of the page
    const documentWidth = document.documentElement.scrollWidth
    const documentHeight = document.documentElement.scrollHeight
    const htmlCanvas = await html2canvas(document.body, {
      // Options for html2canvas, adjust as necessary
      logging: true,
      useCORS: true,
      // Set the width and height to capture the full page content
      windowWidth: documentWidth,
      windowHeight: documentHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      scale: 1 // Adjust scale as necessary to manage image size and quality
    })

    // Create a new canvas to combine the HTML content and the drawings
    const maxWidth = 900
    const scale = maxWidth / documentWidth
    const scaledWidth = maxWidth // Max width is 900px
    const scaledHeight = documentHeight * scale
    const combinedCanvas = document.createElement('canvas')
    combinedCanvas.width = scaledWidth
    combinedCanvas.height = scaledHeight
    const combinedCtx = combinedCanvas.getContext('2d')

    if (!combinedCtx) {
      console.error('Could not create combined canvas context')
      return
    }

    // Apply scaling to fit the new dimensions
    combinedCtx.scale(scale, scale)

    // Draw the HTML content image onto the combined canvas, considering the scaling
    combinedCtx.drawImage(htmlCanvas, 0, 0)

    if (!ctx) {
      console.error('Could not get drawing canvas context')
      return
    }

    // Draw the canvas with the drawings onto the combined canvas, considering the scaling
    combinedCtx.drawImage(ctx.canvas, 0, 0)
    const exportMimeType = webpSupport.value ? 'image/webp' : 'image/jpeg'

    const dataURL = combinedCanvas.toDataURL(exportMimeType, 0.8)
    feedback.image.src = dataURL

    combinedCanvas.toBlob(
      async (blob) => {
        if (!blob) {
          console.error('Could not create blob from canvas')
          return
        }

        feedback.image.blob = blob
        feedback.body = 'updated message body'
        feedback.title = 'updated message title'
        const formData = new FormData()
        formData.append('file', blob, `drawing.${exportMimeType.split('/')[1]}`)

        console.log('formData', formData)
        const { error } = await $fetch('/api/feedback', {
          method: 'POST',
          body: formData
        })

        if (error.value) {
          throw new Error(`error updating users: ${error.value}`)
        }
      },
      exportMimeType,
      0.8
    )
  }

  return {
    saveDrawing,
    addFeedback,
    feedback
  }
}
