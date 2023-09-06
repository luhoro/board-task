import Head from 'next/head'
import styles from './Task.module.css'

import { db } from '../../services/firebaseConection'
import { doc, collection, query, where, getDoc } from 'firebase/firestore'

interface TaskProps {
  item: {
    task: string
    created: string
    public: boolean
    user: string
    taskId: string
  }
}

const Task = ({ item }: TaskProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa </h1>

        <article className={styles.task}>
          <p>{item.task}</p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Deixar um comentário</h2>
        
        <form>
          <Textarea
            placeholder='Digite seu comentário...'
          />
          <button className={styles.button} type='submit'>Enviar comentário</button>
        </form>
      </section>
    </div>
  )
}

export default Task

import React from 'react'
import { GetServerSideProps } from 'next'
import Textarea from '@/src/components/Textarea'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string
  const docRef = doc(db, 'tasks', id)
  const snapshot = await getDoc(docRef)

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000

  const task = {
    task: snapshot.data()?.task,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    taskId: id
  }

  return {
    props: {
      item: task
    },
  }
}
