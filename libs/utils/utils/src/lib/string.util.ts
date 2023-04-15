const START_LETTER = 'a';
const MAX_LETTERS_LENGTH = 26;
const ASCII_A = letterToASCII(START_LETTER)
const ASCII_MAX_LETTER = indexToLetter(ASCII_A + MAX_LETTERS_LENGTH)

function letterToASCII(letter: string): number {
  return letter.charCodeAt(0);
}

export function indexToLetter(index: number, maxLetterLength = MAX_LETTERS_LENGTH): string {
  const letterIndex = Math.ceil(index % maxLetterLength);
  const letter = String.fromCharCode(ASCII_A + letterIndex);

  return letter;
}

export function increaseLetter(letter: string) {
  if (letter === ASCII_MAX_LETTER) {
    return null;
  }
  return String.fromCharCode(letterToASCII(letter) + 1);
}

export function decreaseLetter(letter: string) {
  if (letter === START_LETTER) {
    return null;
  }
  return String.fromCharCode(letterToASCII(letter) - 1);
}
