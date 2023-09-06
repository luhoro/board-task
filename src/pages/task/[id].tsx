import { ChangeEvent, FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import styles from './Task.module.css'

import { db } from '../../services/firebaseConection'
import { doc, collection, query, where, getDoc, addDoc } from 'firebase/firestore'

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

  const { data: session } = useSession()
  const [input, setInput] = useState('')

  const handleComment = async (event: FormEvent) => {
    event.preventDefault()
    
    if (input === '') return

    if (!session?.user?.email || !session?.user?.email) return

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId 
      })

      setInput('')
    } catch(error) {
      console.log(error)
    }
  }

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
        
        <form onSubmit={handleComment}>
          <Textarea
            placeholder='Digite seu comentário...'
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setInput(event.target.value)
            }}
          />
          <button
            className={styles.button}
            type='submit'
            disabled={!session?.user}
          >
            Enviar comentário
          </button>
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
