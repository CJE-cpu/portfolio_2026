import { useRef, useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import styles from './Contact.module.scss'
import githubIcon from '../../assets/github-original.svg'
import copyIcon from '../../assets/icons8-clipboard.png'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState('')
  const [copyMessage, setCopyMessage] = useState('')
  const sending = useRef(false)
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  const configured = Boolean(serviceId && templateId && publicKey)
  const [submitOpened, setSubmitOpened] = useState(false)
  const openButton = useRef<HTMLButtonElement>(null)

  const copyLink = async () => {
    setCopyMessage('')
    try {
      await navigator.clipboard.writeText('jthe2817@naver.com')
      setCopyMessage('이메일 주소가 복사되었습니다.')
    } catch {
      setCopyMessage('복사하지 못했습니다. 이메일 주소를 직접 선택해 복사해 주세요.')
    }
  }

  const openSendMessage = () => {
    setSubmitOpened((opened) => !opened)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending.current) return
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('이름, 답장받을 이메일, 메시지를 모두 입력해 주세요.')
      return
    }
    if (!configured) {
      setStatus('폼 전송을 준비 중입니다. 아래 이메일로 연락해 주세요.')
      return
    }
    sending.current = true
    setPending(true)
    setStatus('메시지를 보내고 있습니다.')
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: name.trim(),
          from_name: name.trim(),
          email: email.trim(),
          reply_to: email.trim(),
          message: message.trim(),
        },
        { publicKey },
      )
      setStatus('메시지가 전송되었습니다. 연락 주셔서 감사합니다!')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus(
        '전송하지 못했습니다. 입력 내용은 유지됩니다. 다시 시도하거나 아래 이메일로 연락해 주세요.',
      )
    } finally {
      sending.current = false
      setPending(false)
    }
  }

  return (
    <div>
      <h2 id="contact-heading">Contact</h2>
      <div className={styles.contact_intro}>
        <h3>함께 일할 기회를 기다립니다.</h3>
        <p>채용 제안이나 궁금한 점을 남겨주세요. 보내주신 이메일로 답장드리겠습니다.</p>
      </div>
      <div className={styles.contact_card}>
        <div>
          <h3>E-MAIL</h3>
          <div className={styles.email_row}>
            <span>jthe2817@naver.com</span>
            <button
              ref={openButton}
              type="button"
              aria-expanded={submitOpened}
              aria-controls="contact-message-form"
              onClick={openSendMessage}
              className={styles.message_open}
            >
              {submitOpened ? '닫기' : '메일 보내기'}
            </button>
            <button
              type="button"
              className={styles.copy_button}
              onClick={copyLink}
              aria-label="이메일 주소 복사"
              title="이메일 주소 복사"
            >
              <img className={styles.copy_icon} src={copyIcon} alt="" width="24" height="24" />
            </button>
          </div>
          <p className={styles.copy_status} role="status" aria-live="polite">
            {copyMessage}
          </p>
        </div>
        <div>
          <h3>GITHUB</h3>
          <a
            href="https://github.com/CJE-cpu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CJE-cpu GitHub (새 탭에서 열림)"
          >
            <span className={styles.contact_link_label}>
              <img className={styles.contact_icon} src={githubIcon} alt="" width="24" height="24" />
              <span>github.com/CJE-cpu</span>
            </span>
          </a>
        </div>
      </div>
      <form
        id="contact-message-form"
        className={submitOpened ? styles.contact_form : styles.contact_form_closed}
        onSubmit={handleSubmit}
        aria-busy={pending}
      >
        <div className={styles.form_header}>
          <p className={styles.form_caption}>A NOTE TO ME</p>
          <button
            className={styles.close_button}
            type="button"
            aria-label="문의 폼 닫기"
            onClick={() => {
              setSubmitOpened(false)
              openButton.current?.focus()
            }}
          >
            ×
          </button>
        </div>
        <fieldset disabled={pending}>
          <legend>문의 내용</legend>
          <div className={styles.form_row}>
            <label>
              이름
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="성함 또는 회사명"
              />
            </label>
            <label>
              답장받을 이메일
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label>
            메시지
            <textarea
              name="message"
              required
              maxLength={5000}
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="함께하고 싶은 일이나 궁금한 내용을 적어주세요."
            />
          </label>
          <p className={styles.form_note}>
            입력한 이름, 이메일, 메시지는 문의 전달을 위해 EmailJS로 전송됩니다.
          </p>
          <div className={styles.form_actions}>
            <button type="submit" disabled={!configured || pending}>
              {pending ? '보내는 중…' : '메일 보내기'}
            </button>
          </div>
        </fieldset>
        {!configured && (
          <p className={styles.form_note}>폼 전송을 준비 중입니다. 아래 이메일로 연락해 주세요.</p>
        )}
        <p className={styles.form_status} role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </div>
  )
}
export default Contact
