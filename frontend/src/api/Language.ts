enum Language {
  Python = 'PYTHON',
  Ruby = 'RUBY',
  Swift = 'SWIFT',
  CPP = 'CPP',
  PHP = 'PHP',
  C = 'C',
  Java = 'JAVA',
  JavaScript = 'JAVASCRIPT',
  Rust = 'RUST',
  Bash = 'BASH',
}

export const fromString = (key: string): Language => Language[key as keyof typeof Language];

export default Language;
