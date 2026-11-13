import { COPY } from '@/lib/copy';
import Link from 'next/link';
import { LoginForm } from '@/components/login-form';
export default function Login() { return <main className="login-page"><div className="login-brand"><Link className="wordmark" href="/">{COPY.brand.name}<span>.</span></Link><h1>{COPY.admin.login.title}</h1><p>{COPY.admin.login.description}</p></div><section className="login-card"><h2>{COPY.admin.login.welcome}</h2><p>{COPY.admin.login.instruction}</p><LoginForm/></section></main>; }
