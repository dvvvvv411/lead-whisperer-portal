
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
					dark: '#13151F',  // Darker blue-black
					darker: '#0B0D14', // Even darker blue-black
					card: '#1A1F2E',   // Dark blue background
					highlight: '#252C40' // Slightly lighter blue for hover
				},
				neon: {
					blue: '#3C80FF',
					purple: '#9945FF',
					teal: '#14F0DE',
					pink: '#FF00D6'
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
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-gold': 'pulse-gold 2s infinite',
				'gradient-shift': 'gradient-shift 3s ease infinite',
				'float': 'float 3s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out'
			},
			backgroundImage: {
				'casino-gradient': 'linear-gradient(to right, #13151F, #1A1F2E, #13151F)',
				'gold-gradient': 'linear-gradient(90deg, #FFD700, #FFC107, #FFD700)',
				'accent-gradient': 'linear-gradient(90deg, #8B5CF6, #6366F1, #8B5CF6)',
				'futuristic-grid': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg2MCwxMjgsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')",
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
				'neon-glow': 'radial-gradient(circle, rgba(60,128,255,0.15) 0%, rgba(153,69,255,0.05) 70%, rgba(0,0,0,0) 100%)',
			},
			boxShadow: {
				'neon': '0 0 20px rgba(60, 128, 255, 0.4)',
				'neon-purple': '0 0 20px rgba(153, 69, 255, 0.4)',
				'neon-gold': '0 0 20px rgba(255, 215, 0, 0.4)',
			},
			backdropFilter: {
				'subtle': 'blur(8px)',
				'medium': 'blur(12px)',
				'strong': 'blur(16px)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
