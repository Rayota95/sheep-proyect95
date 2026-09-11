# Majada

Una sola app para el celular con dos partes:

**Mapa y collares.** Muestra dónde están las ovejas con collar y avisa si:
- una oveja **sale del campo**,
- una oveja **no se mueve hace horas** mientras el resto sí (puede estar caída o muerta),
- un collar se queda **sin señal** o **con poca batería**,
- la **base del casco deja de mandar datos** (por ejemplo, si se apagó el Starlink).

**Registros.** Cuaderno de campo para anotar:
- **pérdidas**: cuántas, qué sospechás que fue, señales, potrero, ubicación GPS y foto;
- **sarna**: casos encontrados, remedio aplicado y revisión posterior, para ver qué remedio funciona.

Las dos partes están conectadas: cuando un collar avisa que una oveja está quieta y la encontrás muerta, desde la misma ficha tocás **"Registrar pérdida de esta oveja"** y queda anotada con la ubicación del collar. Todos los registros aparecen en el mismo mapa.

La app arranca con **datos de ejemplo**. Tocá "Empezar con mis datos" cuando quieras usarla de verdad. **Los registros se pueden usar desde el primer día, aunque todavía no tengas los collares.**

---

## Cómo viajan los datos

```
Collar (T1000-E)  --radio LoRa-->  Base en el casco (Heltec V3)  --wifi Starlink-->  Servidor MQTT privado  -->  App Majada en el celular
```

## 1. Qué comprar (≈ USD 105 + envío)

| Qué | Cantidad | Precio aprox. |
|---|---|---|
| SenseCAP Card Tracker **T1000-E** (versión Meshtastic) | 2 | USD 39,90 c/u |
| **Heltec WiFi LoRa 32 V3**, versión **915 MHz**, con antena | 1 | USD 20–25 |
| Cable USB-C + cargador de celular (para la base) | 1 | lo que tengas |
| Collar de perro regulable o funda para atar el rastreador | 2 | local |

- Pedí la banda de **915 MHz** (no la de 868 MHz).
- Si el envío vale menos de USD 400 no paga impuestos (franquicia courier 2026). Conviene pedir todo junto.

## 2. Servidor MQTT privado (gratis)

1. Creá una cuenta en **HiveMQ Cloud** y un cluster del plan gratuito (Serverless).
2. En *Access Management* creá un usuario y una contraseña.
3. Anotá la dirección del cluster, por ejemplo `abcd1234.s1.eu.hivemq.cloud`.
   - La **base** se conecta al puerto **8883** (con TLS).
   - La **app** se conecta a `wss://abcd1234.s1.eu.hivemq.cloud:8884/mqtt`.

> No uses el servidor público de Meshtastic: cualquiera podría ver dónde están tus ovejas.

## 3. Preparar los equipos (con la app Meshtastic en el celular)

Bajate la app **Meshtastic** (Android o iPhone) y conectate a cada equipo por Bluetooth.

**En los tres equipos:**
- Región: **ANZ (915–928 MHz)**, la banda que corresponde a Argentina.
- Canal principal: nombre `majada`, con una **clave nueva aleatoria**. Tiene que ser la misma clave en los tres equipos (compartí el canal con el código QR).
- En el canal: compartir ubicación activado y precisión **exacta**.

**En los collares (T1000-E):**
- Rol: **TRACKER**.
- GPS activado. Intervalo de posición: **15 minutos** (900 s) para empezar. Si la batería dura muy poco, subilo a 30 minutos.
- La batería dura aprox. una semana; se carga con el cable magnético.

**En la base del casco (Heltec V3):**
1. Si no trae Meshtastic instalado: entrá a `flasher.meshtastic.org` desde Chrome en la compu, enchufá la placa por USB y seguí los pasos.
2. Módulo MQTT: activado. Dirección: `abcd1234.s1.eu.hivemq.cloud:8883`. Usuario y contraseña de HiveMQ. **TLS activado**. **Salida JSON activada**. Tema raíz: `msh/AR`.
3. En el canal `majada`: **Uplink activado**.
4. **Lo último:** WiFi activado con el nombre y la clave del Starlink. Al activar el WiFi se apaga el Bluetooth de la placa; para cambiar algo después, entrá a `client.meshtastic.org` desde Chrome con la placa enchufada por USB.
5. Dejala enchufada las 24 horas, lo más alto posible (cerca de una ventana o afuera, protegida del agua) y con la antena vertical.

## 4. Publicar la app (GitHub Pages, gratis)

1. Creá una cuenta en github.com y un repositorio nuevo público, por ejemplo `majada`.
2. *Add file → Upload files* → subí **todos** los archivos de esta carpeta → *Commit changes*.
3. *Settings → Pages → Deploy from a branch → main / (root) → Save*.
4. Queda en `https://TU-USUARIO.github.io/majada/`. Abrilo en Chrome en el celular y tocá ⋮ → "Agregar a pantalla principal".

## 5. Conectar los collares

En la app: **Ajustes → Conexión con la base**:
- Servidor: `wss://abcd1234.s1.eu.hivemq.cloud:8884/mqtt`
- Usuario y contraseña: los de HiveMQ
- Tema: `msh/AR/2/json/#`
- Tocá **Conectar** (se borran los datos de ejemplo; lo que registraste vos no se toca).

Después: poné nombre a cada collar y activá **Avisos en este celular**.

---

## Plan de prueba real

### Etapa 0: esta semana, sin comprar nada
1. Publicá la app y instalala en el celular de tu viejo. Tocá "Empezar con mis datos".
2. **Ajustes → Mi campo:** nombre del campo y potreros.
3. **Marcá el límite caminando:** andá a cada esquina del alambrado y tocá "Agregar donde estoy". Fijate que las hectáreas den parecido a lo real (un poco más de 100).
4. Desde hoy, cada oveja muerta o caso de sarna se carga en **Registros**.
5. **Probá la señal:** abrí la app en distintos puntos del campo. Así sabés dónde llega el wifi del Starlink (en general, cerca del casco nomás).

### Etapa 1: comprar y probar en la mesa (1 tarde)
1. Pedí los equipos (lista arriba) en un solo envío.
2. Configurá la base y los collares siguiendo el paso 3.
3. **Prueba de mesa:** con todo prendido en el casco, en menos de 20 minutos tienen que aparecer los 2 collares en el mapa, con batería.
4. **Prueba de "salió del campo":** caminá con un collar en la mano hasta afuera del alambrado → tiene que llegar el aviso.
5. **Prueba de "quieta":** en Ajustes bajá "Quieta más de" a **1 hora**, dejá un collar quieto sobre un poste y llevate el otro caminando → tiene que llegar el aviso. Después volvé a poner 5 horas.
6. **Prueba de alcance:** llevá un collar en la camioneta al punto más lejano del campo y a los bajos o cañadones. Anotá dónde deja de llegar la ubicación.

### Etapa 2: piloto en el campo (3 a 4 semanas)
1. Poné los collares en **2 ovejas que guíen la majada** y que vuelvan seguido al corral (así los cargás).
2. Todos los domingos anotá en un papel o en las notas del celular:
   - cuántos días duró la batería,
   - cuántos avisos llegaron y cuántos eran falsos,
   - si hubo horas sin datos (mirar el recorrido en el mapa),
   - si tu viejo abrió la app sin que se lo pidas.

### ¿Funcionó? Criterios para decidir
| Pregunta | Funciona si… |
|---|---|
| ¿Llegan los datos? | Hay ubicación la mayor parte del día y la noche |
| ¿Los avisos sirven? | Menos de 1 aviso falso por semana y ningún escape sin aviso |
| ¿La batería aguanta? | Por lo menos 7 días, o sea cargar 1 vez por semana |
| ¿Tu viejo lo usa? | La abre solo y carga los registros sin ayuda |

Si todo da bien: más collares, un bot de Telegram para que los avisos lleguen siempre y, con los datos juntados, entrenar la IA que reconoce comportamientos.
Si algo falla: anotá qué y cuándo; con eso se ajusta (umbrales, intervalo del GPS, ubicación de la base).

---

## Limitaciones de esta versión
- Los avisos llegan con la app abierta o minimizada. Si el celular cierra la app del todo, no llegan.
- Solo se ven las ovejas que tienen collar.
- Todo se guarda en el celular: hacé **copia de seguridad** (Ajustes → Tus datos) cada tanto.
- Si cambiás el código, subí la versión en `sw.js` (`majada-v2` → `majada-v3`) para que el celular tome los cambios.
