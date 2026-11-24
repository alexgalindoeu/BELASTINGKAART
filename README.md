# Belastingkaart

Calculadora fiscal belga bilingüe (NL/FR), con arquitectura modular inspirada en la de Mapafiscal y reglas fiscales belgas independientes.

## Estado real
La web desplegable está en `web/`. Incluye la primera interfaz bilingüe y los parámetros federales de 2026 que ya se han podido documentar oficialmente. **Todavía no calcula el salario neto**: el motor está parcialmente implementado y bloquea expresamente el resultado completo mientras falten reglas de nómina, cotizaciones y recargos locales.

## Principios
- Fuentes fiscales exclusivamente oficiales.
- Parámetros versionados en YAML, con trazabilidad normativa completa.
- Motor de referencia R y motor JavaScript con paridad comprobada.
- Una lógica de cálculo común para NL y FR.
- Separación estricta entre año de ingresos y año de evaluación.
- Flandes primero; Bruselas y Valonia se incorporan cuando sus reglas estén documentadas.

## Arquitectura
- `R/`: motor de referencia y reglas de cálculo.
- `params/`: parámetros oficiales por año de ingresos.
- `tools/`: exportación, generación y validación.
- `web/`: aplicación estática, motores JS, recursos y datos generados.
- `test/`: pruebas Node y de navegador.
- `tests/`: pruebas R/testthat.
- `docs/`: diseño, fuentes, cobertura, validación y decisiones.
- `.github/workflows/`: CI y publicación.
- `supabase/`: backend opcional; sin secretos ni configuración de producción en el repositorio.

## Comandos
Requiere Node.js 20+ y R con los paquetes `yaml`, `jsonlite` y `testthat`.

```bash
npm test
npm run validate:params
Rscript tests/testthat.R
Rscript tools/export_parameters.R --check
```

## Fuentes
Ver [docs/SOURCES.md](docs/SOURCES.md), [docs/PARAMETER_POLICY.md](docs/PARAMETER_POLICY.md) y [docs/CALCULATION_SCOPE.md](docs/CALCULATION_SCOPE.md).
