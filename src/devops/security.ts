import { getDevopsToolById } from "./catalog.js";
import type { DevopsRole } from "./types.js";

const ROLE_WEIGHT: Record<DevopsRole, number> = {
  viewer: 1,
  operator: 2,
  admin: 3,
};

const HIGH_RISK_SHELL_PATTERNS = [
  /\brm\s+-rf\b/,
  /\bterraform\s+apply\b/,
  /\bkubectl\s+delete\b/,
  /\bansible-playbook\b.*\b--check\b/i,
  /\bsudo\b/,
];

export type DevopsCommandPolicyResult = {
  allowed: boolean;
  reason?: string;
};

export function validateRoleForTool(toolId: string, role: DevopsRole): DevopsCommandPolicyResult {
  const tool = getDevopsToolById(toolId);
  if (!tool) {
    return { allowed: false, reason: `Unknown tool: ${toolId}` };
  }

  if (!tool.risky) {
    return { allowed: true };
  }

  if (ROLE_WEIGHT[role] < ROLE_WEIGHT.operator) {
    return {
      allowed: false,
      reason: `Role '${role}' cannot execute risky tool '${toolId}'. Minimum role is operator.`,
    };
  }

  return { allowed: true };
}

export function validateCommandForSandbox(
  command: string,
  role: DevopsRole,
): DevopsCommandPolicyResult {
  for (const pattern of HIGH_RISK_SHELL_PATTERNS) {
    if (pattern.test(command) && role !== "admin") {
      return {
        allowed: false,
        reason: `Command requires admin role and hardened sandbox policy: ${command}`,
      };
    }
  }
  return { allowed: true };
}
