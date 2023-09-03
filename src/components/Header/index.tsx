import { useSession, signIn, signOut } from 'next-auth/react'
import styles from './Header.module.css'
import Link from 'next/link'

const Header = () => {
  const { data: session, status } = useSession()

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Board<span>+</span>
            </h1>
          </Link>

          {session?.user && (
            <Link href="/dashboard" className={styles.link}>
              Meu Painel
            </Link>
          )}
        </nav>

        {status === 'loading' ? (
          <div></div>
        ) : session ? (
          <button className={styles.loginButton} onClick={() => signOut()}>
            Olá {session?.user?.name}
          </button>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => signIn('google')}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  )
}

export default Header
