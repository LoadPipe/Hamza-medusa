"use client"
import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface LandingPageHeroProps {
  selectedLanguage: string
}

export default function LandingPageHero({ selectedLanguage }: LandingPageHeroProps) {
  const cryptoLogos = [
    { name: "Bitcoin", icon: "/icons/bitcoin.svg" },
    { name: "Ethereum", icon: "/icons/ethereum.svg" },
    { name: "USDT", icon: "/icons/tether.svg" },
    { name: "USDC", icon: "/icons/usdc.svg" },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-purple-500/20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(128, 0, 128, 0.1) 0%, transparent 50%)`,
          }}
        ></div>
      </motion.div>

      {/* Desktop/Web Version - Hidden on mobile */}
      <div className="hidden sm:block max-w-[1200px] mx-auto text-center relative z-10 w-full">
        <div className="space-y-12 lg:space-y-16">
          {/* Typography Hierarchy - Primary Headline */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Overline - Small caps with tracking */}
            <motion.div
              className="text-gray-400 text-xs sm:text-sm font-light tracking-[0.2em] uppercase mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              The Future of Commerce
            </motion.div>

            {/* Primary Display Type */}
            <h1 className="space-y-2 sm:space-y-4 lg:space-y-6">
              <motion.div
                className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-extralight leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                  Decentralized
                </span>
              </motion.div>

              <motion.div
                className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-light leading-[0.9] tracking-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                E-Commerce
              </motion.div>

              {/* Reimagined with crypto icons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 pt-2 sm:pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <span className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-light text-white tracking-tight">
                  Reimagined
                </span>

                {/* Crypto Icons */}
                <motion.div
                  className="flex items-center gap-4 sm:gap-6 lg:gap-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                >
                  {cryptoLogos.map((crypto, index) => (
                    <motion.div
                      key={crypto.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 1.0 + index * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <Image
                        src={crypto.icon || "/placeholder.svg"}
                        alt={`${crypto.name} logo`}
                        width={40}
                        height={40}
                        className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 opacity-80"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </h1>

            {/* Subtitle */}
            <motion.div
              className="pt-6 sm:pt-8 lg:pt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            >
              <p className="text-lg sm:text-xl lg:text-3xl font-light leading-relaxed text-gray-300 max-w-4xl mx-auto tracking-wide px-4">
                The world's first truly decentralized marketplace where buyers and sellers trade directly, securely, and
                transparently on the blockchain.
              </p>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="pt-12 lg:pt-20 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => document.getElementById("what-is-hamza")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex flex-col items-center space-y-4 sm:space-y-6 text-gray-400 hover:text-green-400 transition-colors duration-500"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center space-y-2">
                <div className="text-xs sm:text-sm font-medium tracking-[0.15em] uppercase">Learn More</div>
                <div className="w-12 sm:w-16 h-px bg-gray-600 group-hover:bg-green-400 transition-colors duration-500 mx-auto"></div>
              </div>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Version - Only visible on mobile */}
      <div className="block sm:hidden max-w-[400px] mx-auto text-center relative z-10 w-full py-8">
        <div className="space-y-8">
          {/* Typography Hierarchy - Mobile Optimized */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Overline */}
            <motion.div
              className="text-gray-400 text-xs font-light tracking-[0.2em] uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              The Future of Commerce
            </motion.div>

            {/* Mobile-optimized heading stack */}
            <div className="space-y-3">
              <motion.div
                className="text-3xl font-extralight leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                  Decentralized
                </span>
              </motion.div>

              <motion.div
                className="text-2xl font-light leading-[0.9] tracking-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                E-Commerce
              </motion.div>

              <motion.div
                className="text-xl font-light text-white tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                Reimagined
              </motion.div>
            </div>

            {/* Mobile crypto icons - 2x2 grid */}
            <motion.div
              className="grid grid-cols-4 gap-4 justify-items-center max-w-48 mx-auto pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              {cryptoLogos.map((crypto, index) => (
                <motion.div
                  key={crypto.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.0 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Image
                    src={crypto.icon || "/placeholder.svg"}
                    alt={`${crypto.name} logo`}
                    width={32}
                    height={32}
                    className="h-8 w-8 opacity-80"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile subtitle */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            >
              <p className="text-sm font-light leading-relaxed text-gray-300 tracking-wide px-2">
                The world's first truly decentralized marketplace where buyers and sellers trade directly, securely, and
                transparently on the blockchain.
              </p>
            </motion.div>
          </motion.div>

          {/* Mobile Call to Action */}
          <motion.div
            className="pt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => document.getElementById("what-is-hamza")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex flex-col items-center space-y-3 text-gray-400 hover:text-green-400 transition-colors duration-500"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center space-y-2">
                <div className="text-xs font-medium tracking-[0.15em] uppercase">Learn More</div>
                <div className="w-10 h-px bg-gray-600 group-hover:bg-green-400 transition-colors duration-500 mx-auto"></div>
              </div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <ArrowDown className="h-4 w-4" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
