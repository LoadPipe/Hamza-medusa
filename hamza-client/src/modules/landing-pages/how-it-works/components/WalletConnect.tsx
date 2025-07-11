"use client"

import { useState, useRef } from "react"
import { Loader2 } from "lucide-react"

interface WalletConnectProps {
  translate: (key: string, lang?: string) => string
  selectedLanguage: string
}

export default function WalletConnect({ translate, selectedLanguage }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState("0x1234...5678")
  const audioRef = useRef<HTMLAudioElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleConnect = async () => {
    setIsConnecting(true)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsConnecting(false)
    setIsConnected(true)

    // Play sound effect after animation finishes
    if (audioRef.current) {
      try {
        await audioRef.current.play()
      } catch (error) {
        console.error("Error playing audio:", error)
      }
    }
  }

  const menuItems = [
    { label: "Copy Address", action: () => navigator.clipboard.writeText(walletAddress) },
    { label: "View on Explorer", action: () => window.open("https://etherscan.io", "_blank") },
    { label: "Disconnect", action: () => setIsConnected(false) },
  ]

  return (
    <div className="relative">
      <audio ref={audioRef}>
        <source src="/success.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {!isConnected ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`
            px-6 py-3 bg-[#00ff00] bg-opacity-20 text-[#00ff00] rounded-full 
            border border-[#00ff00] hover:bg-opacity-30 transition-all duration-200 
            text-sm font-medium shadow-[0_0_10px_rgba(0,255,0,0.3)] 
            hover:shadow-[0_0_15px_rgba(0,255,0,0.5)]
            flex items-center justify-center
          `}
        >
          {isConnecting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          {translate("Connect Wallet", selectedLanguage)}
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-[#121212] rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff00]" />
            <span className="text-white text-sm font-medium">{walletAddress}</span>
          </div>

          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl"
          >
            😎
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-2 w-48 bg-black border border-gray-800 rounded-lg shadow-lg z-50"
            >
              <div className="p-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
