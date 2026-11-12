import Link from 'next/link';
import { LoginForm } from '@/components/login-form';
export default function Login() { return <main className="login-page"><div className="login-brand"><Link className="wordmark" href="/">thecodemate<span>.</span></Link><h1>Your editorial workspace.</h1><p>Create, preview, and publish visual technology stories.</p></div><section className="login-card"><h2>Welcome back</h2><p>Sign in to manage your content.</p><LoginForm/></section></main>; }
