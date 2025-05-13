
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				gold: {
					DEFAULT: '#FFD700',
					light: '#FFDF33',
					dark: '#E6C200',
					foreground: '#000000'
				},
				accent1: {
					DEFAULT: '#8B5CF6',
					light: '#A78BFA',
					dark: '#7C3AED',
					foreground: '#FFFFFF'
				},
				casino: {
					dark: '#1A1F2C',
					darker: '#12151E',
					card: '#21283B',
					highlight: '#313950'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-gold': {
					'0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.4)' },
					'50%': { boxShadow: '0 0 0 10px rgba(255, 215, 0, 0)' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow-pulse': {
					'0%, 100%': { opacity: '0.6' },
					'50%': { opacity: '1' }
				},
				'coin-transfer': {
					'0%': { transform: 'translateX(0) translateY(0)', opacity: '1' },
					'80%': { transform: 'translateX(100px) translateY(30px)', opacity: '1' },
					'100%': { transform: 'translateX(110px) translateY(35px)', opacity: '0' }
				},
				'wallet-receive': {
					'0%': { opacity: '0', transform: 'scale(0.2)' },
					'50%': { opacity: '0.8', transform: 'scale(1.2)' },
					'100%': { opacity: '0', transform: 'scale(1.5)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-gold': 'pulse-gold 2s infinite',
				'gradient-shift': 'gradient-shift 3s ease infinite',
				'float': 'float 3s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'coin-transfer': 'coin-transfer 2s ease-in-out forwards',
				'wallet-receive': 'wallet-receive 0.5s ease-in-out forwards'
			},
			backgroundImage: {
				'casino-gradient': 'linear-gradient(to right, #1A1F2C, #21283B, #1A1F2C)',
				'gold-gradient': 'linear-gradient(90deg, #FFD700, #FFC107, #FFD700)',
				'accent-gradient': 'linear-gradient(90deg, #8B5CF6, #6366F1, #8B5CF6)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
