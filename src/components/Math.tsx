"use client"

import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import { cn } from "@/lib/utils"

interface MathRendererProps {
  tex: string
  block?: boolean
  className?: string
}

export default function MathRenderer({ tex, block = false, className }: MathRendererProps) {
  return (
    <span className={cn("inline-block", className)}>
      {block ? (
        <BlockMath math={tex} />
      ) : (
          <InlineMath math={tex} />
      )}
    </span>
  )
}
