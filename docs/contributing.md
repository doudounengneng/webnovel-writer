# Contributing to Webnovel-Writer

> Thank you for considering contributing! We welcome all kinds of contributions.

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're building something amazing together.

## How to Contribute

### 1. Reporting Issues

- Check if the issue already exists
- Use the issue template
- Include steps to reproduce
- Include environment details (OS, Node version, etc.)

### 2. Suggesting Features

- Describe the problem you're solving
- Explain the proposed solution
- Consider if it fits the existing architecture
- Tag with `enhancement`

### 3. Code Contributions

#### Setup

```bash
git clone https://github.com/your-username/webnovel-writer.git
cd webnovel-writer
npm install
npm run build
npm test
```

#### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linter: `npm run lint`
6. Commit with clear messages
7. Push and open a PR

#### Commit Convention

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scopes: core, cli, trae, docs, examples

Examples:
  feat(core): add new quality gate for stage 5
  fix(cli): resolve path resolution on Windows
  docs: update API reference
```

### 4. Adding a New Agent

1. Add to `Agent` enum in `packages/core/src/types/index.ts`
2. Add config to agent registry in `packages/core/src/agents/index.ts`
3. Add Skill to `Skill` enum
4. Create Skill package in `.trae/skills/`
5. Create agent startup config in `.trae/agents/`
6. Update documentation

### 5. Adding a New Stage

1. Add to `Stage` enum in `packages/core/src/types/index.ts`
2. Add stage config in `packages/core/src/stages/index.ts`
3. Add quality gates in `packages/core/src/quality-gates/index.ts`
4. Update workflow config if needed
5. Update documentation

### 6. Improving the Trae Skill Package

- Skills go in `.trae/skills/<skill-name>/SKILL.md`
- Rules go in `.trae/rules/`
- Agent configs go in `.trae/agents/<agent-id>/STARTUP.md`

---

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new functionality
4. Get at least one review
5. Squash commits before merge

## Project Structure

```
Webnovel-Writer/
├── packages/
│   ├── core/        # Core engine (TypeScript)
│   └── cli/         # CLI tool (TypeScript)
├── .trae/           # Trae IDE Skill package
│   ├── skills/      # 11 Skill packages
│   ├── rules/       # Workflow rules
│   └── agents/      # Agent configs
├── docs/            # Documentation
└── examples/        # Example projects
```

## Questions?

Open a discussion or issue. We're happy to help!