import { AiMove, BoardMovements, BoardPieces, PieceColor, PieceType, SquareId } from '@chess/core';
import { objLoop } from '@chess/utils';

const stockfish = new Worker('assets/stockfish.js');

export function aiMove(boardPieces: BoardPieces, boardMovements: BoardMovements, color: PieceColor) {
  return new Promise<AiMove>(resolve => {

    const castlingAvailability = getFenCastlingAvailability(boardPieces, boardMovements);
    const fen = calFen(boardPieces, color, castlingAvailability);

    // UCIProtocol: https://www.wbec-ridderkerk.nl/html/UCIProtocol.html
    stockfish.postMessage(`position fen ${fen}`);
    stockfish.postMessage('go depth 15');

    const stockfishCallback = (event: MessageEvent) => {
      const response = event.data;

      // If the response contains a best move, make it on the board and the game instance
      if (response.startsWith('bestmove')) {
        stockfish.removeEventListener('message', stockfishCallback);

        const regex = /bestmove\s+(\w+)(?:\s+ponder\s+(\w+))?/;
        const match = response.match(regex);

        const moves: AiMove = {
          bestMove: {
            from: match[1].slice(0, 2),
            to: match[1].slice(2)
          }
        }

        if (match[2]) {
          moves.ponder = {
            from: match[2].slice(0, 2),
            to: match[2].slice(2)
          }
        }

        resolve(moves);
      }
    }

    stockfish.addEventListener('message', stockfishCallback);
  })
}

function getFenCastlingAvailability(boardPieces: BoardPieces, boardMovements: BoardMovements) {
  const { key: whiteKingSquareId } = objLoop(boardPieces)
    .find((squareId, piece) => piece?.color === PieceColor.White && piece?.type === PieceType.King)!;

  const whiteCastlingAvailability = boardMovements[whiteKingSquareId]
    .filter(movement => movement.extraMovement)
    .map(movement => movement.extraMovement!.to === 'g1' ? 'K' : 'Q')
    .join();


  const { key: blackKingSquareId } = objLoop(boardPieces)
    .find((squareId, piece) => piece?.color === PieceColor.Black && piece?.type === PieceType.King)!;

  const blackCastlingAvailability = boardMovements[blackKingSquareId]
    .filter(movement => movement.extraMovement)
    .map(movement => movement.extraMovement!.to === 'g1' ? 'k' : 'q')
    .join()

  return whiteCastlingAvailability + blackCastlingAvailability;
}


/**
 * The FEN (Forsyth-Edwards Notation) is a compact way to represent the position of pieces on a chessboard,
 * as well as additional game state information. The FEN string consists of several space-separated fields:
 *
 * Piece placement:
 *    This field describes the placement of pieces on the board, using ranks (rows) separated by slashes.
 *    Each rank is represented by a combination of lowercase and uppercase letters
 *    (for black and white pieces, respectively) and numbers indicating empty squares.
 *
 * Active color:
 *    This field indicates which player has the next move.
 *    It is represented by a single character: 'w' for white or 'b' for black.
 *
 * Castling availability:
 *    This field represents the castling rights for both players.
 *    If a player can castle, the corresponding letter is included in the field: 'K' for white kingside castling, 'Q'
 *    for white queenside castling, 'k' for black kingside castling, and 'q' for black queenside castling.
 *    If neither player has castling rights, a single hyphen '-' is used.
 *
 * En passant target square:
 *    This field represents the en passant target square, if one exists.
 *    If a pawn has just moved two squares forward, the square "behind" the pawn is the en passant target square.
 *    If there is no en passant target square, a single hyphen '-' is used.
 *
 * Halfmove clock:
 *    This field is a non-negative integer that counts the number of half-moves (plies) since the last pawn move or capture.
 *    This value is used for the 50-move rule, which states that a game can be drawn if no pawn move or capture has been made
 *    in the last 50 moves by each player.
 *
 * Fullmove number:
 *    This field is a positive integer that represents the number of full moves (one move by each player) completed in the game.
 *    It starts at 1 and increments after each move by black.
 */
export function calFen(boardPieces: BoardPieces, color: PieceColor, castling: string): string {
  let fen = '';
  let emptySquares = 0;

  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 'a'.charCodeAt(0); file <= 'h'.charCodeAt(0); file++) {
      const squareId = String.fromCharCode(file) + rank as SquareId;
      const piece = boardPieces[squareId];

      if (piece) {
        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }

        const pieceChar = piece.type[0].toUpperCase();
        fen += piece.color === PieceColor.White ? pieceChar : pieceChar.toLowerCase();
      } else {
        emptySquares++;
      }
    }

    if (emptySquares > 0) {
      fen += emptySquares;
      emptySquares = 0;
    }

    if (rank > 1) {
      fen += '/';
    }
  }

  // Add active color
  fen += color === PieceColor.White ? ' w' : ' b';

  // castling availability
  fen += ` ${castling || '-'}`;

  // en passant target square
  fen += ' -';

  // halfmove clock
  fen += ' 0';

  // and fullmove number
  fen += ' 1';

  return fen;
}