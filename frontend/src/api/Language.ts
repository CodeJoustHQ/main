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

export const languageToEditorLanguage = (key: Language): string => {
  // Swift, Rust, and Bash do not have corresponding editor languages.
  switch (key) {
    case Language.Python:
      return 'python';
    // case Language.Ruby:
    //   return 'ruby';
    // case Language.CPP:
    //   return 'c++';
    // case Language.PHP:
    //   return 'php';
    // case Language.C:
    //   return 'objective-c';
    case Language.Java:
      return 'java';
    // case Language.JavaScript:
    //   return 'javascript';
    default:
      return '';
  }
};

export default Language;
