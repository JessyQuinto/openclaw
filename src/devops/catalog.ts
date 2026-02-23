import type { DevopsToolDefinition } from "./types.js";

export const DEVOPS_TOOL_CATALOG: DevopsToolDefinition[] = [
  {
    id: "cicd.github-actions",
    name: "GitHub Actions",
    category: "cicd",
    description: "Trigger and inspect GitHub Actions workflows for build/test/deploy.",
    risky: false,
    defaultCommand: "gh workflow list",
  },
  {
    id: "cicd.jenkins",
    name: "Jenkins",
    category: "cicd",
    description: "Run Jenkins pipelines and collect execution metadata.",
    risky: true,
    defaultCommand: "jenkins-cli build",
  },
  {
    id: "iac.terraform",
    name: "Terraform",
    category: "iac",
    description: "Plan/apply infrastructure-as-code changes with policy checks.",
    risky: true,
    defaultCommand: "terraform plan",
  },
  {
    id: "iac.ansible",
    name: "Ansible",
    category: "iac",
    description: "Run infrastructure automation and configuration playbooks.",
    risky: true,
    defaultCommand: "ansible-playbook site.yml --check",
  },
  {
    id: "monitoring.logs",
    name: "Log Analysis",
    category: "monitoring",
    description: "Inspect logs and alerts for operational incidents.",
    risky: false,
    defaultCommand: 'rg --stats "ERROR|CRITICAL" ./logs',
  },
  {
    id: "cloud.aws",
    name: "AWS",
    category: "cloud",
    description: "Inspect and operate AWS workloads used by delivery pipelines.",
    risky: true,
    defaultCommand: "aws sts get-caller-identity",
  },
  {
    id: "security.audit",
    name: "Security Audit",
    category: "security",
    description: "Run security audits for dependencies and runtime hardening.",
    risky: false,
    defaultCommand: "pnpm audit --prod",
  },
];

export function getDevopsToolById(toolId: string): DevopsToolDefinition | undefined {
  return DEVOPS_TOOL_CATALOG.find((tool) => tool.id === toolId);
}
