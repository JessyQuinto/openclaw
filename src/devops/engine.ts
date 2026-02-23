import { getDevopsToolById } from "./catalog.js";
import { validateCommandForSandbox, validateRoleForTool } from "./security.js";
import type { ExecuteDevopsToolParams, ExecuteDevopsToolResult } from "./types.js";

export function executeDevopsTool(params: ExecuteDevopsToolParams): ExecuteDevopsToolResult {
  const tool = getDevopsToolById(params.toolId);
  if (!tool) {
    return {
      allowed: false,
      reason: `Unknown tool: ${params.toolId}`,
      command: params.command ?? "",
      dryRun: true,
    };
  }

  const command = params.command?.trim() || tool.defaultCommand;
  const roleCheck = validateRoleForTool(tool.id, params.role);
  if (!roleCheck.allowed) {
    return {
      allowed: false,
      reason: roleCheck.reason,
      command,
      dryRun: true,
    };
  }

  const sandboxCheck = validateCommandForSandbox(command, params.role);
  if (!sandboxCheck.allowed) {
    return {
      allowed: false,
      reason: sandboxCheck.reason,
      command,
      dryRun: true,
    };
  }

  return {
    allowed: true,
    command,
    dryRun: params.dryRun ?? true,
  };
}
