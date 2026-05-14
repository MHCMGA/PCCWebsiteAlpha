import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import About from "./About";

function renderRoute() {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  );
}

describe("About page", () => {
  it("renders the page heading", () => {
    renderRoute();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/About Us/i);
  });

  it("shows all three team members", () => {
    renderRoute();
    expect(
      screen.getByRole("heading", { level: 3, name: /John A\. Weitzel/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /Matthew A\. Holycross/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /Michael D\. Hunter/i }),
    ).toBeInTheDocument();
  });
});
