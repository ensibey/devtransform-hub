export interface PercentageProblem {
  slug: string;
  percent: number;
  baseNumber: number;
  result: number;
  title: string;
  titleTr: string;
  formula: string;
  stepByStep: string[];
}

export function getAllPercentageProblems(): PercentageProblem[] {
  const problems: PercentageProblem[] = [];

  const commonPercentages = [1, 2, 5, 10, 12, 15, 18, 20, 25, 30, 33, 35, 40, 45, 50, 60, 70, 75, 80, 90, 95];
  const commonBases = [
    10, 20, 25, 50, 60, 75, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 750, 800, 1000, 1200, 1500, 2000, 2500, 5000, 10000
  ];

  for (const p of commonPercentages) {
    for (const b of commonBases) {
      const result = (p * b) / 100;
      const formattedResult = parseFloat(result.toFixed(4));
      problems.push({
        slug: `what-is-${p}-percent-of-${b}`,
        percent: p,
        baseNumber: b,
        result: formattedResult,
        title: `What is ${p}% of ${b}?`,
        titleTr: `${b} sayısının %${p}'i kaçtır?`,
        formula: `(${p} ÷ 100) × ${b} = ${formattedResult}`,
        stepByStep: [
          `Step 1: Convert the percentage to a decimal by dividing by 100: ${p} ÷ 100 = ${(p / 100).toFixed(4)}`,
          `Step 2: Multiply the decimal by the base number: ${(p / 100).toFixed(4)} × ${b} = ${formattedResult}`,
          `Conclusion: ${p}% of ${b} is equal to ${formattedResult}.`,
        ],
      });
    }
  }

  return problems;
}

export function getPercentageProblem(slug: string): PercentageProblem | null {
  const match = slug.match(/^what-is-(\d+)-percent-of-(\d+)$/);
  if (!match) return null;

  const p = parseInt(match[1], 10);
  const b = parseInt(match[2], 10);
  if (isNaN(p) || isNaN(b) || b <= 0) return null;

  const result = parseFloat(((p * b) / 100).toFixed(4));

  return {
    slug,
    percent: p,
    baseNumber: b,
    result,
    title: `What is ${p}% of ${b}?`,
    titleTr: `${b} sayısının %${p}'i kaçtır?`,
    formula: `(${p} ÷ 100) × ${b} = ${result}`,
    stepByStep: [
      `Step 1: Convert the percentage to a decimal by dividing by 100: ${p} ÷ 100 = ${(p / 100).toFixed(4)}`,
      `Step 2: Multiply the decimal by the base number: ${(p / 100).toFixed(4)} × ${b} = ${result}`,
      `Conclusion: ${p}% of ${b} is equal to ${result}.`,
    ],
  };
}
