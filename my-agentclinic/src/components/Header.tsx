import { NavLink } from 'react-router-dom'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'layout-nav-link layout-nav-link-active' : 'layout-nav-link'

export default function Header() {
  return (
    <header className="layout-header">
      <h1>AgentClinic is open for business</h1>
      <nav className="layout-nav" aria-label="Primary">
        <ul>
          <li>
            <NavLink to="/agents" className={navLinkClassName}>
              Agents
            </NavLink>
          </li>
          <li>
            <NavLink to="/ailments" className={navLinkClassName}>
              Ailments
            </NavLink>
          </li>
          <li>
            <NavLink to="/therapies" className={navLinkClassName}>
              Therapies
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={navLinkClassName}>
              Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
