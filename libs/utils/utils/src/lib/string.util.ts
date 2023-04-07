const MAX_LETTERS_LENGTH = 26;
const ASCII_A = 'a'.charCodeAt(0);

export function indexToLetter(index: number, maxLetterLength = MAX_LETTERS_LENGTH): string {
  const letterIndex = Math.ceil(index % maxLetterLength);
  const letter = String.fromCharCode(ASCII_A + letterIndex);

  return letter;
}
