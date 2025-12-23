import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  title: string
  count: number
  icon: string
  href: string
  color: string
}

export default function CategoryCard({ title, count, icon, href, color }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 group-hover:opacity-100 transition-opacity`} />
      <div className="relative p-8 text-white">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-white/90 mb-4">{count} profiles</p>
        <div className="flex items-center text-sm font-semibold">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

