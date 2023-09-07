import { ChangeEvent, FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import styles from './Task.module.css'
import { FiTrash } from 'react-icons/fi'

import { db } from '../../services/firebaseConection'
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore'

interface TaskProps {
  item: {
    task: string
    created: string
    public: boolean
    user: string
    taskId: string
  }
  allComments: CommentsProps[]
}

interface CommentsProps {
  id: string
  comment: string
  taskId: string
  user: string
  name: string
}

const Task = ({ item, allComments }: TaskProps) => {
  const { data: session } = useSession()

  const [input, setInput] = useState('')
  const [comments, setComments] = useState<CommentsProps[]>(allComments || [])

  const handleComment = async (event: FormEvent) => {
    event.preventDefault()

    if (input === '') return

    if (!session?.user?.email || !session?.user?.name) return

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId
      })

      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId
      }

      setComments(oldItems => [...oldItems, data])
      setInput('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteComment = async (id: string) => {
    try {
      const docRef = doc(db, 'comments', id)
      await deleteDoc(docRef)
      
      const deleteComment = comments.filter(item => item.id !== id)
      setComments(deleteComment)
    } catch (error) {
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
            placeholder="Digite seu comentário..."
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setInput(event.target.value)
            }}
          />
          <button
            className={styles.button}
            type="submit"
            disabled={!session?.user}
          >
            Enviar comentário
          </button>
        </form>
      </section>

      <section className={styles.commentsContainer}>
        <h2>Todos os comentários</h2>
        {comments.length === 0 && (
          <span>Nenhum comentário foi encontrado...</span>
        )}

        {comments.map((item) => (
          <>
            <div className={styles.headComment}>
              <label className={styles.commentLabel}>{item.name}</label>

              {item.user === session?.user?.email && (
                <button
                  className={styles.trash}
                  onClick={() => handleDeleteComment(item.id)}
                >
                  <FiTrash size={18} color="#ffffff" />
                </button>
              )}
            </div>

            <article key={item.id} className={styles.comment}>
              <p>{item.comment}</p>
            </article>
          </>
        ))}
      </section>
    </div>
  )
}

export default Task


import { GetServerSideProps } from 'next'
import Textarea from '@/src/components/Textarea'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string
  const docRef = doc(db, 'tasks', id)

  const q = query(collection(db, 'comments'), where('taskId', '==', id))
  const snapshotComments = await getDocs(q)

  let allComments: CommentsProps[] = []
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    })
  })

  console.log(allComments)

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
    taskId: id,
  }

  return {
    props: {
      item: task,
      allComments: allComments,
    },
  }
}
