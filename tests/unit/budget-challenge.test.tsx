import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BudgetChallenge } from "@/components/interactive/budget-challenge";

describe("BudgetChallenge", () => {
  it("starts within budget with UGX 8,000 remaining", () => {
    render(<BudgetChallenge />);
    expect(screen.getByTestId("remaining")).toHaveTextContent("UGX 8,000");
    expect(screen.getByTestId("status")).toHaveTextContent("Within budget");
  });

  it("updates the remainder when extras are toggled", async () => {
    const user = userEvent.setup();
    render(<BudgetChallenge />);
    await user.click(screen.getByLabelText(/one extra marker/i));
    expect(screen.getByTestId("remaining")).toHaveTextContent("UGX 4,500");
    await user.click(screen.getByLabelText(/one extra marker/i));
    expect(screen.getByTestId("remaining")).toHaveTextContent("UGX 8,000");
  });

  it("flags over-budget plans", async () => {
    const user = userEvent.setup();
    render(<BudgetChallenge />);
    for (const box of screen.getAllByRole("checkbox")) await user.click(box);
    expect(screen.getByTestId("remaining")).toHaveTextContent("−UGX 1,000");
    expect(screen.getByTestId("status")).toHaveTextContent("Over budget");
    expect(screen.getByTestId("calculation")).toHaveTextContent("25,000 − 3,000 − 14,000 − 9,000 = −1,000");
  });
});
