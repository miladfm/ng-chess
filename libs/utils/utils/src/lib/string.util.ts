const START_LETTER = 'a';
const MAX_LETTER_LENGTH = 25;
export const LETTER_START_CHAR_CODE = letterToASCII(START_LETTER)
export const LETTER_MAX_CHAR_CODE = LETTER_START_CHAR_CODE + MAX_LETTER_LENGTH;
export const MAX_LETTER = indexToLetter(LETTER_START_CHAR_CODE + MAX_LETTER_LENGTH)

export function letterToASCII(letter: string): number {
  return letter.charCodeAt(0);
}

export function indexToLetter(index: number, maxLetterLength = MAX_LETTER_LENGTH): string {
  const letterIndex = Math.ceil(index % maxLetterLength);
  const letter = String.fromCharCode(LETTER_START_CHAR_CODE + letterIndex);

  return letter;
}

export function increaseLetter(letter: string, increment = 1) {
  return letter === MAX_LETTER
    ? letter
    : String.fromCharCode(letterToASCII(letter) + increment);
}

export function decreaseLetter(letter: string, decrease = 1) {
  return letter === START_LETTER
    ? letter
    : String.fromCharCode(letterToASCII(letter) - decrease);
}
