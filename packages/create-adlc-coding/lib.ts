/**
 * Pure planning logic for the adlc-coding installer: component selection, the
 * scaffold file set, identity renames, scaffold content templates, and
 * package-script merging. No I/O lives here, so the acceptance paths are
 * testable directly.
 */

/** Installable rule components, each mapping to repo-relative file paths. */
export const COMPONENTS = {
  rules: [
    'AGENTS.md',
    '.agents/notes/README.md',
    '.agents/notes/README.zh.md',
    '.agents/notes/AGENTS.md',
    '.agents/notes/implemented/AGENTS.md',
    '.agents/notes/archived/AGENTS.md',
  ],
  gates: [
    'lefthook.yml',
    '.oxlintrc.json',
    'scripts/run-gates.ts',
    'scripts/run-gates.spec.ts',
    'scripts/verify-doc-pairing.ts',
    'scripts/verify-doc-pairing.spec.ts',
    'scripts/agent-note-tree.ts',
    'scripts/agent-note-tree.spec.ts',
    'scripts/verify-agent-note-format.ts',
    'scripts/verify-agent-note-format.spec.ts',
    'scripts/verify-archived-agent-notes.ts',
    'scripts/verify-archived-agent-notes.spec.ts',
    'scripts/verify-doc-references.ts',
    'scripts/verify-doc-references.spec.ts',
    'scripts/archived-notes.manifest.json',
  ],
  docs: [
    'docs/architecture.md',
    'docs/architecture.zh.md',
    'docs/testing.md',
    'docs/testing.zh.md',
  ],
  workflows: [
    '.agents/inbox/README.md',
    '.agents/inbox/README.zh.md',
    '.agents/inbox/QUEUE.md',
    '.agents/learning/README.md',
    '.agents/learning/README.zh.md',
    '.agents/learning/.gitignore',
    '.agents/research/README.md',
    '.agents/research/README.zh.md',
    '.agents/skills/adlc-inbox-capture/SKILL.md',
    '.agents/skills/adlc-inbox-promote/SKILL.md',
    '.agents/skills/adlc-inbox-view/SKILL.md',
    '.agents/skills/adlc-implement/SKILL.md',
    '.agents/skills/adlc-learning-note/SKILL.md',
    '.agents/skills/adlc-research/SKILL.md',
    '.agents/skills/adlc-release/SKILL.md',
    'ChangeLog.md',
    'docs/release.md',
    'docs/release.zh.md',
  ],
  ci: ['.github/workflows/ci.yml'],
} as const

export type ComponentName = keyof typeof COMPONENTS

/**
 * Components that carry the referents of the shipped instruction layer.
 *
 * `AGENTS.md` is the one file an agent is told to follow, so its links must
 * land: it points at the docs, the workflow contracts, and the CI workflow.
 * Installing `rules` without those writes standing orders that reference files
 * the target never received — a dangling referent, which the root standing
 * order forbids.
 *
 * Only the instruction layer is declared here. Cross-links *between* documents
 * are validated by `verify-doc-references` inside this repository, and the
 * kit-history links no component ships are pruned by adopters, as the CLI's
 * own next-steps message says.
 *
 * `lib.spec.ts` re-derives this map from `AGENTS.md`, so it cannot drift.
 */
export const COMPONENT_REQUIRES: Readonly<Record<ComponentName, readonly ComponentName[]>> = {
  rules: ['docs', 'workflows', 'ci'],
  gates: [],
  docs: [],
  workflows: [],
  ci: [],
}

/**
 * Find the component dependencies a selection omits.
 * @param names - the selected components.
 * @returns one message per component with missing dependencies; empty when the
 * selection is closed under `COMPONENT_REQUIRES`.
 */
export function findMissingComponents(names: readonly ComponentName[]): string[] {
  const selected = new Set(names)
  const missing: string[] = []
  for (const name of names) {
    const absent = COMPONENT_REQUIRES[name].filter(required => !selected.has(required))
    if (absent.length > 0) missing.push(`${name} needs ${absent.join(', ')}`)
  }
  return missing
}

/**
 * Root and subtree files a fresh scaffold needs and no component carries: the
 * project manifest and its tool configuration, plus the supplement for the one
 * subtree that ships. `packages/` is absent on purpose — its supplement
 * documents the installer, which a scaffold does not carry — and a new project
 * adds its own supplement when it creates that tree.
 *
 * `scripts/CLAUDE.md` is copied like the rest of the set and then recreated as
 * a relative alias: `fs.cp` materializes a copied symlink with an absolute
 * target pointing back at this checkout.
 */
export const SCAFFOLD_ONLY_FILES: readonly string[] = [
  '.gitignore',
  'package.json',
  'pnpm-workspace.yaml',
  'scripts/AGENTS.md',
  'scripts/CLAUDE.md',
  'tsconfig.base.json',
  'tsconfig.tools.json',
  'vitest.config.ts',
]

/**
 * Root paths a scaffold deliberately does not carry.
 *
 * A new project writes its own README pair and licence, resolves its own
 * dependency graph, and receives `CLAUDE.md` as a created alias rather than a
 * copied file. Every other root path this checkout holds has to reach the new
 * project through a component or `SCAFFOLD_ONLY_FILES`; `findUnlistedRootFiles`
 * is what makes the next added root file fail here rather than disappear.
 */
export const NOT_CARRIED_ROOT_PATHS: readonly string[] = [
  'CLAUDE.md',
  'LICENSE',
  'README.md',
  'README.zh.md',
  'pnpm-lock.yaml',
]

/**
 * Every path a fresh scaffold writes, sorted.
 *
 * One source serves both modes: what `adopt` can install is what `new` ships.
 * This repository's own records — its Agent Notes, sparks, retrospectives —
 * reach the set only through a component that names them, and none does.
 * @returns repo-relative posix paths: the union of `COMPONENTS` and
 * `SCAFFOLD_ONLY_FILES`.
 */
export function scaffoldFileSet(): string[] {
  const files = new Set<string>(SCAFFOLD_ONLY_FILES)
  for (const component of Object.values(COMPONENTS)) {
    for (const file of component) files.add(file)
  }
  return [...files].sort()
}

/**
 * Whether a scaffold carries a path.
 *
 * True for a file in the set and for a directory the set has files under, so a
 * link to a shipped directory survives while a link into this repository's own
 * record does not.
 * @param relPosixPath - repo-relative posix path, already normalized.
 * @returns true when the path or its subtree reaches the new project.
 */
export function isCarried(relPosixPath: string): boolean {
  return scaffoldFileSet().some(
    file => file === relPosixPath || file.startsWith(`${relPosixPath}/`),
  )
}

/**
 * Root paths that must ship but are missing from a scaffold file set.
 * @param rootPaths - repo-relative paths found at a checkout's root.
 * @param fileSet - the set under test.
 * @returns one message per root path the set neither carries nor declares
 * uncarried; empty when the set is complete.
 */
export function findUnlistedRootFiles(
  rootPaths: readonly string[],
  fileSet: readonly string[],
): string[] {
  const carried = new Set(fileSet)
  return rootPaths
    .filter(path => !path.includes('/'))
    .filter(path => !carried.has(path) && !NOT_CARRIED_ROOT_PATHS.includes(path))
    .sort()
    .map(path => `${path} is neither carried by a component nor listed in SCAFFOLD_ONLY_FILES`)
}

/**
 * The scaffold's `ChangeLog.md`: the release contract's header and the
 * `## Unreleased` heading a cut renames, without this kit's history — a new
 * project's changelog records its own changes, not ours.
 * @param content - the kit's `ChangeLog.md`.
 * @returns the content up to and including the `## Unreleased` heading.
 * @throws when that heading is absent, since the template then has no cut
 * point and the adopter would receive unreleased history as their own.
 */
export function scaffoldChangeLog(content: string): string {
  const lines = content.split('\n')
  const heading = lines.indexOf('## Unreleased')
  if (heading === -1) {
    throw new Error('create-adlc-coding: ChangeLog.md carries no "## Unreleased" heading to cut at.')
  }
  return `${lines.slice(0, heading + 1).join('\n')}\n`
}

/**
 * The scaffold's `package.json`: the kit's own `create` script removed, because
 * it invokes an installer package a scaffold deliberately does not carry.
 * @param content - the kit's `package.json`.
 * @returns the manifest without that script, formatted like its source.
 * @throws when the content is not valid JSON.
 */
export function scaffoldPackageJson(content: string): string {
  const manifest = JSON.parse(content) as { scripts?: Record<string, string> }
  if (manifest.scripts !== undefined) delete manifest.scripts.create
  return `${JSON.stringify(manifest, null, 2)}\n`
}

/**
 * Files whose scaffold content is not the kit's own, keyed by repo-relative
 * path. Every key has to be in `scaffoldFileSet()`; `lib.spec.ts` checks that,
 * so a template for a path nobody ships cannot sit here unread.
 */
export const SCAFFOLD_TEMPLATES: Readonly<Record<string, (content: string) => string>> = {
  'ChangeLog.md': scaffoldChangeLog,
  'package.json': scaffoldPackageJson,
}

/** Root scripts the gates invoke; adoption adds the ones the target lacks. */
export const RUNNER_SCRIPTS: Readonly<Record<string, string>> = {
  'check:ci': 'tsx scripts/run-gates.ts ci-primary',
  'doc-sync': 'tsx scripts/run-gates.ts doc-sync',
  'check:all': 'tsx scripts/run-gates.ts check-all',
}

/** File suffixes that receive identity renames during a fresh scaffold. */
const TEXT_SUFFIXES: readonly string[] = ['.md', '.json', '.ts', '.js', '.yaml', '.yml']

/**
 * Resolve the component list from the `--only` argument.
 * @param only - raw comma-separated argument; undefined selects every component.
 * @returns component names in selection order.
 * @throws on an unknown component name — selection fails loud instead of defaulting.
 */
export function resolveComponents(only: string | undefined): ComponentName[] {
  const names = only === undefined ? Object.keys(COMPONENTS) : only.split(',')
  for (const name of names) {
    if (!(name in COMPONENTS)) {
      throw new Error(
        `create-adlc-coding: unknown component ${JSON.stringify(name)}; expected one of ${Object.keys(COMPONENTS).join(', ')}.`,
      )
    }
  }
  return names as ComponentName[]
}

/**
 * Whether a file receives identity renames during a fresh scaffold.
 * @param relPosixPath - repo-relative posix path of the file.
 * @returns true for text surfaces carrying kit identity strings.
 */
export function isRenamable(relPosixPath: string): boolean {
  return TEXT_SUFFIXES.some(suffix => relPosixPath.endsWith(suffix))
}

/**
 * Whether a file receives Markdown link unwrapping.
 *
 * A reference is a Markdown construct, so the rule stops at `.md`. Run over a
 * `.ts` or `.json` surface it rewrites markdown-shaped string literals — a gate
 * spec's own link fixtures — and the copy fails its own test suite.
 * @param relPosixPath - repo-relative posix path of the file.
 * @returns true for the surfaces that carry references.
 */
export function isLinkSurface(relPosixPath: string): boolean {
  return relPosixPath.endsWith('.md')
}

/** The target identity a fresh scaffold renames the kit's placeholder to. */
export interface RenameIdentities {
  /** New root package/project name replacing `adlc-coding`. */
  name: string
}

/**
 * Apply the kit's placeholder identity to file content.
 *
 * Markdown link targets are repository paths, not prose. Renaming one would
 * break the reference, because a scaffold renames file *contents* and leaves
 * file *names* alone — so `[…](…/2026-09-15-create-adlc-coding-installer.md)`
 * must keep pointing at the file that is actually on disk. Link text is prose
 * and is renamed.
 * @param content - file content.
 * @param identities - target name.
 * @returns renamed content.
 */
export function applyRenames(content: string, identities: RenameIdentities): string {
  const renameProse = (text: string): string => text.replaceAll('adlc-coding', identities.name)
  let renamed = ''
  let cursor = 0
  for (const match of content.matchAll(/(!?\[[^\]]*\]\()([^)\s]+)(\))/g)) {
    renamed += renameProse(content.slice(cursor, match.index!))
    renamed += `${renameProse(match[1]!)}${match[2]!}${match[3]!}`
    cursor = match.index! + match[0].length
  }
  return renamed + renameProse(content.slice(cursor))
}

/**
 * Unwrap Markdown links whose target the scaffold does not carry.
 *
 * A shipped document that links this repository's own record — an Agent Note,
 * a spark, the installer package, the lockfile — would otherwise reference a
 * path the target never received. Unwrapping keeps the link text as prose and
 * drops only the reference; a link between two shipped files is left alone, so
 * the references a new project can actually follow survive.
 * @param content - file content.
 * @param resolveTarget - maps a link target to a repo-relative path; null when external.
 * @param carried - predicate over repo-relative paths, defaulting to `isCarried`.
 * @returns the content with uncarried references unwrapped.
 */
export function pruneExcludedReferences(
  content: string,
  resolveTarget: (target: string) => string | null,
  carried: (resolved: string) => boolean = isCarried,
): string {
  return content.replace(
    /!?\[([^\]]*)\]\(([^)\s]+)\)/g,
    (match, text: string, target: string) => {
      const resolved = resolveTarget(target)
      return resolved !== null && !carried(resolved) ? text : match
    },
  )
}

/**
 * Merge the runner scripts an adoption target lacks into its package scripts.
 * @param existing - the target's current scripts.
 * @param defaults - runner scripts to add.
 * @returns the merged scripts and the names that were added.
 */
export function mergeScripts(
  existing: Readonly<Record<string, string>>,
  defaults: Readonly<Record<string, string>>,
): { scripts: Record<string, string>; added: string[] } {
  const scripts = { ...existing }
  const added: string[] = []
  for (const [name, command] of Object.entries(defaults)) {
    if (!(name in scripts)) {
      scripts[name] = command
      added.push(name)
    }
  }
  return { scripts, added }
}
