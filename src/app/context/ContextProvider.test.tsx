import React from "react";
import { act, render } from "@testing-library/react";
import ContextProvider from "./ContextProvider";
import { useGlobals } from "../hooks/useGlobals";
import MemberService from "../services/MemberService";

jest.mock("../services/MemberService");
const mockedGetDetail = MemberService.prototype
  .getMemberDetail as jest.Mock;

const storedMember = { _id: "m1", memberNick: "stored" };

const Probe = () => {
  const { authMember } = useGlobals();
  return <div data-testid="nick">{authMember?.memberNick ?? "guest"}</div>;
};

// Mock qilingan so'rov promise'i va undan keyingi setState'larni yakunlash
const flush = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

const renderWithProvider = () =>
  render(
    <ContextProvider>
      <Probe />
    </ContextProvider>,
  );

beforeEach(() => {
  localStorage.clear();
  mockedGetDetail.mockReset();
});

test("anonim mehmon uchun /member/detail chaqirilmaydi", () => {
  const { getByTestId } = renderWithProvider();
  expect(getByTestId("nick").textContent).toBe("guest");
  expect(mockedGetDetail).not.toHaveBeenCalled();
});

test("200 — user serverdan tiklanadi va localStorage yangilanadi", async () => {
  localStorage.setItem("memberData", JSON.stringify(storedMember));
  mockedGetDetail.mockResolvedValue({ _id: "m1", memberNick: "fresh" });

  const { getByTestId } = renderWithProvider();
  await flush();
  expect(getByTestId("nick").textContent).toBe("fresh");
  expect(JSON.parse(localStorage.getItem("memberData") as string).memberNick).toBe(
    "fresh",
  );
});

test("401 — logout qilinadi", async () => {
  localStorage.setItem("memberData", JSON.stringify(storedMember));
  mockedGetDetail.mockRejectedValue({ response: { status: 401 } });

  const { getByTestId } = renderWithProvider();
  await flush();
  expect(getByTestId("nick").textContent).toBe("guest");
  expect(localStorage.getItem("memberData")).toBeNull();
});

test.each([
  ["5xx", { response: { status: 500 } }],
  ["network", new Error("Network Error")],
])("%s xatosida user saqlanib qoladi", async (_label, error) => {
  localStorage.setItem("memberData", JSON.stringify(storedMember));
  mockedGetDetail.mockRejectedValue(error);

  const { getByTestId } = renderWithProvider();
  await flush();
  expect(mockedGetDetail).toHaveBeenCalled();
  expect(getByTestId("nick").textContent).toBe("stored");
  expect(localStorage.getItem("memberData")).not.toBeNull();
});
