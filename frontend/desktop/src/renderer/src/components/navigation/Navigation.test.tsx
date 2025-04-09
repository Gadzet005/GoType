import { AppNavigation } from "@/components/navigation/AppNavigation";
import { render } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import userEvent from "@testing-library/user-event";
import React from "react";

const DummyPageComponent: React.FC<{
  text: string;
  children?: React.ReactNode;
}> = ({ text, children }) => {
  return (
    <div>
      <p>{text}</p>
      {children}
    </div>
  );
};

function getLeveLText(id: number, name: string) {
  return `Level(id=${id} name=${name})`;
}

function getDummyRoutes(LinkComponent: React.FC<any>) {
  return new Map<string, any>([
    [
      "",
      () => (
        <DummyPageComponent text="default page">
          <LinkComponent href="home">go home</LinkComponent>
        </DummyPageComponent>
      ),
    ],
    [
      "home",
      () => (
        <DummyPageComponent text="home page">
          <LinkComponent
            href="level"
            params={{
              id: 1,
              name: "Level-1",
            }}
          >
            go to Level 1
          </LinkComponent>
          <LinkComponent
            href="level"
            params={{
              id: 2,
              name: "Level-2",
            }}
          >
            go to Level 2
          </LinkComponent>
        </DummyPageComponent>
      ),
    ],
    [
      "level",
      ({ id, name }: { id: number; name: string }) => (
        <DummyPageComponent text={getLeveLText(id, name)}>
          <LinkComponent href="not found">go to not found</LinkComponent>
        </DummyPageComponent>
      ),
    ],
  ]);
}

test.each([
  {
    label: "Button",
    LinkComponent: Button,
  },
  {
    label: "Link",
    LinkComponent: Link,
  },
])("AppNavigation with $label", async ({ LinkComponent }) => {
  const dummyRoutes = getDummyRoutes(LinkComponent);
  const { getByText } = render(<AppNavigation routes={dummyRoutes} />);

  expect(getByText("default page")).toBeInTheDocument();

  await userEvent.click(getByText("go home"));

  expect(getByText("home page")).toBeInTheDocument();

  await userEvent.click(getByText("go to Level 1"));

  expect(getByText(getLeveLText(1, "Level-1"))).toBeInTheDocument();

  await userEvent.click(getByText("go to not found"));

  expect(getByText("default page")).toBeInTheDocument();
});
