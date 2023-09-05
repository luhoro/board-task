import { GetServerSideProps } from 'next'
import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import styles from './Dashboard.module.css'
import Head from 'next/head'

import { getSession } from 'next-auth/react'
import Textarea from '@/src/components/Textarea'
import { FiShare2, FiTrash } from 'react-icons/fi'

import { db } from 'src/services/firebaseConection'
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc
} from 'firebase/firestore'
import Link from 'next/link'

interface DashboardProps {
  user: {
    email: string
  }
}

interface TaskProps {
  id: string
  created: Date
  public: boolean
  task: string
  user: string
}

const Dashboard = ({ user }: DashboardProps) => {
  
  const [input, setInput] = useState('')
  const [publicTask, setPublicTask] = useState(false)
  const [tasks, setTasks] = useState<TaskProps[]>([])

  useEffect(() => {
    const loadTarefas = async () => {
      const tarefasRef = collection(db, 'tasks')
      const q = query(
        tarefasRef,
        orderBy('created', 'desc'),
        where('user', '==', user?.email)
      )

      onSnapshot(q, (snapshot) => {
        let lista = [] as TaskProps[]

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            task: doc.data().task,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          })
        })

        setTasks(lista)
      })
    }

    loadTarefas()
  }, [user?.email])

  const handleChangePublic = (event: ChangeEvent<HTMLInputElement>) => {
    setPublicTask(event.target.checked)
  }

  const handleRegisterTask = async (event: FormEvent) => {
    event.preventDefault()

    if (input === '') return

    try {
      await addDoc(collection(db, 'tasks'), {
        task: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      })

      setInput('')
      setPublicTask(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleShare = async (id: string) => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    )
    alert('URL copiada com sucesso!')
  }

  const handleDeleteTask = async (id: string) => {
    const docRef = doc(db, 'tasks', id)
    await deleteDoc(docRef)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual é a sua tarefa?</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Digite qual sua tarefa..."
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  id="public"
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
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

          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PÚBLICO</label>

                  <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                    <FiShare2 size={22} color="#16963c" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>

                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.task}</p>
                  </Link>
                ) : (
                  <p>{item.task}</p>
                )}

                <button className={styles.trash} onClick={() => handleDeleteTask(item.id)}>
                  <FiTrash size={22} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
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
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  }
}
