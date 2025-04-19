"use client"

export default function SoundcloudEmbed({ url }: { url: string }) {
  // Extract the path from the URL to use in the iframe src
  const getEmbedUrl = (originalUrl: string) => {
    try {
      // Create a URL object to parse the original URL
      const urlObj = new URL(originalUrl)
      // Get the pathname and search params
      const path = urlObj.pathname + urlObj.search
      // Return the embed URL
      return `https://w.soundcloud.com/player/?url=https://soundcloud.com${path}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`
    } catch (error) {
      console.error("Error parsing SoundCloud URL:", error)
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(originalUrl)}`
    }
  }

  return (
    <div className="w-full h-[300px] bg-black/30 border border-purple-900/30 rounded-md overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={getEmbedUrl(url)}
      ></iframe>
    </div>
  )
}
