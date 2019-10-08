import defaultSettings from '@/settings'

const title = defaultSettings.title || '湖南中烟运维'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
