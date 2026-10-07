import React from "react";
import { act, render } from "@testing-library/react";
import axios from "axios";
import AuthenticationModal from "./index";
import ContextProvider from "../../context/ContextProvider";
import Settings from "../../screens/userPage/Settings";
import MemberService from "../../services/MemberService";
import { isStaleSessionError } from "../../context/authSession";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";

jest.mock("axios", () => {
  const fn: any = jest.fn();
  fn.get = jest.fn();
  fn.post = jest.fn();
  return { __esModule: true, default: fn };
});
jest.mock("../../../lib/sweetAlert", () => ({
  sweetErrorHandling: jest.fn(() => Promise.resolve()),
  sweetTopSmallSuccessAlert: jest.fn(() => Promise.resolve()),
}));
const mockedAxios = axios as any;

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const flush = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

// O'rnatilgan @types fireEvent'ni eksport qilmaydi — React controlled input
// uchun native setter + input event yetarli
const typeInto = (input: HTMLInputElement, value: string) =>
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!;
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

const click = (element: HTMLElement) =>
  act(() => {
    element.click();
  });

const httpError = (status: number) => ({
  response: { status, data: { code: status, message: "boom" } },
});
const memberA: any = { _id: "a1", memberNick: "ali", memberPhone: "010" };

// Kutish davomida boshqa auth amali boshlanadi (logout) — generation oshadi
const startOtherAuthChange = async () => {
  mockedAxios.post.mockResolvedValueOnce({ data: { logout: true } });
  await act(async () => {
    await new MemberService().logout();
  });
};

const modalProps = () => ({
  signupOpen: false,
  loginOpen: false,
  handleSignupClose: jest.fn(),
  handleLoginClose: jest.fn(),
  setSignupOpen: jest.fn(),
  setLoginOpen: jest.fn(),
});

const renderModal = (props: ReturnType<typeof modalProps>) =>
  render(
    <ContextProvider>
      <AuthenticationModal {...props} />
    </ContextProvider>,
  );

beforeEach(() => {
  localStorage.clear();
  mockedAxios.mockReset();
  mockedAxios.get.mockReset();
  mockedAxios.post.mockReset();
  mockedAxios.get.mockReturnValue(new Promise(() => {}));
  // CRA jest resetMocks: true — implementatsiyalar har testda qayta beriladi
  (sweetErrorHandling as jest.Mock).mockReset().mockImplementation(() => Promise.resolve());
  (sweetTopSmallSuccessAlert as jest.Mock)
    .mockReset()
    .mockImplementation(() => Promise.resolve());
});

/* ── Service: eskirgan xato javobi ham StaleSessionError ── */

test.each<[string, () => Promise<any>]>([
  ["login", () => new MemberService().login({ memberNick: "ali", memberPassword: "pw" })],
  [
    "signup",
    () =>
      new MemberService().signup({ memberNick: "ali", memberPhone: "010", memberPassword: "pw" }),
  ],
])("%s: eski 401 StaleSessionError bo'ladi", async (_label, call) => {
  const pending = deferred<any>();
  mockedAxios.post.mockReturnValueOnce(pending.promise);
  const request = call();
  await startOtherAuthChange();

  pending.reject(httpError(401));
  let error: any = null;
  await request.catch((err) => (error = err));
  expect(isStaleSessionError(error)).toBe(true);
});

test("login: joriy 401 asl xato bo'lib qoladi", async () => {
  mockedAxios.post.mockRejectedValueOnce(httpError(401));
  let error: any = null;
  await new MemberService()
    .login({ memberNick: "ali", memberPassword: "pw" })
    .catch((err) => (error = err));
  expect(isStaleSessionError(error)).toBe(false);
  expect(error.response.status).toBe(401);
});

/* ── Modal: eskirgan natija modal/input/alert'ga ta'sir qilmaydi ── */

const fillAndSubmitLogin = async (getByLabelText: any, getByText: any) => {
  await typeInto(getByLabelText("Username"), "ali");
  await typeInto(getByLabelText("Password"), "pw");
  await click(getByText("Sign In"));
};

test("login modal: eski 401 — modal ochiq, inputlar saqlanadi, alert yo'q", async () => {
  const props = { ...modalProps(), loginOpen: true };
  const { getByLabelText, getByText } = renderModal(props);
  const pending = deferred<any>();
  mockedAxios.post.mockReturnValueOnce(pending.promise);
  await fillAndSubmitLogin(getByLabelText, getByText);

  await startOtherAuthChange();
  pending.reject(httpError(401));
  await flush();

  expect(props.handleLoginClose).not.toHaveBeenCalled();
  expect((getByLabelText("Username") as HTMLInputElement).value).toBe("ali");
  expect((getByLabelText("Password") as HTMLInputElement).value).toBe("pw");
  expect(sweetErrorHandling).not.toHaveBeenCalled();
});

test("login modal: eski muvaffaqiyatli javob ham — modal ochiq, alert yo'q", async () => {
  const props = { ...modalProps(), loginOpen: true };
  const { getByLabelText, getByText } = renderModal(props);
  const pending = deferred<any>();
  mockedAxios.post.mockReturnValueOnce(pending.promise);
  await fillAndSubmitLogin(getByLabelText, getByText);

  await startOtherAuthChange();
  pending.resolve({ data: { member: memberA } });
  await flush();

  expect(props.handleLoginClose).not.toHaveBeenCalled();
  expect((getByLabelText("Username") as HTMLInputElement).value).toBe("ali");
  expect(sweetTopSmallSuccessAlert).not.toHaveBeenCalled();
  expect(localStorage.getItem("memberData")).toBeNull();
});

test("login modal: joriy 401 — oldingidek modal yopiladi va alert chiqadi", async () => {
  const props = { ...modalProps(), loginOpen: true };
  const { getByLabelText, getByText } = renderModal(props);
  mockedAxios.post.mockRejectedValueOnce(httpError(401));
  await fillAndSubmitLogin(getByLabelText, getByText);
  await flush();

  expect(props.handleLoginClose).toHaveBeenCalled();
  expect(sweetErrorHandling).toHaveBeenCalled();
});

test("signup modal: eski 401 — modal ochiq, inputlar saqlanadi, alert yo'q", async () => {
  const props = { ...modalProps(), signupOpen: true };
  const { getByLabelText, getByText } = renderModal(props);
  const pending = deferred<any>();
  mockedAxios.post.mockReturnValueOnce(pending.promise);
  await typeInto(getByLabelText("Username"), "ali");
  await typeInto(getByLabelText("Phone number"), "010");
  await typeInto(getByLabelText("Password"), "pw");
  await click(getByText("Create Account"));

  await startOtherAuthChange();
  pending.reject(httpError(401));
  await flush();

  expect(props.handleSignupClose).not.toHaveBeenCalled();
  expect(props.handleLoginClose).not.toHaveBeenCalled();
  expect((getByLabelText("Username") as HTMLInputElement).value).toBe("ali");
  expect((getByLabelText("Phone number") as HTMLInputElement).value).toBe("010");
  expect((getByLabelText("Password") as HTMLInputElement).value).toBe("pw");
  expect(sweetErrorHandling).not.toHaveBeenCalled();
});

/* ── Settings: eskirgan profil javobi ── */

const renderSettings = () =>
  render(
    <ContextProvider>
      <Settings />
    </ContextProvider>,
  );

test("Settings: logout'dan keyingi eski 500 — alert yo'q", async () => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  const { getByText } = renderSettings();
  const pending = deferred<any>();
  mockedAxios.mockReturnValueOnce(pending.promise);
  await click(getByText("Save Changes"));

  await startOtherAuthChange();
  pending.reject(httpError(500));
  await flush();

  expect(sweetErrorHandling).not.toHaveBeenCalled();
  expect(sweetTopSmallSuccessAlert).not.toHaveBeenCalled();
});

test("Settings: joriy sessiyadagi 500 — oldingidek alert chiqadi", async () => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  const { getByText } = renderSettings();
  mockedAxios.mockRejectedValueOnce(httpError(500));
  await click(getByText("Save Changes"));
  await flush();

  expect(sweetErrorHandling).toHaveBeenCalled();
});
