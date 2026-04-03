#!/usr/bin/env bash
set -e

# Configuration

PAIR=1

# Main program

case "$PAIR" in
  1)
    ORIGIN='D:/Descargas/php-design-patterns'
    DESTINY='D:/xampp/htdocs/php-projects/php-design-patterns'
    ;;
  2)
    ORIGIN='D:/Descargas/tiny-loot-quest'
    DESTINY='D:/projects/games/tiny-loot-quest'
    ;;
  *)
    echo "PAIR debe ser 1 o 2"
    exit 1
    ;;
esac


npm run sync -- \
  --origin "$ORIGIN" \
  --destiny "$DESTINY" \
  --yes