import React from "react";
import katex from "katex";

// Define props interface for the component
interface HTMLLatexRendererProps {
	content: string;
}

// HTMLLatexRenderer component that renders both HTML and LaTeX
const HTMLLatexRenderer: React.FC<HTMLLatexRendererProps> = ({ content }) => {
	// Process the content to render LaTeX
	const processContent = (inputContent: string): string => {
		if (!inputContent) return "";

		// Step 1: Better preprocessing for problematic expressions
		let fixedContent = inputContent
			// Fix specific formatting issues in the content
			.replace(/y=11\+e−xy/g, "$y = \\frac{1}{1 + e^{-x}}$")
			.replace(/y=1\+e−x1​/g, "")
			.replace(/y→1y\\toy→1/g, "$y \\to 1$")
			.replace(/y→0y\\toy→0/g, "$y \\to 0$")
			.replace(/x→\+\\inftyx\\tox→\+\\infty/g, "$x \\to +\\infty$")
			.replace(/x→−\\inftyx\\tox→−\\infty/g, "$x \\to -\\infty$")
			.replace(/dydx=y\(1−y\)/g, "$\\frac{dy}{dx} = y(1 - y)$")
			.replace(/Δw∝∂P∂w/g, "$\\Delta w \\propto \\frac{\\partial P}{\\partial w}$")
			.replace(/w′=w\+α⋅∂P∂w/g, "$w' = w + \\alpha \\cdot \\frac{\\partial P}{\\partial w}$")
			.replace(/P=−12\(d−o\)2P/g, "$P = -\\frac{1}{2}(d - o)^2$")
			.replace(/P=12\(d−o\)2/g, "$P = \\frac{1}{2}(d - o)^2$")
			.replace(/P=21​\(d−o\)2/g, "$P = \\frac{1}{2}(d - o)^2$")
			.replace(/P=−21​\(d−o\)2/g, "$P = -\\frac{1}{2}(d - o)^2$")
			.replace(/w′=w−α⋅∂P∂w/g, "$w' = w - \\alpha \\cdot \\frac{\\partial P}{\\partial w}$")
			.replace(/δr=or\(1−or\)\(d−or\)/g, "$\\delta_r = o_r(1 - o_r)(d - o_r)$")
			.replace(/δl=ol\(1−ol\)wrδr/g, "$\\delta_l = o_l(1 - o_l)w_r\\delta_r$")
			.replace(/∂P∂wr=ir⋅δr/g, "$\\frac{\\partial P}{\\partial w_r} = i_r \\cdot \\delta_r$")
			.replace(/∂P∂wl=il⋅δl/g, "$\\frac{\\partial P}{\\partial w_l} = i_l \\cdot \\delta_l$")
			.replace(/Δw=α⋅i⋅δfk/g, "$\\Delta w = \\alpha \\cdot i \\cdot \\delta_{fk}$")
			.replace(/δfk=ofk\(1−ofk\)\(dk−ofk\)/g, "$\\delta_{fk} = o_{fk}(1 - o_{fk})(d_k - o_{fk})$")
			.replace(/δli=oli\(1−oli\)∑jwli→rj⋅δrj/g, "$\\delta_{li} = o_{li}(1 - o_{li}) \\sum_j w_{li \\to rj} \\cdot \\delta_{rj}$")
			.replace(/δ=o\(1−o\)\(d−o\)/g, "$\\delta = o(1 - o)(d - o)$")
			.replace(/Δw=α⋅input⋅δ/g, "$\\Delta w = \\alpha \\cdot \\text{input} \\cdot \\delta$")
			.replace(/ddd:/g, "<strong>d</strong>:")
			.replace(/ooo:/g, "<strong>o</strong>:")
			.replace(/dPdo=d−o/g, "$\\frac{dP}{do} = d - o$")
			.replace(/y=0\.5y = 0\.5y=0\.5/g, "$y = 0.5$")
			.replace(/when x=0x = 0x=0/g, "when $x = 0$")
			.replace(/dydx=y\(1-y\)\\frac\{dy\}\{dx\} = y\(1 - y\)dxdy​=y\(1−y\)/g, "$\\frac{dy}{dx} = y(1 - y)$")
			// Fix cases where LaTeX is not properly delimited
			.replace(/([^$])(\\frac\{[^}]+\}\{[^}]+\})/g, "$1$$$2$$") // Add $$ around fractions
			.replace(/([^$])(\\\w+\{[^}]+\})/g, "$1$$$2$$") // Add $$ around other LaTeX commands
			.replace(/([^$])([a-z]\\to[a-z])/g, "$1$$$2$$") // Add $$ around arrows
			// Convert Unicode symbols to LaTeX
			.replace(/→/g, "$\\to$")
			.replace(/∝/g, "$\\propto$")
			.replace(/−/g, "-")
			.replace(/⋅/g, "$\\cdot$")
			.replace(/∑/g, "$\\sum$")
			.replace(/∞/g, "$\\infty$")
			.replace(/∂/g, "$\\partial$")
			.replace(/Δ/g, "$\\Delta$")
			.replace(/δ/g, "$\\delta$")
			// Fix malformed content
			.replace(/\\frac\{1\}\{2\}\(d-o\)\^2/g, "\\frac{1}{2}(d-o)^2");

		// Regular expression to match LaTeX blocks and inline expressions
		const blockRegex = /\$\$([\s\S]*?)\$\$/g;
		const inlineRegex = /\$([^\$]+?)\$/g;

		// First replace block LaTeX expressions
		let processedContent = fixedContent.replace(blockRegex, (match, latex: string) => {
			try {
				// Clean up the LaTeX expression
				const cleanLatex = latex.replace(/−/g, "-").replace(/∞/g, "\\infty").replace(/\\tox/g, "\\to x").replace(/\\toy/g, "\\to y").trim();

				return `<div class="katex-block">${katex.renderToString(cleanLatex, {
					displayMode: true,
					throwOnError: false,
					output: "html",
				})}</div>`;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Unknown error";
				console.error("Block LaTeX error:", errorMessage, "for expression:", latex);
				return `<div class="katex-error p-2 bg-red-50 text-red-500 border border-red-200 rounded">LaTeX Error: ${errorMessage}</div>`;
			}
		});

		// Then replace inline LaTeX expressions
		processedContent = processedContent.replace(inlineRegex, (match, latex: string) => {
			try {
				// Clean up the LaTeX expression
				const cleanLatex = latex.replace(/−/g, "-").replace(/∞/g, "\\infty").replace(/\\tox/g, "\\to x").replace(/\\toy/g, "\\to y").trim();

				return katex.renderToString(cleanLatex, {
					displayMode: false,
					throwOnError: false,
					output: "html",
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Unknown error";
				console.error("Inline LaTeX error:", errorMessage, "for expression:", latex);
				return `<span class="katex-error p-1 bg-red-50 text-red-500 border border-red-200 rounded">LaTeX Error: ${errorMessage}</span>`;
			}
		});

		return processedContent;
	};

	// Process the content
	const processedContent = processContent(content);

	return (
		<div className="neural-notes p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow">
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.15.3/katex.min.css" />
			<div className="rendered-content" dangerouslySetInnerHTML={{ __html: processedContent }} />
			<style jsx>{`
				.neural-notes {
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
					line-height: 1.6;
					color: #1a202c;
					background-color: #f8fafc;
					padding: 1.5rem;
					border-radius: 0.5rem;
				}

				.rendered-content {
					background-color: white;
					padding: 2rem;
					border-radius: 0.5rem;
					box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
				}

				.rendered-content h1 {
					font-size: 2rem;
					font-weight: 700;
					color: #1a365d;
					margin-top: 0;
					margin-bottom: 1rem;
					padding-bottom: 0.5rem;
					border-bottom: 2px solid #e2e8f0;
				}

				.rendered-content h2 {
					font-size: 1.5rem;
					font-weight: 600;
					color: #2c5282;
					margin-top: 2rem;
					margin-bottom: 1rem;
				}

				.rendered-content h3 {
					font-size: 1.25rem;
					font-weight: 600;
					color: #2b6cb0;
					margin-top: 1.5rem;
					margin-bottom: 0.75rem;
				}

				.rendered-content p {
					margin-bottom: 1rem;
					line-height: 1.7;
				}

				.rendered-content ul,
				.rendered-content ol {
					margin-left: 1.5rem;
					margin-bottom: 1.5rem;
					padding-left: 1rem;
				}

				.rendered-content ul {
					list-style-type: disc;
				}

				.rendered-content ol {
					list-style-type: decimal;
				}

				.rendered-content li {
					margin-bottom: 0.5rem;
					padding-left: 0.5rem;
				}

				.rendered-content li p {
					margin-bottom: 0.5rem;
				}

				.rendered-content hr {
					margin: 2rem 0;
					border: 0;
					border-top: 1px solid #e2e8f0;
				}

				.rendered-content strong {
					font-weight: 600;
					color: #1a365d;
				}

				.rendered-content em {
					font-style: italic;
					color: #2d3748;
				}

				.katex-block {
					margin: 1.5rem 0;
					overflow-x: auto;
					padding: 0.75rem;
					background-color: #f7fafc;
					border-radius: 0.375rem;
					border-left: 3px solid #3182ce;
				}

				.katex {
					font-size: 1.15em;
				}

				.katex-error {
					color: #e53e3e;
					font-family: monospace;
					white-space: pre-wrap;
					padding: 0.5rem;
					background-color: #fff5f5;
					border-radius: 0.25rem;
					border-left: 3px solid #f56565;
				}
			`}</style>
		</div>
	);
};

export default HTMLLatexRenderer;
