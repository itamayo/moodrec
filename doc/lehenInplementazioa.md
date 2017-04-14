#MoodRec, lehen inplementazioa
Online bidezko irakazkuntzan badira makina bat plataforma. Erabilpen hauek, ikasleari trebetasun berriak lortzeko gaitasuna ematen diote klaseetara presentzialki azaldu gabe. Orokorrean, plataforma hauetako ikasleek tutore
bat dute bere eboluzioa aztertu eta bideratzen laguntzen duena. Kasu askotan ordea, tutoretza mota hau ez da nahikoa izaten. Kontextu honetan, MoodRec-ek tutoretza automatizatua planteatzen du ikaslearen tutore lanak egin ditzan.

## Planteamendu teorikoa

Tutore lanak egin ahal izateko ezinbestekoa da ikaslearen trebetasuna jakin ahal izatea. Hortaz, plataforma automatikoak gai izan behar du ariketak mota ezberdinak plateantu eta hauek lantzen dituen trebetasunak identifikatzea. Behin, ariketan lantzen diren trebetasunak identifikaturik eta ikaslearen trebetasuna kontuan izanda, sistema gai izan behar du eduki komenigarria gomendatzen. Hortaz, hiru sail ezberdin garatuko beharko lirazteke:

1. **Ikaslearen trebetasuna trazapena**: Ikaslearen trebetasuna edozein momentu zein den jakiteko orduan hainbat planteamendu daude. Kasu honetan, MoodRec-ek
Bayes Knowledge Tracing erabiltzen du momentu bakoitzean ikaslearen trebetasuna zein den identifikatzeko.
2. **Ariketen trebetasun mapaketa**: Kurtsoan planteatzen diren ariketak lantzen diren trebetasunarekin lotuak egon behar dira. Hau, irakasleak ariketa egiteko orduan zehaztu beharko luke. Zentzu honetan, MoodRec-ek planteatzen duena zera da; ariketa bakoitzak bektore normalizatu bat izatea, bere trebetasun identifikadorea eta behar den trebetasuna mailakatuarekin. Adibidez, jo dezagun estadistikako ariketa batera:

Demagun, ariketa bayesen erreglak erabiliz kalkulatu beharreko probabilitate bat asmatu behar dugula. Era berean, hainbat trebetasun identifikatua ditugu estadistikako gaiarekin: oinarrizko_probabilitate, probabilitate_kondizionala, kontrako_probabilitate eta azkenik bayesen_erregela. Kasu honetan, irakasleak ariketa era honetan mapeatu beharko luke:

```js
var spaceVector = {
                    oinarrizko_probabilitea:0.2,
                    probabilitate_kondizionala:0.2,
                    kontrako_probabilitate:0.2,
                    bayesen_erregela:0.4
                    }

```

3. **Edukien (dokumentazioa) trebetasunaren indexazioa**: Eduki bat gomendatzerako orduan ezinbesteko da hau zer gai jorratzen dituen identifikatzea. Badago textuak automatikoki zailkatzeko erarik, adibidez MoodRec-en planteatzen dena TFIDF metodoa erabiltzea da. Beste aukera bat sailkapen hau ezkuz egitea izango litzateke.
4. **Ikaslearen trebetasunarekiko gomedioa**: Behin ikaslearen ezagupena ezagututa eta sistema dituen edukiak mapeatuta, Vector space Model-en arteko distantzia angeluarra erabiliz, sistemak dokumentu edo ariketa egokiena identifikatu eta gomendatu ahal izango ditu.

## Planteamendu teknikoa

MoodRec web teknologien inguruko plataforma anitzetan funtzionatzeko pentsatua dago. Nolabait, moodle-en plataforma-rekin lotura du bertan egingo baitira lehen probak. Hala ere, edozein web bidezko plataformarako balio beharko luke.

### Arkitektura
Webgunen arkitektura jarraiki, bezero zerbitzarian oinarrituriko arkitektura erabiltzen du MooRec-ek. Komunikazio protokolo bezela HTTP/HTTPS erabiltzen da eta protokolo logiko bezela Rest erabiltzen da, honek webzerbitzu bererabilgarriak izateko aukera ematen du.

Aplikazioaren logika bi parte nagusi ditu. Batetik backend-a edo zerbitzaria honako zerbitzuak eskeintzen ditu:

1. Sesio kudeaketa eta persistenzia.
2. Edukien hostalaritza.
3. Kalkulu zentroa (BTK,space Vector Model, TFIDF)

Bestetik, bezeroa edo erabiltzailearen webgunean exekutatzen den kodea dago. Bezeroak honako funtzioak izango ditu:

1. Erabiltzailearen konexioa zerbitzariarekiko.
2. Ariketen mapeoa.
3. Webzerbitzuen deiturak mapeaturiko datuekin.
4. Presentazio egokia (emaitza edo gomendaioraren errenderizazioa)

### Aplikazioren datu fluxua

Erabili nahi den plataforman, 'script' tag-aren bidez bezeroaren kodea txertatu behar izango da. Txertatzerako orduan, script-ari token bat asoziatu beharko zaio, aurretik administradoreak sortutakoa. Token hau ikasle/irakasle bakoitzari dagokion gako bezela erabiliko da; bai webzerbitzuak deitu ahal izateko zein ikaslea/irakaslea identifikatu ahal izateko.

Behin bezeroaren txertatua dagoela, sistema era automatikoan sesio berri bat sortuko du webgune aldean eta zerbitzarian bezeroak gordeta duen sesio berrezkuratuko du.

Ikaslea, ariketa sekziora sartzean, bezero kodeak ariketa bakoitza mapeatuko du zerbitzariaren datu basearen kontra, eta hauek existituko balira, behar den kodea txertatuko luke ariketaren formularioari. Ariketak existitzen direla suposatuz, behin bezeroak bidali botoiari eman ostean emaitzak bidaliko ditu. 

Zerbitzariak ariketen emaitzak jasota, ariketak ondo edo gaizki erantzundak dauden aztertuko ditu eta horren arabera ikaslearen trebetasuna berria kalkulatuko du jorratzen diren trebetasun bakoitzeko. Behin trebetasun berria kalkulatuta, trebetasun horren 0.55 azpitik dauden trebetasuna identifikatu ditu.

Ikasleak trebetasun baxua duen gaietan, gomendatzeko edukiak bilatuko ditu space vector model-eko distantziaz baliatuz. Hauek, gertutasun maila gatik ordenatu eta emaitza bezeroa bidaliko dio gomendio bezela.

Bezeroak gomedio emaitzak jasotzean, era egoki batean errepresentatuko ditu ikaslearen webgunean.

### Orain artekoa

Gaur eguneko egoera; batetik webzerbitzaria inplementatua dago, webzerbitzuak nahiko aurreratua dut baina bakan batzuk falta dira. Persistentzia mongoDB datua base bidez ematen da.

BKT eta VectorSpaceModel kalkuluak inplementatuak daude eta test-ak egin ditut ta badirudi ondo dabiela. TFIDF faltako zitzaidan, ez dakit zehazki nola planteatu, noiz egin mapeoa ?

Bezeroaren aldea ere inplementatua dago, nahiz ta gauza batzuk hardcodeatuak dauden.

### Hainbat duda...

Duda nagusia trebetasunen identifikazioarekin det. Irakasleak ariketa bakoitzeko bektore normalizatu bat deskribitzea asko eskatzea da ? Zer iruditzen zaizue ?

Bestetik, gomendatu beharreko edukiak sistemak nola sailkatuko duen ez dut oso argi, sistemak offline egingo duen lan bat litzateke ? Edo eskuz sartu beharko litzakeen beste bektore bat litzateke ?



