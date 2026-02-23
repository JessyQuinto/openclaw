import type { Command } from "commander";
import { DEVOPS_TOOL_CATALOG } from "../devops/catalog.js";
import { executeDevopsTool } from "../devops/engine.js";
import { DEVOPS_ROLES, type DevopsRole } from "../devops/types.js";

export function registerDevopsCli(program: Command) {
  const devops = program.command("devops").description("NexSentinelOps native DevOps toolchain");

  devops
    .command("tools")
    .description("List official, verified DevOps tools")
    .option("--json", "Emit machine-readable JSON", false)
    .action((options: { json?: boolean }) => {
      if (options.json) {
        console.log(JSON.stringify(DEVOPS_TOOL_CATALOG, null, 2));
        return;
      }

      for (const tool of DEVOPS_TOOL_CATALOG) {
        const risk = tool.risky ? "high-risk" : "standard";
        console.log(`${tool.id} | ${tool.category} | ${risk} | ${tool.name}`);
      }
    });

  devops
    .command("run")
    .description("Validate and stage an official DevOps operation")
    .requiredOption("--tool <toolId>", "Tool identifier (for example: iac.terraform)")
    .option("--command <command>", "Optional command override")
    .option("--role <role>", `Execution role (${DEVOPS_ROLES.join("|")})`, "operator")
    .option("--apply", "Allow non-dry-run execution plan", false)
    .action((options: { tool: string; command?: string; role: DevopsRole; apply?: boolean }) => {
      if (!DEVOPS_ROLES.includes(options.role)) {
        console.error(`blocked: unknown role '${options.role}'`);
        process.exitCode = 1;
        return;
      }

      const result = executeDevopsTool({
        toolId: options.tool,
        command: options.command,
        role: options.role,
        dryRun: !options.apply,
      });

      if (!result.allowed) {
        console.error(`blocked: ${result.reason ?? "policy check failed"}`);
        process.exitCode = 1;
        return;
      }

      const mode = result.dryRun ? "dry-run" : "apply";
      console.log(`[${mode}] ${result.command}`);
    });
}
