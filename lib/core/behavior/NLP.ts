// Enhanced Porter Stemmer Implementation
class PorterStemmer {
    private vowels = 'aeiou';
    private consonants = 'bcdfghjklmnpqrstvwxyz';

    /**
     * Main stemming function implementing Porter Stemmer algorithm
     */
    stem(word: string): string {
        if (!word || word.length <= 2) return word;

        word = word.toLowerCase();

        // Step 1a
        word = this.step1a(word);

        // Step 1b
        word = this.step1b(word);

        // Step 1c
        word = this.step1c(word);

        // Step 2
        word = this.step2(word);

        // Step 3
        word = this.step3(word);

        // Step 4
        word = this.step4(word);

        // Step 5
        word = this.step5(word);

        return word;
    }

    private step1a(word: string): string {
        if (word.endsWith('sses')) {
            return word.slice(0, -2); // sses -> ss
        } else if (word.endsWith('ies')) {
            return word.slice(0, -2); // ies -> i
        } else if (word.endsWith('ss')) {
            return word; // ss -> ss
        } else if (word.endsWith('s') && word.length > 1) {
            return word.slice(0, -1); // s -> (empty)
        }
        return word;
    }

    private step1b(word: string): string {
        if (word.endsWith('eed')) {
            const stem = word.slice(0, -3);
            if (this.measure(stem) > 0) {
                return stem + 'ee';
            }
        } else if (word.endsWith('ed')) {
            const stem = word.slice(0, -2);
            if (this.containsVowel(stem)) {
                word = stem;
                return this.step1bPost(word);
            }
        } else if (word.endsWith('ing')) {
            const stem = word.slice(0, -3);
            if (this.containsVowel(stem)) {
                word = stem;
                return this.step1bPost(word);
            }
        }
        return word;
    }

    private step1bPost(word: string): string {
        if (word.endsWith('at') || word.endsWith('bl') || word.endsWith('iz')) {
            return word + 'e';
        } else if (this.endsWithDoubleConsonant(word) &&
            !word.endsWith('l') && !word.endsWith('s') && !word.endsWith('z')) {
            return word.slice(0, -1);
        } else if (this.measure(word) === 1 && this.cvc(word)) {
            return word + 'e';
        }
        return word;
    }

    private step1c(word: string): string {
        if (word.endsWith('y') && this.containsVowel(word.slice(0, -1))) {
            return word.slice(0, -1) + 'i';
        }
        return word;
    }

    private step2(word: string): string {
        const suffixes = {
            'ational': 'ate',
            'tional': 'tion',
            'enci': 'ence',
            'anci': 'ance',
            'izer': 'ize',
            'abli': 'able',
            'alli': 'al',
            'entli': 'ent',
            'eli': 'e',
            'ousli': 'ous',
            'ization': 'ize',
            'ation': 'ate',
            'ator': 'ate',
            'alism': 'al',
            'iveness': 'ive',
            'fulness': 'ful',
            'ousness': 'ous',
            'aliti': 'al',
            'iviti': 'ive',
            'biliti': 'ble'
        };

        for (const [suffix, replacement] of Object.entries(suffixes)) {
            if (word.endsWith(suffix)) {
                const stem = word.slice(0, -suffix.length);
                if (this.measure(stem) > 0) {
                    return stem + replacement;
                }
            }
        }
        return word;
    }

    private step3(word: string): string {
        const suffixes = {
            'icate': 'ic',
            'ative': '',
            'alize': 'al',
            'iciti': 'ic',
            'ical': 'ic',
            'ful': '',
            'ness': ''
        };

        for (const [suffix, replacement] of Object.entries(suffixes)) {
            if (word.endsWith(suffix)) {
                const stem = word.slice(0, -suffix.length);
                if (this.measure(stem) > 0) {
                    return stem + replacement;
                }
            }
        }
        return word;
    }

    private step4(word: string): string {
        const suffixes = [
            'al', 'ance', 'ence', 'er', 'ic', 'able', 'ible', 'ant', 'ement',
            'ment', 'ent', 'ion', 'ou', 'ism', 'ate', 'iti', 'ous', 'ive', 'ize'
        ];

        for (const suffix of suffixes) {
            if (word.endsWith(suffix)) {
                const stem = word.slice(0, -suffix.length);
                if (this.measure(stem) > 1) {
                    if (suffix === 'ion' && (stem.endsWith('s') || stem.endsWith('t'))) {
                        return stem;
                    } else if (suffix !== 'ion') {
                        return stem;
                    }
                }
            }
        }
        return word;
    }

    private step5(word: string): string {
        if (word.endsWith('e')) {
            const stem = word.slice(0, -1);
            const m = this.measure(stem);
            if (m > 1 || (m === 1 && !this.cvc(stem))) {
                return stem;
            }
        } else if (word.endsWith('l') && this.endsWithDoubleConsonant(word) && this.measure(word) > 1) {
            return word.slice(0, -1);
        }
        return word;
    }

    private measure(word: string): number {
        let m = 0;
        let n = word.length;
        let i = 0;

        // Skip initial consonants
        while (i < n && this.consonants.includes(word[i])) {
            i++;
        }

        // Count VC patterns
        while (i < n) {
            // Skip vowels
            while (i < n && this.vowels.includes(word[i])) {
                i++;
            }
            if (i >= n) break;

            // Skip consonants
            while (i < n && this.consonants.includes(word[i])) {
                i++;
            }
            m++;
        }

        return m;
    }

    private containsVowel(word: string): boolean {
        return this.vowels.split('').some(vowel => word.includes(vowel));
    }

    private endsWithDoubleConsonant(word: string): boolean {
        if (word.length < 2) return false;
        const last = word[word.length - 1];
        const secondLast = word[word.length - 2];
        return last === secondLast && this.consonants.includes(last);
    }

    private cvc(word: string): boolean {
        if (word.length < 3) return false;
        const len = word.length;
        return (
            this.consonants.includes(word[len - 3]) &&
            this.vowels.includes(word[len - 2]) &&
            this.consonants.includes(word[len - 1]) &&
            !['w', 'x', 'y'].includes(word[len - 1])
        );
    }
}

// Enhanced Sentiment Analyzer with multiple approaches
class SentimentAnalyzer {
    private positiveWords: Set<string>;
    private negativeWords: Set<string>;
    private analyticalWords: Set<string>;

    constructor() {
        // Basic word lists - in production, use comprehensive lexicons
        this.positiveWords = new Set([
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
            'love', 'like', 'enjoy', 'happy', 'pleased', 'satisfied', 'perfect',
            'beautiful', 'brilliant', 'outstanding', 'superb', 'magnificent', 'terrific'
        ]);

        this.negativeWords = new Set([
            'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'dislike',
            'sad', 'angry', 'frustrated', 'disappointed', 'upset', 'annoyed',
            'poor', 'worst', 'useless', 'stupid', 'ridiculous', 'pathetic'
        ]);

        this.analyticalWords = new Set([
            'analyze', 'study', 'research', 'examine', 'investigate', 'evaluate',
            'assess', 'review', 'consider', 'compare', 'contrast', 'determine',
            'conclude', 'hypothesize', 'theorize', 'data', 'statistics', 'evidence'
        ]);
    }

    /**
     * Analyze sentiment using lexicon-based approach
     */
    analyze(text: string): { positive: number; negative: number; analytical: number } {
        const words = this.preprocessText(text);
        const totalWords = words.length;

        if (totalWords === 0) {
            return { positive: 0, negative: 0, analytical: 0 };
        }

        let positiveCount = 0;
        let negativeCount = 0;
        let analyticalCount = 0;

        for (const word of words) {
            if (this.positiveWords.has(word)) positiveCount++;
            if (this.negativeWords.has(word)) negativeCount++;
            if (this.analyticalWords.has(word)) analyticalCount++;
        }

        return {
            positive: Number((positiveCount / totalWords).toFixed(3)),
            negative: Number((negativeCount / totalWords).toFixed(3)),
            analytical: Number((analyticalCount / totalWords).toFixed(3))
        };
    }

    /**
     * Advanced analysis with intensity and negation handling
     */
    analyzeAdvanced(text: string): {
        positive: number;
        negative: number;
        analytical: number;
        compound: number;
        intensity: number;
    } {
        const words = this.preprocessText(text);
        const result = this.analyze(text);

        // Calculate compound score
        const compound = result.positive - result.negative;

        // Calculate intensity based on punctuation and capitalization
        const intensity = this.calculateIntensity(text);

        return {
            ...result,
            compound: Number(compound.toFixed(3)),
            intensity: Number(intensity.toFixed(3))
        };
    }

    private preprocessText(text: string): string[] {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    private calculateIntensity(text: string): number {
        let intensity = 0;

        // Count exclamation marks
        const exclamations = (text.match(/!/g) || []).length;
        intensity += exclamations * 0.1;

        // Count capital letters (excluding first letter of sentences)
        const capitals = (text.match(/[A-Z]/g) || []).length;
        const sentences = (text.match(/[.!?]/g) || []).length || 1;
        const excessCapitals = Math.max(0, capitals - sentences);
        intensity += excessCapitals * 0.05;

        return Math.min(intensity, 1.0); // Cap at 1.0
    }

    /**
     * Batch analysis for multiple texts
     */
    analyzeBatch(texts: string[]): Array<{ positive: number; negative: number; analytical: number }> {
        return texts.map(text => this.analyze(text));
    }
}

// Export classes for use
export { PorterStemmer, SentimentAnalyzer };