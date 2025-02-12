import { HomePage } from "@/components/pages/HomePage";
import { cleanup, render } from "@testing-library/react";
import { Menu } from "@/components/pages/HomePage/Menu";
import { AccessType } from "@/components/pages/HomePage/Menu/types";
import { UserDummy } from "@tests/base/dummy";
import { renderWithUser } from "@tests/base/utils";

describe("Home page", () => {
  afterEach(() => {
    cleanup();
  });

  it("Home page should render correctly", () => {
    const user = UserDummy.create(true);

    renderWithUser(user, <HomePage />);
    cleanup();
    user.unauthorize();
    renderWithUser(user, <HomePage />);
  });

  it("Test menu items with accessType = forAll", () => {
    const menuItems = [
      {
        label: "Item 1",
        accessType: AccessType.forAll,
      },
      {
        label: "Item 2",
        accessType: AccessType.forAll,
      },
      {
        label: "Item 3",
        accessType: AccessType.forAuth,
      },
    ];

    const { getAllByText, rerender } = render(<Menu list={menuItems} />);

    expect(getAllByText("Item 1")).toBeTruthy();
    expect(getAllByText("Item 2")).toBeTruthy();

    rerender(<Menu list={menuItems} userAuthed />);

    expect(getAllByText("Item 1")).toBeTruthy();
    expect(getAllByText("Item 2")).toBeTruthy();
  });

  it("Test menu items with accessType = forAuth", () => {
    const menuItems = [
      {
        label: "Item 0",
        accessType: AccessType.forAll,
      },
      {
        label: "Item 1",
        accessType: AccessType.forAuth,
      },
      {
        label: "Item 3",
        accessType: AccessType.forAnonymous,
      },
      {
        label: "Item 2",
        accessType: AccessType.forAuth,
      },
    ];

    const { queryByText, rerender } = render(
      <Menu list={menuItems} userAuthed />
    );

    expect(queryByText("Item 1")).toBeTruthy();
    expect(queryByText("Item 2")).toBeTruthy();

    rerender(<Menu list={menuItems} />);

    expect(queryByText("Item 1")).toBeFalsy();
    expect(queryByText("Item 2")).toBeFalsy();
  });

  it("Test menu items with accessType = forAnonymous", () => {
    const menuItems = [
      {
        label: "Item 0",
        accessType: AccessType.forAll,
      },
      {
        label: "Item 3",
        accessType: AccessType.forAnonymous,
      },
      {
        label: "Item 1",
        accessType: AccessType.forAnonymous,
      },
      {
        label: "Item 2",
        accessType: AccessType.forAuth,
      },
    ];

    const { queryByText, rerender } = render(<Menu list={menuItems} />);

    expect(queryByText("Item 1")).toBeTruthy();
    expect(queryByText("Item 3")).toBeTruthy();

    rerender(<Menu list={menuItems} userAuthed />);

    expect(queryByText("Item 1")).toBeFalsy();
    expect(queryByText("Item 3")).toBeFalsy();
  });
});
