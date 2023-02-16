enum Language {
  Python = 'PYTHON',
  // Ruby = 'RUBY',
  // Swift = 'SWIFT',
  CPP = 'CPP',
  // PHP = 'PHP',
  // C = 'C',
  Java = 'JAVA',
  // JavaScript = 'JAVASCRIPT',
  // Rust = 'RUST',
  // Bash = 'BASH',
}

// 'PYTHON' to Language.Python
// value as Language

// Python -> Language.Python
export const fromString = (key: string): Language => Language[key as keyof typeof Language];

// Language.Python -> Python
export const displayNameFromLanguage = (language: Language) => {
  const keys = Object.keys(Language).filter((key) => fromString(key) === language);
  return keys.length > 0 ? keys[0] : '';
};

// Language.Python to python
export const languageToEditorLanguage = (key: Language): string => {
  // Swift, Rust, and Bash do not have corresponding editor languages.
  switch (key) {
    case Language.Python:
      return 'python';
    // case Language.Ruby:
    //   return 'ruby';
    case Language.CPP:
      return 'c++';
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
