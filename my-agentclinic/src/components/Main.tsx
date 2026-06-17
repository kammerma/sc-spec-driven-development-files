import type { ReactNode } from 'react'

export default function Main({ children }: { children: ReactNode }) {
  return <main className="layout-main">{children}</main>
}
