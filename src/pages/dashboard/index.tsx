import styles from './Dashboard.module.css'
import Head from 'next/head'

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

       <h1>Página inicial</h1>
    </div>
  )
}

export default Dashboard