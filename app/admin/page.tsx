'use client'
import dynamic from 'next/dynamic'
import config from '../../.tina/config'

export default function AdminPage() {
  const TinaAdmin = dynamic(() => import('tinacms').then(m => m.TinaAdmin), { ssr: false })
  return <TinaAdmin config={config} />
}
