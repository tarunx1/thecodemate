/** Developer-owned, allowlisted visual explanations. CMS text never selects executable code. */
import { COPY } from '@/lib/copy';
export type VisualStep = { heading: string; text: string };
function StepsVisualization({ steps }: { steps: VisualStep[] }) { if (!steps.length) return null; return <section className="steps" aria-labelledby="visual-steps-title"><h2 id="visual-steps-title">{COPY.public.article.visualExplanation}</h2>{steps.map((step, index) => <div className="step" key={`${index}-${step.heading}`}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.heading}</h3><p>{step.text}</p></div></div>)}</section>; }
const registry = { steps: StepsVisualization } as const;
export type VisualizationKey = keyof typeof registry;
export function Visualization({ kind, steps }: { kind: VisualizationKey; steps: VisualStep[] }) { const Component = registry[kind]; return <Component steps={steps}/>; }
