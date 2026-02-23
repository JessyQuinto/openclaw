import { describe, expect, it } from "vitest";
import { executeDevopsTool } from "./engine.js";

describe("executeDevopsTool", () => {
  it("blocks risky tools for viewer role", () => {
    const result = executeDevopsTool({ toolId: "iac.terraform", role: "viewer" });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Minimum role is operator");
  });

  it("allows dry-run execution for operator role", () => {
    const result = executeDevopsTool({ toolId: "cicd.github-actions", role: "operator" });

    expect(result.allowed).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.command).toBe("gh workflow list");
  });

  it("blocks high-risk commands for non-admin roles", () => {
    const result = executeDevopsTool({
      toolId: "iac.terraform",
      role: "operator",
      command: "terraform apply tfplan",
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("requires admin role");
  });
});
