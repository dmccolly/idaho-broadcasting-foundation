'use client'

import { Calendar, ExternalLink } from 'lucide-react'
import { Article } from '@/lib/supabase'

interface ArticleCardProps {
  article: Article
  className?: string
}

export default function ArticleCard({ article, className = '' }: ArticleCardProps) {
  return (
    <article className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-500" />
          <time className="text-sm text-gray-500">{article.date}</time>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-500">By {article.author}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {article.excerpt}
        </p>
        
        <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Read More
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </article>
  )
}

