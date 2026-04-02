type Provider = 'youtube' | 'vimeo' | 'dailymotion' | 'facebook'

export function getEmbedUrl(provider: Provider, videoId: string): string {
  switch (provider) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}`
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}`
    case 'dailymotion':
      return `https://www.dailymotion.com/embed/video/${videoId}`
    case 'facebook': {
      const fbHref = videoId.startsWith('http')
        ? videoId
        : `https://www.facebook.com/video.php?v=${videoId}`
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(fbHref)}&show_text=false&width=560`
    }
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
    case 'facebook': {
      // Extract numeric video ID from full URLs like:
      // https://www.facebook.com/dvidra/videos/123 or
      // https://www.facebook.com/61555.../videos/123/
      const fbId = videoId.startsWith('http')
        ? videoId.replace(/\/$/, '').split('/').pop() ?? videoId
        : videoId
      return `https://graph.facebook.com/${fbId}/picture`
    }
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
