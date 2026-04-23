import { Link, NavLink } from 'react-router-dom'
import type { User } from '../types'
import { roleLabels } from '../utils/auth'

type HeaderProps = {
  user: User | null
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="topbar">
      <Link className="brand" to={user?.role === 'admin' ? '/admin' : user ? '/' : '/auth'}>
        <span className="brand-mark">NT</span>
        <div>
          <strong>NovaTech</strong>
          <span>Hệ thống tài khoản và phân quyền</span>
        </div>
      </Link>

      <nav className="nav">
        {!user ? <NavLink to="/auth">Đăng nhập</NavLink> : null}
        {user?.role === 'customer' ? <NavLink to="/">Trang chủ</NavLink> : null}
        {user?.role === 'admin' ? <NavLink to="/admin">Quản trị</NavLink> : null}
      </nav>

      <div className="header-actions">
        {user ? (
          <button className="ghost-button" onClick={onLogout} type="button">
            Đăng xuất
          </button>
        ) : null}

        <div className="mini-stat">
          <span>{user ? roleLabels[user.role] : 'Trạng thái'}</span>
          <strong>{user ? user.email.split('@')[0] : 'Chưa đăng nhập'}</strong>
        </div>
      </div>
    </header>
  )
}
