type Provider = 'youtube' | 'vimeo' | 'dailymotion' | 'facebook'

export function getEmbedUrl(provider: Provider, videoId: string): string {
  switch (provider) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}`
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}`
    case 'dailymotion':
      return `https://www.dailymotion.com/embed/video/${videoId}`
    case 'facebook':
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=${videoId}&show_text=false`
    default:
      return ''
  }
}

export function getThumbnailUrl(provider: Provider, videoId: string): string {
  switch (provider) {
    case 'youtube':
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    case 'vimeo':
      return `https://vumbnail.com/${videoId}.jpg`
    case 'dailymotion':
      return `https://www.dailymotion.com/thumbnail/video/${videoId}`
    case 'facebook':
      return `https://graph.facebook.com/${videoId}/picture`
    default:
      return ''
  }
}

export function getProviderLabel(provider: Provider): string {
  const labels: Record<Provider, string> = {
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    dailymotion: 'Dailymotion',
    facebook: 'Facebook',
  }
  return labels[provider] || provider
}
