### Koppelen van signals

De opzet van de yaml file zoals we die gister besproken hebben levert toch problemen op; de namen van de signals in de Vega specs moeten dan namelijk uniek zijn.

Stel we hebben 3 Vega specs die allemaal een signal `mouseover` en een   signal `tooltip` hebben en spec1 wil luisteren naar `mouseover` van spec2.

In de nieuwe opzet zou de yaml dan als volgt worden:

```yaml
specs:
    - url: spec1.vg.json
      name: spec1
      publish:
        - mouseover
        - tooltip
      subscribe:
        - mouseover

    - url: spec2.vg.json
      name: spec2
      publish:
        - mouseover
        - tooltip

    - url: spec3.vg.json
      name: spec3
      publish:
        - mouseover
        - tooltip
```

Zoals je ziet luistert spec1 op deze manier naar de `mouseover` signals van zowel spec2 als spec3. Je zou dit kunnen oplossen door de namen van de signals uniek te maken:

```yaml
specs:
    - url: spec1.vg.json
      name: spec1
      publish:
        - mouseover1
        - tooltip1
      subscribe:
        - mouseover2

    - url: spec2.vg.json
      name: spec2
      publish:
        - mouseover2
        - tooltip2

    - url: spec3.vg.json
      name: spec3
      publish:
        - mouseover3
        - tooltip3
```

Maar dan doe je feitelijk hetzelfde als in de huidige opzet alleen verschuif je een verantwoordelijkheid naar de Vega specs en dat is nu juist wat we niet willen: een individuele Vega spec moet volkomen self-contained zijn en geen rekening hoeven te houden met mogelijke signal-namen in andere en/of toekomstige specs.

Daarbij is het zo dat het in deze opzet niet mogelijk is om signalen met verschillende namen aan elkaar te koppelen: bijvoorbeeld als spec2 het `tooltip` signaal van spec3 wil gebruiken om zijn eigen `mouseover` signaal te voeden.

Ik stel daarom voor om de huidige opzet te blijven gebruiken qua koppeling van signals. Als spec1 naar de `mouseover` van spec2 wil luisteren wordt dat:

```yaml
specs:
    - url: spec1.vg.json
      name: spec1
      bind:
        - name: spec2
          signals:
            - mouseover #connect spec2.mouseover to spec1.mouseover

    - url: spec2.vg.json
      name: spec2

    - url: spec3.vg.json
      name: spec3
```

En als spec2 het `tooltip` signaal van spec3 wil gebruiken om zijn eigen `mouseover` signaal te voeden dan wordt dat:

```yaml
specs:
    - url: spec1.vg.json
      name: spec1

    - url: spec2.vg.json
      name: spec2
      bind:
        - name: spec3
          signals:
            - [tooltip, mouseover] #connect spec3.tooltip to spec2.mouseover

    - url: spec3.vg.json
      name: spec3
```

### Clientside state

Feitelijk representeert de yaml file de laast opgeslagen state van een project en rehydrateer je de locale state als de file wordt ingeladen.

De eenmaal ingeladen state moet aangepast kunnen worden, bijvoorbeeld als de gebruiker een extra Vega spec aan het project toevoegt.

Als de nieuwe spec is ingeladen kan de gebruiker als ze dat wil de signalen van de verschillende specs gaan koppelen. Omdat een Vega spec een json object is kan javascript simpleweg de `signals` array uitlezen om te bepalen welke signalen er in een spec gedefinieerd zijn.

Ik stel voor om met een soort matrices te werken. Stel een project heeft 2 specs, dan hebben we de bijvoorbeeld volgende matrices:

```js
// matrix for spec1:
// spec1 connects 'sigal1' of spec2 to its own signals 'signal1'
// and 'signal2, and connects 'signal3' of spec2 to its own 'signal2'
// as well

|              |  spec1.signal1 | spec1.signal2 |
|-----------------------------------------------|
|spec2.signal1 |        x       |      x        |
|-----------------------------------------------|
|spec2.signal2 |                |               |
|-----------------------------------------------|
|spec2.signal3 |                |      x        |
|-----------------------------------------------|

// matrix for spec2:
// spec2 maps 'signal1' of spec1 to its own signal 'signal1'
// and does the same for 'signal2'

|              |  spec2.signal1 | spec2.signal2 | spec2.signal3 |
|---------------------------------------------------------------|
|spec1.signal1 |        x       |               |               |
|---------------------------------------------------------------|
|spec1.signal2 |                |       x       |               |
|---------------------------------------------------------------|

```

Als er nu een derde spec wordt toegevoegd krijgen we de volgende matrices:

```js
// matrix for spec1:

|              |  spec1.signal1 | spec1.signal2 |
|-----------------------------------------------|
|spec2.signal1 |        x       |      x        |
|-----------------------------------------------|
|spec2.signal2 |                |               |
|-----------------------------------------------|
|spec2.signal3 |                |      x        |
|-----------------------------------------------|
|spec3.signal1 |                |               |
|-----------------------------------------------|
|spec3.signal2 |                |               |
|-----------------------------------------------|

// matrix for spec2:

|              |  spec2.signal1 | spec2.signal2 | spec2.signal3 |
|---------------------------------------------------------------|
|spec1.signal1 |        x       |               |               |
|---------------------------------------------------------------|
|spec1.signal2 |                |       x       |               |
|---------------------------------------------------------------|
|spec3.signal1 |                |               |               |
|---------------------------------------------------------------|
|spec3.signal2 |                |               |               |
|---------------------------------------------------------------|

// matrix for spec3:
// no connected signals yet

|              |  spec3.signal1 | spec3.signal2 |
|-----------------------------------------------|
|spec1.signal1 |                |               |
|-----------------------------------------------|
|spec1.signal2 |                |               |
|-----------------------------------------------|
|spec2.signal1 |                |               |
|-----------------------------------------------|
|spec2.signal2 |                |               |
|-----------------------------------------------|
|spec2.signal3 |                |               |
|-----------------------------------------------|

```

De matrices kunnen bijvoorbeeld simpele html tabellen / flexboxen zijn met checkboxen.