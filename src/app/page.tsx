import styles from 'src/styles/Home.module.css'
import Image from 'next/image'

import heroImg from 'public/assets/hero.svg'

export const Home = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt='Logo Board+'
            src={heroImg}
            priority
          />
        </div>

        <h1 className={styles.title}>
          Sistema feito para você organizar <br />
          seus estudos e tarefas!
        </h1>
      </main>
    </div>
  )
}

export default Home