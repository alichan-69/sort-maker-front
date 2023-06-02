import Logo from '../assets/images/Logo.png'
import NoImage from '../assets/images/NoImage.png'
import NoUserImage from '../assets/images/NoUserImage.png'

// ========================================
// canvasからのblobの取得処理
// ========================================

export const getCanvasBlob = async (canvas: HTMLCanvasElement) => {
  return await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((blob) => resolve(blob))
  )
}

// ========================================
// urlからのblobの取得処理
// ========================================

export const getUrlBlob = async (url: string) => {
  return await new Promise<Blob>((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      resolve(xhr.response)
    }
    xhr.send()
  })
}

// ========================================
// 相対パスから絶対パスを取得する処理
// =========================================
export const getAbsolutePath = (path: string) => {
  const baseUrl = location.href
  const url = new URL(path, baseUrl)
  return url.href
}

// ========================================
// assets内の画像の絶対パス
// =========================================
export const LOGO_URL = getAbsolutePath(Logo)
export const NO_IMAGE_URL = getAbsolutePath(NoImage)
export const NO_USER_IMAGE_URL = getAbsolutePath(NoUserImage)
