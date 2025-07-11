"use client"
import { Search, FileText, CreditCard, Package, Truck, CheckCircle, ArrowRight, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface HowHamzaWorksProps {
  selectedLanguage: string
}

const workflowSteps = [
  {
    id: 1,
    title: "Browse & Select",
    description: "Discover products from verified sellers worldwide",
    icon: Search,
  },
  {
    id: 2,
    title: "Smart Contract Creation",
    description: "Secure escrow automatically created for your transaction",
    icon: FileText,
  },
  {
    id: 3,
    title: "Secure Payment",
    description: "Pay with your preferred cryptocurrency",
    icon: CreditCard,
  },
  {
    id: 4,
    title: "Order Processing",
    description: "Seller prepares and ships your order",
    icon: Package,
  },
  {
    id: 5,
    title: "Delivery & Confirmation",
    description: "Receive your order and confirm satisfaction",
    icon: Truck,
  },
  {
    id: 6,
    title: "Automatic Settlement",
    description: "Smart contract releases payment to seller",
    icon: CheckCircle,
  },
]

export default function HowHamzaWorks({ selectedLanguage }: HowHamzaWorksProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
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

  return (
    <section id="how-it-works" className="max-w-[1200px] mx-auto px-4 relative z-10" ref={ref}>
      {/* Typography Hierarchy - Section Header with Green Theme */}
      <motion.div
        className="text-center mb-16 sm:mb-20 lg:mb-32"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Overline with proper tracking */}
        <div className="text-gray-500 text-xs sm:text-sm font-light tracking-[0.2em] uppercase mb-4 sm:mb-6">
          Process Overview
        </div>

        {/* Primary heading with mobile-optimized scale */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-6 sm:mb-8 tracking-tight leading-[1.1] px-2">
          How <span className="text-green-400 font-medium">Hamza</span> Works
        </h2>

        {/* Subtitle with mobile-optimized text size */}
        <div className="max-w-3xl mx-auto px-2">
          <p className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed text-gray-300 tracking-wide">
            Experience seamless, secure, and transparent e-commerce through our innovative blockchain-powered platform.
          </p>
        </div>

        {/* Visual separator */}
        <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto mt-6 sm:mt-8"></div>
      </motion.div>

      {/* Desktop Flow - Hidden on mobile */}
      <div className="hidden lg:block mb-24">
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-6 gap-6 items-start">
            {workflowSteps.map((step, index) => (
              <motion.div key={step.id} className="relative flex flex-col items-center" variants={stepVariants}>
                {/* Step Icon with proper spacing and alignment */}
                <motion.div
                  className="relative z-10 bg-gradient-to-br from-green-400/20 to-green-500/20 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-8"
                  whileHover={{
                    scale: 1.1,
                    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.4))",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <step.icon className="h-12 w-12 text-green-400" />
                </motion.div>

                {/* Arrow between steps - Fixed positioning */}
                {index < workflowSteps.length - 1 && (
                  <motion.div
                    className="absolute top-12 -right-3 transform -translate-y-1/2 z-0"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <motion.div
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-6 w-6 text-gray-600" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Step Content with typography hierarchy and proper alignment */}
                <motion.div
                  className="text-center w-full"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="space-y-4">
                    {/* Step number with proper styling */}
                    <div className="text-green-400 text-sm font-medium tracking-[0.1em] uppercase">Step {step.id}</div>

                    {/* Step title with proper weight and spacing */}
                    <h3 className="text-white font-medium text-lg leading-tight tracking-wide px-2">{step.title}</h3>

                    {/* Visual separator */}
                    <div className="w-8 h-px bg-gray-700 mx-auto"></div>

                    {/* Description with proper line spacing and alignment */}
                    <p className="text-gray-400 text-sm leading-relaxed tracking-wide px-2">{step.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile & Tablet Flow - Enhanced for mobile */}
      <motion.div
        className="lg:hidden space-y-8 sm:space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {workflowSteps.map((step, index) => (
          <motion.div key={step.id} className="relative" variants={stepVariants}>
            <div className="flex items-start space-x-4 sm:space-x-6 lg:space-x-8">
              {/* Step Icon - Mobile-optimized */}
              <motion.div
                className="relative z-10 bg-gradient-to-br from-green-400/20 to-green-500/20 rounded-xl sm:rounded-2xl w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 flex items-center justify-center flex-shrink-0"
                whileHover={{
                  scale: 1.1,
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.4))",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <step.icon className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-green-400" />
              </motion.div>

              {/* Step Content - Mobile-optimized */}
              <motion.div
                className="flex-1 pt-1 sm:pt-2"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="space-y-2 sm:space-y-4">
                  {/* Step number */}
                  <div className="text-green-400 text-xs sm:text-sm font-medium tracking-[0.1em] uppercase">
                    Step {step.id}
                  </div>

                  {/* Step title */}
                  <h3 className="text-white font-medium text-lg sm:text-xl leading-tight tracking-wide">
                    {step.title}
                  </h3>

                  {/* Visual separator */}
                  <div className="w-8 sm:w-12 h-px bg-gray-700"></div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed tracking-wide pr-2">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Arrow between steps - Mobile-optimized */}
            {index < workflowSteps.length - 1 && (
              <motion.div
                className="flex justify-center mt-6 sm:mt-8 ml-8 sm:ml-10"
                initial={{ opacity: 0, y: -10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
