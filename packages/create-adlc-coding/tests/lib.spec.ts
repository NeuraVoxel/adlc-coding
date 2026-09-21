import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { collectReferences, resolveReference } from '../../../scripts/verify-doc-references.ts'
import {
  applyRenames,
  COMPONENT_REQUIRES,
  COMPONENTS,
  findMissingComponents,
  findUnlistedRootFiles,
  isCarried,
  isLinkSurface,
  isRenamable,
  mergeScripts,
  pruneExcludedReferences,
  resolveComponents,
  RUNNER_SCRIPTS,
  SCAFFOLD_ONLY_FILES,
  SCAFFOLD_TEMPLATES,
  scaffoldChangeLog,
  scaffoldFileSet,
  scaffoldPackageJson,
  type ComponentName,
} from '../lib.ts'

const kitRoot = resolve(import.meta.dirname, '..', '..', '..')

describe('resolveComponents', () => {
  it('selects every component when --only is absent', () => {
    expect(resolveComponents(undefined)).toEqual(['rules', 'gates', 'docs', 'workflows', 'ci'])
  })

  it('parses a comma-separated selection', () => {
    expect(resolveComponents('gates,docs')).toEqual(['gates', 'docs'])
  })

  it('rejects an unknown component instead of defaulting', () => {
    expect(() => resolveComponents('rules,nope')).toThrow(/unknown component/)
  })
})

describe('scaffoldFileSet', () => {
  it('carries every component file plus the scaffold-only paths', () => {
    const files = scaffoldFileSet()
    expect(files).toStrictEqual([...files].sort())
    for (const name of Object.keys(COMPONENTS) as ComponentName[]) {
      expect(files).toEqual(expect.arrayContaining([...COMPONENTS[name]]))
    }
    expect(files).toEqual(expect.arrayContaining([...SCAFFOLD_ONLY_FILES]))
  })

  it('names only paths this checkout actually holds', () => {
    for (const file of scaffoldFileSet()) {
      expect(existsSync(resolve(kitRoot, file)), file).toBe(true)
    }
  })

  it('excludes this repository\'s own record while keeping the shipped contracts', () => {
    // The acceptance case: what belongs to this repository and to nothing else.
    expect(isCarried('.agents/notes/implemented/process/2026-09-21-adlc-research-tree-and-prefix-rule.md')).toBe(false)
    expect(isCarried('.agents/notes/implemented/process/2026-09-21-adlc-research-tree-and-prefix-rule.zh.md')).toBe(false)
    expect(isCarried('.agents/inbox/2026-09-21-integrate-research-skill.md')).toBe(false)
    expect(isCarried('.agents/learning/2026-09-21-adlc-flow-with-issue-channel.md')).toBe(false)
    expect(isCarried('packages/create-adlc-coding/lib.ts')).toBe(false)
    expect(isCarried('pnpm-lock.yaml')).toBe(false)
    // The lifecycle supplement ships through `rules`; the class directories do not.
    expect(isCarried('.agents/notes/implemented/AGENTS.md')).toBe(true)
    expect(isCarried('.agents/notes/proposed')).toBe(false)
    expect(isCarried('.agents/inbox/QUEUE.md')).toBe(true)
    expect(isCarried('.agents/skills/adlc-implement/SKILL.md')).toBe(true)
  })

  it('carries a directory the set holds files under', () => {
    expect(isCarried('.agents/skills')).toBe(true)
    expect(isCarried('docs')).toBe(true)
    expect(isCarried('packages')).toBe(false)
  })
})

describe('findUnlistedRootFiles', () => {
  it('rejects a root file that must ship but is missing from the set', () => {
    const set = scaffoldFileSet().filter(file => file !== 'vitest.config.ts')
    expect(findUnlistedRootFiles(['package.json', 'vitest.config.ts'], set)).toEqual([
      'vitest.config.ts is neither carried by a component nor listed in SCAFFOLD_ONLY_FILES',
    ])
  })

  it('accepts a complete set and the root paths a scaffold deliberately skips', () => {
    expect(findUnlistedRootFiles(scaffoldFileSet(), scaffoldFileSet())).toEqual([])
    expect(findUnlistedRootFiles(['README.md', 'LICENSE', 'pnpm-lock.yaml'], scaffoldFileSet())).toEqual([])
  })

  it('accounts for every root file this repository tracks', () => {
    // A subprocess boundary: splitting git's output leaves a trailing empty line.
    const tracked = execFileSync('git', ['ls-files'], { cwd: kitRoot, encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
    expect(findUnlistedRootFiles(tracked, scaffoldFileSet())).toEqual([])
  })

  it('checks root paths only', () => {
    expect(findUnlistedRootFiles(['docs/unlisted.md'], scaffoldFileSet())).toEqual([])
  })
})

describe('SCAFFOLD_TEMPLATES', () => {
  it('templates only paths the scaffold writes', () => {
    const files = new Set(scaffoldFileSet())
    for (const path of Object.keys(SCAFFOLD_TEMPLATES)) expect(files.has(path), path).toBe(true)
  })
})

describe('scaffoldChangeLog', () => {
  it('keeps the header and the Unreleased heading, cutting this kit\'s history', () => {
    const trimmed = scaffoldChangeLog(
      '# Changelog\n\nIntro.\n\n## Unreleased\n\n### Added\n\n- ours.\n\n## [1.0.0] — 2026-09-20\n\n- older.\n',
    )
    expect(trimmed).toBe('# Changelog\n\nIntro.\n\n## Unreleased\n')
  })

  it('refuses a changelog with no cut point instead of shipping one whole', () => {
    expect(() => scaffoldChangeLog('# Changelog\n\n## [1.0.0] — 2026-09-20\n')).toThrow(
      /no "## Unreleased" heading/,
    )
  })
})

describe('scaffoldPackageJson', () => {
  it('drops the kit\'s own create script and keeps the rest', () => {
    const scaffolded = JSON.parse(
      scaffoldPackageJson(
        JSON.stringify({ name: 'adlc-coding', scripts: { create: 'tsx packages/create-adlc-coding/bin.ts', test: 'vitest run' } }, null, 2),
      ),
    ) as { scripts: Record<string, string> }
    expect(scaffolded.scripts.create).toBeUndefined()
    expect(scaffolded.scripts.test).toBe('vitest run')
  })

  it('leaves a manifest without scripts alone', () => {
    expect(JSON.parse(scaffoldPackageJson('{"name":"x"}'))).toStrictEqual({ name: 'x' })
  })
})

describe('isRenamable', () => {
  it('renames text surfaces only', () => {
    expect(isRenamable('package.json')).toBe(true)
    expect(isRenamable('README.md')).toBe(true)
    expect(isRenamable('pnpm-lock.yaml')).toBe(true)
    expect(isRenamable('.gitignore')).toBe(false)
  })
})

describe('isLinkSurface', () => {
  it('unwraps references in documents only, never in code or config', () => {
    expect(isLinkSurface('docs/architecture.md')).toBe(true)
    expect(isLinkSurface('.agents/skills/adlc-implement/SKILL.md')).toBe(true)
    expect(isLinkSurface('scripts/verify-doc-references.spec.ts')).toBe(false)
    expect(isLinkSurface('package.json')).toBe(false)
  })
})

describe('applyRenames', () => {
  it('replaces the kit name across text surfaces', () => {
    const renamed = applyRenames(
      '"name": "adlc-coding", see [the docs](docs/architecture.md) of adlc-coding',
      { name: 'my-app' },
    )
    expect(renamed).toContain('"name": "my-app"')
    expect(renamed).toContain('of my-app')
    expect(renamed).not.toContain('adlc-coding')
  })

  it('preserves markdown link targets, which are paths rather than prose', () => {
    const renamed = applyRenames(
      'See [the installer note](../../.agents/notes/implemented/process/2026-09-15-create-adlc-coding-installer.md) in adlc-coding.',
      { name: 'my-app' },
    )
    expect(renamed).toContain('2026-09-15-create-adlc-coding-installer.md')
    expect(renamed).toContain('in my-app.')
  })

  it('renames link text, which is prose', () => {
    expect(applyRenames('[adlc-coding docs](docs/architecture.md)', { name: 'my-app' })).toBe(
      '[my-app docs](docs/architecture.md)',
    )
  })
})

describe('pruneExcludedReferences', () => {
  const from = 'AGENTS.md'
  const prune = (content: string): string =>
    pruneExcludedReferences(content, target => resolveReference(from, target))

  it('unwraps a link into the installer package and keeps its text', () => {
    expect(prune('Details: [installer README](packages/create-adlc-coding/README.md).')).toBe(
      'Details: installer README.',
    )
  })

  it('unwraps an image into the lockfile', () => {
    expect(prune('![lock](pnpm-lock.yaml)')).toBe('lock')
  })

  it('unwraps a kit-history link into a note the scaffold does not carry', () => {
    const link = '[pairing decision](.agents/notes/implemented/process/2026-09-15-bilingual-doc-pairing.md)'
    expect(prune(link)).toBe('pairing decision')
  })

  it('keeps references the scaffold ships and references that are external', () => {
    const shipped = 'See [architecture](docs/architecture.md) and [web](https://example.com/x.md).'
    expect(prune(shipped)).toBe(shipped)
  })

  it('leaves every remaining link in a shipped document pointing at a path the scaffold writes', () => {
    for (const file of scaffoldFileSet().filter(path => path.endsWith('.md'))) {
      const pruned = pruneExcludedReferences(
        readFileSync(resolve(kitRoot, file), 'utf8'),
        target => resolveReference(file, target),
      )
      for (const { target } of collectReferences(new Map([[file, pruned]]))) {
        expect(isCarried(target), `${file} keeps a link to ${target}`).toBe(true)
      }
    }
  })
})

describe('mergeScripts', () => {
  it('adds only missing runner scripts and preserves existing ones', () => {
    const { scripts, added } = mergeScripts(
      { test: 'vitest', 'check:ci': 'custom' },
      RUNNER_SCRIPTS,
    )
    expect(scripts['test']).toBe('vitest')
    expect(scripts['check:ci']).toBe('custom')
    expect(scripts['doc-sync']).toBe(RUNNER_SCRIPTS['doc-sync'])
    expect(added).toEqual(['doc-sync', 'check:all'])
  })
})

describe('findMissingComponents', () => {
  it('rejects a selection that omits an instruction-layer dependency', () => {
    expect(findMissingComponents(resolveComponents('rules,docs'))).toEqual([
      'rules needs workflows, ci',
    ])
  })

  it('accepts a complete selection and an independent component', () => {
    expect(findMissingComponents(resolveComponents(undefined))).toEqual([])
    expect(findMissingComponents(resolveComponents('gates'))).toEqual([])
  })

  it('declares exactly the components the shipped AGENTS.md links', () => {
    const owner = new Map<string, ComponentName>()
    for (const [name, files] of Object.entries(COMPONENTS) as [ComponentName, readonly string[]][]) {
      for (const file of files) owner.set(file, name)
    }
    const linked = new Set<ComponentName>()
    for (const { target } of collectReferences(
      new Map([['AGENTS.md', readFileSync(resolve(kitRoot, 'AGENTS.md'), 'utf8')]]),
    )) {
      const name = owner.get(target)
      if (name !== undefined && name !== 'rules') linked.add(name)
    }
    expect([...linked].sort()).toEqual([...COMPONENT_REQUIRES.rules].sort())
  })
})
