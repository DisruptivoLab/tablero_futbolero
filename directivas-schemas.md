# Plan de Acción: Modificación de Modelos de Datos (Validado)

**Fecha:** 2025-09-18

**Autor:** Tony (Codirector Senior)

**Para:** Yarbis (Programador Senior)

## Objetivo

Actualizar los esquemas de Mongoose (`League`, `Team`, `Player`) para que coincidan con la arquitectura de datos definida en el documento `api-football.md` y validada contra la `Especificación Funcional Detallada.md`.

Esta tarea es un prerrequisito indispensable para el desarrollo del script de sincronización de datos.

---

## Directivas de Implementación

### 1. Modificar `models/League.js`

**Archivo:** `tactical-board/server/models/League.js`

- [ ] Renombrar el campo `leagueId` a `api_id`.
- [ ] Asegurarse de que el tipo de `api_id` sea `Number` y `unique: true`.
- [ ] Añadir un nuevo campo `logo` de tipo `String`.
- [ ] Eliminar el campo `teams` (el array de referencias a `Team`).

**Esquema Resultante Esperado:**

```javascript
const mongoose = require('mongoose');

const LeagueSchema = new mongoose.Schema({
  api_id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  country: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('League', LeagueSchema);
```

### 2. Modificar `models/Team.js`

**Archivo:** `tactical-board/server/models/Team.js`

- [ ] Renombrar el campo `teamId` a `api_id`.
- [ ] Asegurarse de que el tipo de `api_id` sea `Number` y `unique: true`.
- [ ] Eliminar el campo `players` (el array de referencias a `Player`).

**Esquema Resultante Esperado:**

```javascript
const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  api_id: {
    type: Number,
    required: true,
    unique: true
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  // ... (otros campos existentes como color, textColor, etc. se mantienen)
}, { timestamps: true });
```

### 3. Modificar `models/Player.js`

**Archivo:** `tactical-board/server/models/Player.js`

- [ ] Renombrar el campo `playerId` a `api_id`.
- [ ] Añadir un campo `photo` de tipo `String`.
- [ ] Añadir el campo `isActive` de tipo `Boolean`, con `default: true`.
- [ ] Añadir un campo `specificPosition` de tipo `String`.
- [ ] Modificar el campo `team`: eliminar la restricción `required: true`.

**Esquema Resultante Esperado:**

```javascript
const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  api_id: {
    type: Number,
    required: true,
    unique: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team' // ya no es 'required'
  },
  name: {
    type: String,
    required: true
  },
  position: { // Posición General
    type: String,
    required: true,
    enum: ['GK', 'DF', 'MF', 'FW']
  },
  specificPosition: { // Posición Específica de la API
    type: String
  },
  photo: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);
```
---

**Instrucción Final:** Una vez que estos modelos estén corregidos y alineados con esta directiva, notifícame para proceder con la siguiente fase: el desarrollo del script de sincronización.
