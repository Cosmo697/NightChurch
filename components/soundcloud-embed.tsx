"use client"

export default function SoundcloudEmbed({ url }: { url: string }) {
  // This is a placeholder component that would normally embed a SoundCloud player
  // In a real implementation, you would use the SoundCloud iframe API

  return (
    <div className="w-full h-[300px] bg-black/30 border border-purple-900/30 rounded-md flex items-center justify-center">
      <div className="text-center p-4">
        <p className="text-lg font-bold mb-2">SoundCloud Player</p>
        <p className="text-sm text-muted-foreground mb-4">This would embed a SoundCloud player for:</p>
        <p className="text-purple-300 break-all">{url}</p>
      </div>
    </div>
  )
}
