import { HTMLProps } from 'react'
import styles from './Textarea.module.css'

const Textarea = ({ ...rest}: HTMLProps<HTMLTextAreaElement>) => {
  return (
    <textarea className={styles.textarea} {...rest} ></textarea>
  )
}

export default Textarea