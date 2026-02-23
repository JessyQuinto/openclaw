# NexSentinelOps blueprint

NexSentinelOps is the DevOps-first profile and architecture path for OpenClaw.

## Scope

NexSentinelOps narrows the platform to secure DevOps automation:

- CI/CD orchestration (GitHub Actions, GitLab, Jenkins)
- Infrastructure-as-Code operations (Terraform, Ansible)
- Cloud execution controls (AWS, GCP, Azure)
- Monitoring and log triage workflows
- Security audit workflows for dependencies and runtime commands

## Security model

The DevOps engine applies policy gates before execution:

- Role-based access control (`viewer`, `operator`, `admin`)
- Risk classification per tool in the verified catalog
- Sandbox validation for high-risk shell patterns
- Dry-run by default for mutable operations

## Verified tool catalog

NexSentinelOps uses a native tool catalog in code instead of open plugin injection for high-risk operations. Official tools can be versioned and audited as part of release workflows.

## CLI

The `devops` command group exposes native orchestration entry points:

```bash
nexops devops tools
nexops devops run --tool cicd.github-actions
nexops devops run --tool iac.terraform --command "terraform plan -out tfplan"
nexops devops run --tool iac.terraform --command "terraform apply tfplan" --role admin --apply
```

## Rollout strategy

1. Add native DevOps command registry and policy checks.
2. Move execution to sandboxed runners for command allowlists.
3. Add signed catalog manifests (Ed25519 + JWKS verification).
4. Retire non-DevOps channels and legacy assistant workflows in phased releases.
