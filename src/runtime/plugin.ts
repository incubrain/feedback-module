import { UAParser } from 'ua-parser-js'
import { defineNuxtPlugin, useRoute, useRouter } from '#imports'
import { reactive, ref } from 'vue'

const parser = new UAParser()

interface BrowserDetails {
  name: string | undefined
  version: string | undefined
  engine: string | undefined
  engineVersion: string | undefined
}

interface OSDetails {
  name: string | undefined
  version: string | undefined
}

interface ScreenDetails {
  resolution: string
  windowSize: string
  pixelRatio: number
}

interface NetworkDetails {
  connectionType: string
  rtt: number
  downlink: number
}

interface FeatureSupport {
  javascriptEnabled: boolean
  cookiesEnabled: boolean
  localStorageEnabled: boolean
  sessionStorageEnabled: boolean
  webRTCSupport: boolean
  webGLSupport: boolean
  touchSupport: boolean
}

interface UserPreferences {
  language: string
  timezone: string
  prefersDarkMode: boolean
}

interface AccessibilityFeatures {
  highContrastMode: boolean // Placeholder, actual detection may vary
  screenReaderUse: boolean // Placeholder, actual detection may vary
}

interface BrowserInfo {
  userAgent: BrowserDetails
  os: OSDetails
  screen: ScreenDetails
  network: NetworkDetails
  features: FeatureSupport
  preferences: UserPreferences
  accessibility: AccessibilityFeatures
  currentURL: string
  hardwareConcurrency: number
  ram: number
  mediaDevices: MediaDeviceInfo[]
  userAgentData: NavigatorUAData | undefined
}

const browserInfo = reactive<BrowserInfo>({
  userAgent: {} as BrowserDetails,
  os: {},
  screen: { resolution: '', windowSize: '', pixelRatio: 0 },
  network: { connectionType: '', rtt: 0, downlink: 0 },
  features: {
    javascriptEnabled: true,
    cookiesEnabled: false,
    localStorageEnabled: false,
    sessionStorageEnabled: false,
    webRTCSupport: false,
    webGLSupport: false,
    touchSupport: false
  },
  preferences: { language: '', timezone: '', prefersDarkMode: false },
  accessibility: { highContrastMode: false, screenReaderUse: false },
  currentURL: '',
  hardwareConcurrency: 0,
  mediaDevices: [],
  userAgentData: undefined
})

interface Navigations {
  path: string
  duration: number
}

interface MouseEvents {
  target?: EventTarget
  x: number
  y: number
  type: 'click' | 'rage'
}

interface ErrorLogs {
  message: string
  filename: string
  lineno: number
  colno: number
}

const telemetry = reactive({
  sessionDuration: 0,
  navigations: [] as Navigations[],
  mouseEvents: [] as MouseEvents[]
})

const errorLogs = ref<ErrorLogs[]>([])

export default defineNuxtPlugin((nuxtApp) => {
  const route = useRoute()
  const router = useRouter()
  let start = new Date()

  // Mouse Events
  router.afterEach(() => {
    const end = new Date()
    const duration = end.getTime() - start.getTime()
    start = new Date()
    telemetry.sessionDuration += duration
    telemetry.navigations.push({ path: route.path, duration })
  })

  const clickCount = ref(0)
  const clickThreshold = 5 // Threshold for detecting rage clicks
  const clicksDuration = 1000 // Duration to reset click count
  let clickTimer: ReturnType<typeof setTimeout> | null = null

  // const mouseClickHandler = (event: MouseEvent) => {
  //   // Click events
  //   telemetry.mouseEvents.push({
  //     x: event.clientX,
  //     y: event.clientY,
  //     type: "click",
  //   });

  //   // Handle rage clicks
  //   clickCount.value++;
  //   clickTimer = setTimeout(() => {
  //     clickCount.value = 0;
  //   }, clicksDuration);

  //   if (clickCount.value === clickThreshold) {
  //     console.log("Rage click detected");
  //     // store target element, etc.
  //     telemetry.mouseEvents.push({
  //       target: event.target,
  //       x: event.clientX,
  //       y: event.clientY,
  //       type: "rage",
  //     });

  //     clickCount.value = 0;
  //     clearTimeout(clickTimer);
  //     clickTimer = null;
  //   }
  // };

  nuxtApp.provide('telemetry', telemetry)
  nuxtApp.provide('errorLogs', errorLogs)

  // Browser Info
  nuxtApp.hook('app:mounted', async () => {
    // window.addEventListener("click", mouseClickHandler);

    const uaResult = parser.getResult()

    browserInfo.userAgent = {
      name: uaResult.browser.name,
      version: uaResult.browser.version,
      engine: uaResult.engine.name,
      engineVersion: uaResult.engine.version
    }

    browserInfo.os = {
      name: uaResult.os.name,
      version: uaResult.os.version
    }

    browserInfo.screen = {
      resolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio
    }

    browserInfo.network = {
      connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
      rtt: navigator.connection ? navigator.connection.rtt : 0,
      downlink: navigator.connection ? navigator.connection.downlink : 0
    }

    browserInfo.features = {
      javascriptEnabled: true, // This is assumed as the script is running
      cookiesEnabled: navigator.cookieEnabled,
      localStorageEnabled: typeof Storage !== 'undefined',
      sessionStorageEnabled: typeof sessionStorage !== 'undefined',
      webRTCSupport: typeof RTCPeerConnection !== 'undefined',
      webGLSupport: !!window.WebGLRenderingContext,
      touchSupport:
        'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    }

    browserInfo.preferences = {
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      prefersDarkMode:
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    browserInfo.currentURL = window.location.href.split('?')[0] // Excludes query parameters for privacy

    browserInfo.device = {
      type: navigator.deviceMemory ? 'mobile' : 'desktop',
      hardwareConcurrency: navigator.hardwareConcurrency,
      ram: navigator.deviceMemory || 0,
      platform: navigator.platform
    }

    if (navigator.mediaDevices) {
      browserInfo.mediaDevices = await navigator.mediaDevices.enumerateDevices()
    }

    if (navigator.userAgentData) {
      browserInfo.userAgentData = navigator.userAgentData
    }
  })

  nuxtApp.provide('browserInfo', browserInfo)

  // Errors
  nuxtApp.vueApp.config.errorHandler = (err, target, info) => {
    console.log('error', err, target, info)
    errorLogs.value.push({
      message: err.message,
      filename: info,
      lineno: err.line,
      colno: err.column
    })
    return true
  }
})
