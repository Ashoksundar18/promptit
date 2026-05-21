import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { ExternalLink, GitBranch, MessageCircle } from 'lucide-react';

const linkGroups = [
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'AI Tools', href: '/#ai-tools' },
      { label: 'Templates', href: '/templates' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

const socials = [
  { icon: ExternalLink, href: 'https://twitter.com', label: 'Twitter' },
  { icon: GitBranch, href: 'https://github.com', label: 'GitHub' },
  { icon: MessageCircle, href: 'https://discord.com', label: 'Discord' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-glass-border">
      {/* Glass background */}
      <div className="glass-panel">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">
            {/* Brand column */}
            <div className="md:col-span-2">
              <Logo size="sm" animated />
              <p className="mt-4 text-sm text-text-secondary max-w-xs leading-relaxed">
                Your AI Prompt Engineering Hub. Smarter prompts for every
                platform, every workflow.
              </p>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-3">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 rounded-lg flex items-center justify-center glass border border-glass-border text-text-muted hover:text-accent-blue hover:border-accent-blue/30 transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Link groups */}
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-heading font-semibold text-text-primary mb-4 uppercase tracking-wider">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-muted hover:text-accent-blue transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              Made with ⚡ by{' '}
              <span className="text-accent-blue font-medium">Prompt It</span>
            </p>
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} Prompt It. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
