import { useNavigate } from 'react-router-dom';
import {
  Home,
  Stethoscope,
  Bot,
  Activity,
  HeartPulse,
  TrendingUp,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from './dock';
import './dock.css';

const items = [
  { title: 'Home', desc: 'Dashboard overview', icon: Home, path: '/' },
  {
    title: 'Services',
    desc: 'Clinical services & AI consultation',
    icon: Stethoscope,
    path: '/services',
  },
  {
    title: 'Ask AI',
    desc: 'Chat with the PulseCare assistant',
    icon: Bot,
    path: '/chatbot',
  },
  {
    title: 'Screening',
    desc: 'Early disease risk assessment',
    icon: Activity,
    path: '/early-detection',
  },
  {
    title: 'My Health',
    desc: 'Medications, prescriptions & reports',
    icon: HeartPulse,
    path: '/my-health',
  },
  {
    title: 'Improve',
    desc: 'Hydration, steps & prevention',
    icon: TrendingUp,
    path: '/improve',
  },
];

export function AppleStyleDock() {
  const navigate = useNavigate();

  return (
    <div className="apple-dock-wrap">
      <Dock>
        {items.map((item) => (
          <DockItem
            key={item.path}
            onClick={() => navigate(item.path)}
            aria-label={item.title}
          >
            <DockLabel>
              <span className="dock-label-title">{item.title}</span>
              <span className="dock-label-desc">{item.desc}</span>
            </DockLabel>
            <DockIcon>
              <item.icon className="dock-icon-svg" />
            </DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}

export default AppleStyleDock;
