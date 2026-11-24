# Belastingkaart — instrucciones de desarrollo

## Regla principal
Belastingkaart es un proyecto independiente. No modificar, desplegar ni importar datos fiscales de `MAPAFISCAL`. Se puede reutilizar arquitectura y código genérico, nunca reglas, parámetros, textos fiscales ni resultados españoles.

## Coordinación
Varias IA trabajan en este repo. Leer y actualizar `TABLERO.md` antes de empezar cualquier tarea.

## Producto
- Calculadora fiscal belga con arquitectura modular equivalente a Mapafiscal.
- Idiomas: neerlandés (`/nl/`) y francés (`/fr/`), mismo motor y mismos resultados.
- Alcance geográfico inicial: Flandes. Preparar el modelo para Bruselas y Valonia sin fingir cobertura.
- Primer módulo: salario bruto-neto de trabajador por cuenta ajena.
- La interfaz no puede mostrar un neto calculado hasta que todas las reglas necesarias estén confirmadas y probadas.

## Fuentes oficiales: requisito absoluto
Solo fuentes primarias oficiales: FOD/SPF Financiën (`fin.belgium.be`), RSZ/ONSS (`socialsecurity.be`), Vlaamse overheid (`vlaanderen.be`, `belasting.vlaanderen.be`), Brussels Fiscaliteit (`fiscaliteit.brussels`), SPW Finances (`finances.wallonie.be`), Belgisch Staatsblad (`ejustice.just.fgov.be`) y otros organismos públicos competentes. No usar blogs, asesorías, prensa, calculadoras privadas ni sitios comerciales, ni siquiera como contraste.

Si no se puede verificar un parámetro en fuente oficial, dejarlo `pending`; nunca estimarlo. Toda regla debe registrar jurisdicción, año de ingresos, año de evaluación, vigencia, fuente, fecha de consulta, unidad, redondeo y notas de aplicación.

## Arquitectura y paridad
- `params/<income-year>/*.yaml` es la fuente de verdad; los JSON de `web/data/` se generan, nunca se editan a mano.
- Motor de referencia en R (`R/`) y port JavaScript (`web/js/`) deben coincidir en tests.
- Añadir tests R y Node por cada regla, incluidos límites, redondeos y excepciones.
- Los parámetros pendientes o provisionales bloquean el cálculo público correspondiente.
- Separar año de ingresos y año de evaluación; no inferir uno del otro.
- UI y contenido en neerlandés/francés; las traducciones deben conservar el significado jurídico.

## Calidad y seguridad
- Ejecutar `npm test`, `npm run validate:params` y los tests R antes de integrar.
- No subir claves, secretos, tokens, URLs privadas ni credenciales.
- Configuración de Supabase/Stripe solo mediante variables/secretos de entorno y plantillas sin secretos.
- No desplegar ni activar pagos/anuncios hasta que el dueño lo decida.
- Commits descriptivos. Trabajar en rama y PR cuando el flujo de GitHub esté disponible.
