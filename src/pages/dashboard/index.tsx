import { GetServerSideProps } from 'next'
import styles from './Dashboard.module.css'
import Head from 'next/head'

import { getSession } from 'next-auth/react'
import Textarea from '@/src/components/Textarea'
import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual é a sua tarefa?</h1>

            <form>
              <Textarea placeholder="Digite qual sua tarefa..." />
              <div className={styles.checkboxArea}>
                <input
                  id="public"
                  type="checkbox"
                  className={styles.checkbox }
                />
                <label htmlFor="public">Deixar tarefa pública</label>
              </div>

              <button type="submit" className={styles.button}>
                Registrar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>

          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label className={styles.tag}>PÚBLICO</label>

              <button className={styles.shareButton}>
                <FiShare2 size={22} color="#16963c" />
              </button>
            </div>

            <div className={styles.taskContent}>
              <p>Minha primeira tarefa de exemplo</p>
              <button className={styles.trash}>
                <FaTrash
                  size={24}
                  color='#ea3140'
                />
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (!session?.user) {
    // if there is no user, redirect to home page
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
