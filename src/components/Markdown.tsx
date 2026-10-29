import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import Mermaid from './Mermaid'
import { stepOfItem } from '../content/roadmap'

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      urlTransform={(url) => url} // keep concept: links; we route them ourselves below
      components={{
        a({ href = '', children }) {
          if (href.startsWith('concept:')) {
            const item = href.slice('concept:'.length)
            return <Link className="concept-link" to={`/step/${stepOfItem(item)}?item=${item}`}>{children}</Link>
          }
          if (!/^https?:/.test(href)) return <span>{children}</span>
          return <a href={href} target="_blank" rel="noreferrer">{children}</a>
        },
        code({ className, children }) {
          const lang = /language-(\w+)/.exec(className ?? '')?.[1]
          if (lang === 'mermaid') return <Mermaid code={String(children).trim()} />
          return <code className={className}>{children}</code>
        },
        pre({ children }) {
          return <div className="pre-wrap">{children}</div>
        },
        table({ children }) {
          return <div className="table-wrap"><table>{children}</table></div>
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
