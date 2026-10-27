
import { useState } from 'react'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [modo, setModo] = useState('login')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = (event) => {
  event.preventDefault()
  setMensagem('')

  if (modo === 'cadastro') {
    if (senha.length < 6) {
      setMensagem('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.')
      return
    }

   setMensagem(
  'Validação concluída! O cadastro ainda não foi salvo. A criação de contas reais será habilitada quando conectarmos a autenticação.'
)
return
  }

  if (modo === 'recuperacao') {
    if (!email.trim()) {
      setMensagem('Digite seu e-mail.')
      return
    }

   
setMensagem(
  'Solicitação recebida apenas para demonstração. Nenhum e-mail foi enviado. A recuperação real será habilitada quando conectarmos um serviço de autenticação.'
)
return

  }

if (!email.trim() || !senha) {
  setMensagem('Preencha o e-mail e a senha.')
  return
}

setMensagem('Entrando no modo demonstrativo...')

  onLogin({
    email: email.trim(),
  })
}

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">ROTA+</div>

      <h1>
  {modo === 'login'
    ? 'Bem-vindo ao ROTA+'
    : modo === 'cadastro'
      ? 'Criar conta'
      : 'Recuperar senha'}
</h1>

<p className="login-subtitle">
  {modo === 'login'
    ? 'Entre para planejar suas rotas.'
    : modo === 'cadastro'
      ? 'Crie sua conta para começar.'
      : 'Informe seu e-mail para continuar.'}
</p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">
              E-mail
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </div>
        {modo !== 'recuperacao' && (
          <div className="login-field">
            <label htmlFor="login-senha">
              Senha
            </label>

            <input
              id="login-senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>
)}
{modo === 'cadastro' && (
  <div className="login-field">
    <label htmlFor="confirmar-senha">
      Confirmar senha
    </label>

    <input
      id="confirmar-senha"
      type="password"
      placeholder="Digite a senha novamente"
      value={confirmarSenha}
      onChange={(event) =>
        setConfirmarSenha(event.target.value)
      }
      autoComplete="new-password"
      required
    />
  </div>
)}
          <button type="submit" className="login-button">
  {modo === 'login'
    ? 'Entrar'
    : modo === 'cadastro'
      ? 'Criar conta'
      : 'Enviar instruções'}
</button>
        </form>
{mensagem && (
  <p className="login-message" role="status">
    {mensagem}
  </p>
)}

<div className="login-links">
  {modo === 'login' && (
    <>
      <button
        type="button"
        onClick={() => {
          setModo('recuperacao')
          setMensagem('')
        }}
      >
        Esqueci minha senha
      </button>

      <p>
        Ainda não tem conta?{' '}
        <button
          type="button"
          onClick={() => {
            setModo('cadastro')
            setMensagem('')
          }}
        >
          Criar conta
        </button>
      </p>
    </>
  )}

  {modo !== 'login' && (
    <button
      type="button"
      onClick={() => {
        setModo('login')
        setMensagem('')
        setConfirmarSenha('')
      }}
    >
      Voltar para o login
    </button>
  )}
</div>
        <p className="login-footer">
          ROTA+ — Encontre o caminho para seu destino.
        </p>
      </section>
    </main>
  )
}

export default Login
