"use client"

import { ShoppingCart, Lock, Package, CheckCircle, DollarSign, Gift, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface InfographicSectionProps {
  selectedLanguage: string
}

export default function InfographicSection({ selectedLanguage }: InfographicSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const steps = [
    {
      id: 1,
      title: "Buyer Adds to Cart",
      description: "Customer selects products and proceeds to checkout",
      icon: ShoppingCart,
    },
    {
      id: 2,
      title: "Escrow Created",
      description: "Smart contract holds funds securely",
      icon: Lock,
    },
    {
      id: 3,
      title: "Seller Ships Product",
      description: "Product is shipped to buyer",
      icon: Package,
    },
    {
      id: 4,
      title: "Buyer Confirms Receipt",
      description: "Buyer confirms product received",
      icon: CheckCircle,
    },
    {
      id: 5,
      title: "Funds Released",
      description: "Payment released to seller",
      icon: DollarSign,
    },
    {
      id: 6,
      title: "DECOM Rewards",
      description: "Both parties earn DECOM tokens",
      icon: Gift,
    },
  ]

  const stepVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <section id="infographic" className="max-w-[1200px] mx-auto px-4 relative z-10" ref={ref}>
      {/* Typography Hierarchy - Section Header with Purple Theme */}
      <motion.div
        className="text-center mb-16 sm:mb-20 lg:mb-32"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Overline */}
        <div className="text-gray-500 text-xs sm:text-sm font-light tracking-[0.2em] uppercase mb-4 sm:mb-6">
          Transaction Journey
        </div>

        {/* Primary heading - Mobile-optimized */}
        <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-light text-white mb-6 sm:mb-8 tracking-tight leading-[1.1] px-2">
          Hamza <span className="text-purple-400 font-medium">Transaction Flow</span>
        </h2>

        {/* Subtitle - Mobile-optimized */}
        <div className="max-w-3xl mx-auto px-2">
          <p className="text-base sm:text-lg lg:text-2xl font-light leading-relaxed text-gray-300 tracking-wide">
            See how every transaction on Hamza is secured and automated through our smart contract system.
          </p>
        </div>

        {/* Visual separator */}
        <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6 sm:mt-8"></div>
      </motion.div>

      {/* Desktop Flow - Hidden on mobile/tablet */}
      <div className="hidden lg:block">
        <motion.div
          className="flex items-start justify-between max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div key={step.id} className="flex items-start relative" variants={stepVariants}>
              <div className="flex flex-col items-center text-center">
                {/* Step Icon - Fixed alignment */}
                <motion.div
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-400/20 to-purple-500/20 flex items-center justify-center mb-8"
                  whileHover={{
                    scale: 1.15,
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.4))",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <step.icon className="h-12 w-12 text-purple-400" />
                </motion.div>

                {/* Step Content - Fixed width and alignment */}
                <div className="w-40 space-y-4">
                  {/* Step number */}
                  <div className="text-purple-400 text-sm font-medium tracking-[0.1em] uppercase">Step {step.id}</div>

                  {/* Step title */}
                  <motion.h3
                    className="font-medium text-base lg:text-lg text-white leading-tight tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    {step.title}
                  </motion.h3>

                  {/* Visual separator */}
                  <div className="w-8 h-px bg-gray-700 mx-auto"></div>

                  {/* Description */}
                  <motion.p
                    className="text-sm text-gray-400 leading-relaxed tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    {step.description}
                  </motion.p>
                </div>
              </div>

              {/* Arrow between steps - Fixed positioning */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute top-12 -right-8 transform -translate-y-1/2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-6 w-6 text-gray-600" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile & Tablet Flow - Enhanced for mobile */}
      <motion.div
        className="lg:hidden space-y-8 sm:space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="flex items-start space-x-4 sm:space-x-6 lg:space-x-8"
            variants={stepVariants}
          >
            {/* Step Icon - Mobile-optimized */}
            <motion.div
              className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-400/20 to-purple-500/20 flex items-center justify-center flex-shrink-0"
              whileHover={{
                scale: 1.1,
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.4))",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <step.icon className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-purple-400" />
            </motion.div>

            {/* Step Content - Mobile-optimized */}
            <motion.div
              className="flex-1 pt-1 sm:pt-2 space-y-2 sm:space-y-3"
              whileHover={{ x: 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Step number */}
              <div className="text-purple-400 text-xs sm:text-sm font-medium tracking-[0.1em] uppercase">
                Step {step.id}
              </div>

              {/* Step title */}
              <h3 className="font-medium text-white text-lg sm:text-xl leading-tight tracking-wide">{step.title}</h3>

              {/* Visual separator */}
              <div className="w-8 sm:w-12 h-px bg-gray-700"></div>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed tracking-wide pr-2">
                {step.description}
              </p>
            </motion.div>

            {/* Arrow between steps - Mobile-optimized */}
            {index < steps.length - 1 && (
              <motion.div
                className="flex justify-center ml-8 sm:ml-10 mt-6 sm:mt-8"
                initial={{ opacity: 0, y: -10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 rotate-90" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
