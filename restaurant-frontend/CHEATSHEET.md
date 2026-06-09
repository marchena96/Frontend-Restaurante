# Commit Best Practices — Cheat Sheet

## Conventional Commits

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type       | Usage                                |
|------------|--------------------------------------|
| `feat`     | Nueva funcionalidad                  |
| `fix`      | Corrección de bug                    |
| `refactor` | Cambio que no agrega feature ni fix  |
| `style`    | Formato, lint, whitespace            |
| `docs`     | Documentación                        |
| `chore`    | Tooling, build, dependencias         |
| `perf`     | Mejora de rendimiento                |
| `test`     | Tests                                |

### Scope (opcional)

Nombre del módulo afectado (e.g., `auth`, `router`, `layout`).

### Examples

```
feat(auth): add login form validation
fix(router): resolve route tree type error
refactor(layout): replace children with Outlet
docs: add commit cheat sheet
```

## Branching

```
main          — producción
  ├ develop   — integración
     ├ feat/xxx
     ├ fix/xxx
     └ refactor/xxx
```

## Before Committing

```bash
git status                    # revisar archivos modificados
git diff --stat               # resumen de cambios
npm run build                 # asegurar que compila
npm run lint                  # asegurar que no hay errores de lint
```

## Commit Messages

- **Imperativo**: "Add" no "Added" ni "Adds"
- **Máximo 72 caracteres** en la primera línea
- **Cuerpo opcional** con `why` y `how`, separado por blank line

```bash
git commit -m "feat(scope): message" -m "Cuerpo explicativo con el porqué del cambio."
```

## .gitignore Essentials

```
node_modules/
dist/
.env
.env.local
*.tsbuildinfo
.DS_Store
```

## Undo / Fixup

```bash
git commit --amend           # corregir último commit (no push si ya subió)
git commit --fixup <hash>    # marcar fix para squash
git rebase -i --autosquash   # aplicar fixups
git revert <hash>            # revertir commit público
```
