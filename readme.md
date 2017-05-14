## MoodRec -Moodle gomendatzailea-

Proiektu hau master amaierako tesia lanaren ondorioa da. Helburua, moodleren online bidezko
irakaskuntza plataforman, tutoretza automatikoa ahalbidetzen duen sistema garatzea da. Ikasleak,
bere ezagupen arabera gomendioak jasoko ditu jakintza egokia izan arte.

## Kode egitura

Kodea nagusia org/ehu karpetan kokatzen da. Bertan, gomendatzaileak behar dituen logika txertatu dira:

- Http zerbitzari bat (nanoHttpD oinarritua)
- Datu base zerbitzu bat (mongodb 3.4-en oinarrituta)
- Ezagupen inferentzia eta gomendio sistema implementazioa (oraingoz inferentzia sinplea, egiteke gomendio sistema)

Libs/ karpetan erabilitako liburutegia daude. Hauek Java 8-ren kontra konpilatuak daudenez, java 8 erabiltzea komeni da.
resources/ karpetan webzerbitzariak behar dituen fitxategi estatikoa gordetzeko erabiltzen da.
docs/ karpetan garapen honen atzean dagoen teoria kokatzen da.


# Martxan jartzeko

Besterik gabe, behin java 8 instalatua izan ostean:

```bash

sh run.sh

```
Momentuz, 8080 portuan kokatzen da zerbitzaria.

# Testa

Webgune basiko bat sortu dut garatzen noan implementazioak probatzeko, honako helbidean topatu daiteke,
oraingoz BKT implementatzen du.

http://localhost:8080/browse/tests/index.html

# Edukiaren kontrol panela

http://localhost:8080/browse/controlPanel/
