import { waitFor } from "@testing-library/dom";
import { useServicePending } from "../servicePending";
import { renderWithUser } from "@tests/base/utils";
import { UserDummy } from "@tests/dummy/user";
import { act } from "react";

const TestComponent = ({ service }: any) => {
  const { isPending, call } = useServicePending(service);

  return (
    <div>
      <button onClick={() => call()}>Call Service</button>
      {isPending() && <span>Loading...</span>}
    </div>
  );
};

describe("useServicePending", { timeout: 200 }, () => {
  it("should set pending state correctly", async () => {
    const mockService = vi.fn(
      () => new Promise((resolve) => setTimeout(() => resolve("result"), 100))
    );

    const { getByText, queryByText } = renderWithUser(
      UserDummy.create(true),
      <TestComponent service={mockService} />
    );

    expect(queryByText("Loading...")).toBeNull();

    await act(async () => {
      getByText("Call Service").click();
    });

    await waitFor(() => expect(queryByText("Loading...")).toBeInTheDocument());
    await waitFor(() => expect(queryByText("Loading...")).toBeNull());
  });
});
