import Image from 'next/image'
import styles from './page.module.css'
import TodoApp from '@/app/TodoApp'
import Link from 'next/link'
import Navbar from './Navbar'
export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <TodoApp />
    </main>
  )
}