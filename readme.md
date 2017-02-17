## MoodRec -Moodle gomendatzailea-

Proiektu hau master amaierako tesia lanaren ondorioa da. Helburua, moodleren online bidezko
irakaskuntza plataforman, tutoretza automatikoa ahalbidetzen duen sistema garatzea da. Ikasleak,
bere ezagupen arabera gomendioak jasoko ditu jakintza egokia izan arte.

## Kode egitura

Kodea nagusia org/ehu karpetan kokatzen da. Bertan, gomendatzaileak behar dituen logika txertatu dira:

- Http zerbitzari bat (nanoHttpD oinarritua)
- Datu base zerbitzu bat (mongodb-en oinarriuta)
- Ezagupen inferentzia eta gomendio sistema implementazioa (oraingo inferentzia sinplea, egiteke gomendio sistema)

Libs/ karpetan erabilitako liburutegia daude. Hauek Java 8-ren kontra konpilatuak daudenez, java 8 erabiltzea komeni da.
resources/ karpetan webzerbitzariak behar dituen fitxategia estatikoa gordtzeko erabiltzen da.
docs/ karpetan garapen honen oinarrian dago teoria kokatzen da.


# Martxan jartzeko

Besterik gabe,

```bash

sh run.sh

```
Momentuz, 8080 portuan kokatzen da zerbitzaria. Oraingoz ez du gauza haundirik egiten.
