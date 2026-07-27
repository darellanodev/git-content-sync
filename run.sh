#!/usr/bin/env bash
set -e

# Ask the user
echo "Select the directory pair:"
echo "  1) pattern-lab-php"
echo "  2) tiny-loot-quest"
echo "  3) portfolio-zola"
echo "  4) out-of-office"
echo "  5) dcss"
read -p "Option [1-5]: " PAIR

# Main program
case "$PAIR" in
  1)
    ORIGIN='D:/Descargas/pattern-lab-php'
    DESTINY='D:/xampp/htdocs/php-projects/pattern-lab-php'
    ;;
  2)
    ORIGIN='D:/Descargas/tiny-loot-quest'
    DESTINY='D:/projects/games/tiny-loot-quest'
    ;;
  3)
    ORIGIN='D:/Descargas/portfolio-zola'
    DESTINY='D:/projects/portfolio/portfolio-zola'
    ;;
  4)
    ORIGIN='D:/Descargas/out-of-office'
    DESTINY='D:/projects/games/out-of-office'
    ;;
  5)
    ORIGIN='D:/Descargas/dcss-help'
    DESTINY='D:/projects/tools/dcss-help'
    ;;
  *)
    echo "Error: Incorrect option"
    exit 1
    ;;
esac

npm run sync -- \
  --origin "$ORIGIN" \
  --destiny "$DESTINY" \
  --yes