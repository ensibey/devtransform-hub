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

  const commonPercentages = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99
  ];
  const commonBases = [
    5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100, 120, 150, 180, 200, 250, 300, 350, 400, 450, 500, 600, 700, 750, 800, 900, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 10000
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
        titleTr: `What is ${p}% of ${b}? (${b} sayısının %${p}'i)`,
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
    titleTr: `What is ${p}% of ${b}? (${b} sayısının %${p}'i)`,
    formula: `(${p} ÷ 100) × ${b} = ${result}`,
    stepByStep: [
      `Step 1: Convert the percentage to a decimal by dividing by 100: ${p} ÷ 100 = ${(p / 100).toFixed(4)}`,
      `Step 2: Multiply the decimal by the base number: ${(p / 100).toFixed(4)} × ${b} = ${result}`,
      `Conclusion: ${p}% of ${b} is equal to ${result}.`,
    ],
  };
}
