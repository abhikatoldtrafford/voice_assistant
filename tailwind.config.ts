import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // darkMode: ['class'],
  darkMode: 'media',
  theme: {
    extend: {
      // === TYPOGRAPHY ===
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      // === COLORS - ANTHROPIC PALETTE ===
      colors: {
        // Core design system colors (using RGBA format)
        border: 'rgba(var(--border), 1)',
        input: 'rgba(var(--input), 1)',
        ring: 'rgba(var(--ring), 1)',
        background: 'rgba(var(--background), 1)',
        foreground: 'rgba(var(--foreground), 1)',

        primary: {
          DEFAULT: 'rgba(var(--primary), 1)',
          foreground: 'rgba(var(--primary-foreground), 1)',
        },
        secondary: {
          DEFAULT: 'rgba(var(--secondary), 1)',
          foreground: 'rgba(var(--secondary-foreground), 1)',
        },
        destructive: {
          DEFAULT: 'rgba(var(--destructive), 1)',
          foreground: 'rgba(var(--destructive-foreground), 1)',
        },
        muted: {
          DEFAULT: 'rgba(var(--muted), 1)',
          foreground: 'rgba(var(--muted-foreground), 1)',
        },
        accent: {
          DEFAULT: 'rgba(var(--accent), 1)',
          foreground: 'rgba(var(--accent-foreground), 1)',
        },
        popover: {
          DEFAULT: 'rgba(var(--popover), 1)',
          foreground: 'rgba(var(--popover-foreground), 1)',
        },
        card: {
          DEFAULT: 'rgba(var(--card), 1)',
          foreground: 'rgba(var(--card-foreground), 1)',
        },

        // Brand colors inspired by Anthropic
        brand: {
          primary: 'rgba(var(--brand-primary), 1)',
          secondary: 'rgba(var(--brand-secondary), 1)',
          accent: 'rgba(var(--brand-accent), 1)',
          neutral: 'rgba(var(--brand-neutral), 1)',
        },

        // Neural/AI themed colors
        neural: {
          primary: 'rgba(var(--neural-primary), 1)',
          secondary: 'rgba(var(--neural-secondary), 1)',
          accent: 'rgba(var(--neural-accent), 1)',
        },

        // Semantic colors with custom accent mappings
        success: {
          DEFAULT: 'rgba(var(--success), 1)',
          50: 'rgba(var(--accent-green), 0.05)',
          100: 'rgba(var(--accent-green), 0.1)',
          500: 'rgba(var(--accent-green), 1)',
          600: 'rgba(22, 163, 74, 1)',
          700: 'rgba(21, 128, 61, 1)',
        },
        warning: {
          DEFAULT: 'rgba(var(--warning), 1)',
          50: 'rgba(var(--accent-amber), 0.05)',
          100: 'rgba(var(--accent-amber), 0.1)',
          500: 'rgba(var(--accent-amber), 1)',
          600: 'rgba(217, 119, 6, 1)',
          700: 'rgba(180, 83, 9, 1)',
        },
        error: {
          DEFAULT: 'rgba(var(--error), 1)',
          50: 'rgba(var(--accent-red), 0.05)',
          100: 'rgba(var(--accent-red), 0.1)',
          500: 'rgba(var(--accent-red), 1)',
          600: 'rgba(220, 38, 38, 1)',
          700: 'rgba(185, 28, 28, 1)',
        },
        info: {
          DEFAULT: 'rgba(var(--info), 1)',
          50: 'rgba(var(--accent-blue), 0.05)',
          100: 'rgba(var(--accent-blue), 0.1)',
          500: 'rgba(var(--accent-blue), 1)',
          600: 'rgba(37, 99, 235, 1)',
          700: 'rgba(29, 78, 216, 1)',
        },
      },

      // === SPACING ===
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
      },

      // === BORDER RADIUS ===
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // === BOX SHADOWS ===
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'floating': '0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 8px 16px -8px rgba(0, 0, 0, 0.1)',
        'ai-glow': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(147, 51, 234, 0.2)',
        'none': 'none',
      },

      // === ANIMATIONS ===
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },

      // === KEYFRAMES ===
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), 0 0 40px rgba(147, 51, 234, 0.3)',
            transform: 'scale(1.02)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },

      // === LAYOUT ===
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        'container': '1280px',
        'content': '768px',
        'prose': '65ch',
      },

      // === GRID ===
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(250px, 1fr))',
        'course-grid': 'repeat(auto-fit, minmax(320px, 1fr))',
      },

      // === ASPECT RATIOS ===
      aspectRatio: {
        'video': '16 / 9',
        'square': '1 / 1',
        'portrait': '3 / 4',
        'landscape': '4 / 3',
        'course': '16 / 9',
      },

      // === BACKDROP BLUR ===
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },

      // === CUSTOM GRADIENTS ===
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, rgba(var(--primary), 1) 0%, rgba(var(--brand-primary-hover), 1) 100%)',
        'gradient-neural': 'linear-gradient(135deg, rgba(var(--neural-primary), 1) 0%, rgba(var(--neural-secondary), 1) 100%)',
        'gradient-ai': 'linear-gradient(135deg, rgba(var(--neural-primary), 1) 0%, rgba(var(--accent-purple), 1) 50%, rgba(var(--neural-secondary), 1) 100%)',
        'gradient-surface': 'linear-gradient(135deg, rgba(var(--card), 1) 0%, rgba(var(--muted), 0.3) 100%)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(var(--background), 1) 0%, rgba(var(--muted), 0.5) 100%)',
      },

      // === TYPOGRAPHY PLUGIN ===
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'rgba(var(--foreground), 1)',
            '[class~="lead"]': {
              color: 'rgba(var(--muted-foreground), 1)',
            },
            a: {
              color: 'rgba(var(--primary), 1)',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: 'rgba(var(--foreground), 1)',
              fontWeight: '600',
            },
            'ol > li::marker': {
              fontWeight: '400',
              color: 'rgba(var(--muted-foreground), 1)',
            },
            'ul > li::marker': {
              color: 'rgba(var(--muted-foreground), 1)',
            },
            hr: {
              borderColor: 'rgba(var(--border), 1)',
              borderTopWidth: 1,
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'rgba(var(--foreground), 1)',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'rgba(var(--border), 1)',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
            },
            h1: {
              color: 'rgba(var(--foreground), 1)',
              fontWeight: '800',
            },
            h2: {
              color: 'rgba(var(--foreground), 1)',
              fontWeight: '700',
            },
            h3: {
              color: 'rgba(var(--foreground), 1)',
              fontWeight: '600',
            },
            h4: {
              color: 'rgba(var(--foreground), 1)',
              fontWeight: '600',
            },
            'figure figcaption': {
              color: 'rgba(var(--muted-foreground), 1)',
            },
            code: {
              color: 'rgba(var(--foreground), 1)',
              fontWeight: '600',
            },
            'code::before': {
              content: '"`"',
            },
            'code::after': {
              content: '"`"',
            },
            'a code': {
              color: 'rgba(var(--primary), 1)',
            },
            pre: {
              color: 'rgba(var(--foreground), 1)',
              backgroundColor: 'rgba(var(--muted), 1)',
              overflowX: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            'pre code::before': {
              content: 'none',
            },
            'pre code::after': {
              content: 'none',
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
            },
            thead: {
              color: 'rgba(var(--foreground), 1)',
              fontWeight: '600',
              borderBottomWidth: '1px',
              borderBottomColor: 'rgba(var(--border), 1)',
            },
            'thead th': {
              verticalAlign: 'bottom',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'rgba(var(--border), 1)',
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0',
            },
            'tbody td': {
              verticalAlign: 'baseline',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    // Custom plugin for component utilities
    function ({ addUtilities, addComponents }: any) {
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.bg-dot-pattern': {
          'background-image': 'radial-gradient(circle, rgba(var(--muted-foreground), 0.15) 1px, transparent 1px)',
          'background-size': '20px 20px',
        },
        '.bg-grid-pattern': {
          'background-image': 'linear-gradient(rgba(var(--muted-foreground), 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--muted-foreground), 0.1) 1px, transparent 1px)',
          'background-size': '20px 20px',
        },
        '.bg-neural-pattern': {
          'background-image': 'radial-gradient(circle at 25% 25%, rgba(var(--neural-primary), 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(var(--neural-secondary), 0.1) 0%, transparent 50%)',
          'background-size': '40px 40px',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none',
        },
      });

      addComponents({
        '.gradient-primary': {
          background: 'linear-gradient(135deg, rgba(var(--primary), 1) 0%, rgba(var(--brand-primary-hover), 1) 100%)',
        },
        '.gradient-neural': {
          background: 'linear-gradient(135deg, rgba(var(--neural-primary), 1) 0%, rgba(var(--neural-secondary), 1) 100%)',
        },
        '.gradient-ai': {
          background: 'linear-gradient(135deg, rgba(var(--neural-primary), 1) 0%, rgba(var(--accent-purple), 1) 50%, rgba(var(--neural-secondary), 1) 100%)',
        },
      });
    },
  ],
};

export default config;