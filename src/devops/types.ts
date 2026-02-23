export const DEVOPS_TOOL_CATEGORIES = ["cicd", "iac", "monitoring", "cloud", "security"] as const;

export type DevopsToolCategory = (typeof DEVOPS_TOOL_CATEGORIES)[number];

export const DEVOPS_ROLES = ["viewer", "operator", "admin"] as const;

export type DevopsRole = (typeof DEVOPS_ROLES)[number];

export type DevopsToolDefinition = {
  id: string;
  name: string;
  category: DevopsToolCategory;
  description: string;
  risky: boolean;
  defaultCommand: string;
};

export type ExecuteDevopsToolParams = {
  toolId: string;
  command?: string;
  role: DevopsRole;
  dryRun?: boolean;
};

export type ExecuteDevopsToolResult = {
  allowed: boolean;
  reason?: string;
  command: string;
  dryRun: boolean;
};
