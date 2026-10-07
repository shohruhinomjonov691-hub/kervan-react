import React from "react";
import { act, render } from "@testing-library/react";
import axios from "axios";
import PaymentMethod from "./PaymentMethod";
import ContextProvider from "../../context/ContextProvider";
import { useGlobals } from "../../hooks/useGlobals";
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

// So'rov aynan StaleSessionError bilan rad etilishi shart — muvaffaqiyatli
// tugasa yoki boshqa xato bersa test yiqiladi
const expectStale = async (promise: Promise<any>) => {
  let error: any = null;
  try {
    await promise;
  } catch (err) {
    error = err;
  }
  expect(isStaleSessionError(error)).toBe(true);
};

// O'rnatilgan @types fireEvent'ni eksport qilmaydi — native click yetarli
const click = (element: HTMLElement) =>
  act(() => {
    element.click();
  });

const flush = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

const card = (last4: string) => ({
  cardBrand: "DEMO",
  cardLast4: last4,
  cardHolder: "x",
  cardExpiry: "12/39",
});
const memberA: any = { _id: "a1", memberNick: "ali" };
const memberB: any = { _id: "b2", memberNick: "bek" };
const stored = () => JSON.parse(localStorage.getItem("memberData") ?? "null");

let globals: ReturnType<typeof useGlobals>;
const GlobalsProbe = () => {
  globals = useGlobals();
  return <div data-testid="nick">{globals.authMember?.memberNick ?? "guest"}</div>;
};

const renderPage = () =>
  render(
    <ContextProvider>
      <GlobalsProbe />
      <PaymentMethod />
    </ContextProvider>,
  );

// Boshqa akkauntga o'tish: haqiqiy login oqimi + auth modal'dagidek setAuthMember
const switchAccountTo = async (member: any) => {
  mockedAxios.post.mockResolvedValueOnce({ data: { member } });
  await act(async () => {
    const result = await new MemberService().login({
      memberNick: member.memberNick,
      memberPassword: "pw",
    });
    globals.setAuthMember(result);
  });
};

beforeEach(() => {
  localStorage.clear();
  mockedAxios.get.mockReset();
  mockedAxios.post.mockReset();
  (sweetErrorHandling as jest.Mock).mockClear();
  (sweetTopSmallSuccessAlert as jest.Mock).mockClear();
  // Restore so'rovi bu testlarda hal bo'lmaydi — faqat karta oqimi tekshiriladi
  mockedAxios.get.mockReturnValue(new Promise(() => {}));
});

/* ── Service darajasi: storage faqat joriy sessiya + o'sha member uchun ── */

describe("MemberService karta javoblari", () => {
  const cases: Array<[string, () => Promise<any>]> = [
    ["generate", () => new MemberService().generatePaymentMethod()],
    [
      "save",
      () =>
        new MemberService().savePaymentMethod({
          cardHolder: "Ali",
          cardExpiry: "12/39",
        }),
    ],
    ["remove", () => new MemberService().removePaymentMethod()],
  ];

  test.each(cases)("%s: joriy sessiya javobi storage'ga yoziladi", async (_l, call) => {
    localStorage.setItem("memberData", JSON.stringify(memberA));
    mockedAxios.post.mockResolvedValueOnce({ data: { ...memberA, memberPayment: card("1111") } });
    await call();
    expect(stored().memberPayment.cardLast4).toBe("1111");
  });

  test.each(cases)(
    "%s: akkaunt almashgandan keyingi eski javob storage'ni bosmaydi",
    async (_l, call) => {
      localStorage.setItem("memberData", JSON.stringify(memberA));
      const pending = deferred<any>();
      mockedAxios.post.mockReturnValueOnce(pending.promise);
      const request = call();

      mockedAxios.post.mockResolvedValueOnce({ data: { member: memberB } });
      await new MemberService().login({ memberNick: "bek", memberPassword: "pw" });

      pending.resolve({ data: { ...memberA, memberPayment: card("1111") } });
      await expectStale(request);
      expect(stored()).toEqual(memberB);
    },
  );

  test.each(cases)("%s: logout'dan keyingi eski javob storage'ni tiklamaydi", async (_l, call) => {
    localStorage.setItem("memberData", JSON.stringify(memberA));
    const pending = deferred<any>();
    mockedAxios.post.mockReturnValueOnce(pending.promise);
    const request = call();

    mockedAxios.post.mockResolvedValueOnce({ data: { logout: true } });
    await new MemberService().logout();

    pending.resolve({ data: { ...memberA, memberPayment: card("1111") } });
    await expectStale(request);
    expect(stored()).toBeNull();
  });

  test("javobdagi member ID so'rov egasiga mos kelmasa — yozilmaydi", async () => {
    localStorage.setItem("memberData", JSON.stringify(memberA));
    mockedAxios.post.mockResolvedValueOnce({ data: { ...memberB, memberPayment: card("2222") } });
    await expectStale(new MemberService().generatePaymentMethod());
    expect(stored()).toEqual(memberA);
  });

  test("login kutilayotganda logout boshlansa — eski login javobi yozilmaydi", async () => {
    const pending = deferred<any>();
    mockedAxios.post.mockReturnValueOnce(pending.promise);
    const login = new MemberService().login({ memberNick: "ali", memberPassword: "pw" });

    mockedAxios.post.mockResolvedValueOnce({ data: { logout: true } });
    await new MemberService().logout();

    pending.resolve({ data: { member: memberA } });
    await expectStale(login);
    expect(stored()).toBeNull();
  });
});

/* ── Komponent darajasi: auth state, alert va loading ── */

test("Generate kutilayotganda B ga o'tilsa: A javobi B ning state/storage/alert/loading'iga ta'sir qilmaydi", async () => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  const { getByText, getByTestId, queryByText } = renderPage();

  const pending = deferred<any>();
  mockedAxios.post.mockReturnValueOnce(pending.promise);
  click(getByText("Generate demo card"));
  expect(getByText("Generating...")).toBeTruthy();

  await switchAccountTo(memberB);
  expect(getByTestId("nick").textContent).toBe("bek");
  // A'ning kutilayotgan so'rovi B uchun loading ko'rsatmaydi
  expect(queryByText("Generating...")).toBeNull();
  expect(getByText("Generate demo card")).toBeTruthy();

  pending.resolve({ data: { ...memberA, memberPayment: card("1111") } });
  await flush();

  expect(getByTestId("nick").textContent).toBe("bek");
  expect(globals.authMember?.memberPayment).toBeUndefined();
  expect(stored()).toEqual(memberB);
  expect(sweetTopSmallSuccessAlert).not.toHaveBeenCalled();
  expect(sweetErrorHandling).not.toHaveBeenCalled();
  expect(getByText("Generate demo card")).toBeTruthy();
});

test("eski so'rov tugashi B ning o'z kutilayotgan so'rovi loading'ini bo'shatmaydi", async () => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  const { getByText } = renderPage();

  const pendingA = deferred<any>();
  mockedAxios.post.mockReturnValueOnce(pendingA.promise);
  click(getByText("Generate demo card"));

  await switchAccountTo(memberB);
  const pendingB = deferred<any>();
  mockedAxios.post.mockReturnValueOnce(pendingB.promise);
  click(getByText("Generate demo card"));
  expect(getByText("Generating...")).toBeTruthy();

  pendingA.reject({ response: { status: 401, data: { reason: "AUTH_REQUIRED" } } });
  await flush();
  expect(getByText("Generating...")).toBeTruthy();
  expect(sweetErrorHandling).not.toHaveBeenCalled();

  pendingB.resolve({ data: { ...memberB, memberPayment: card("2222") } });
  await flush();
  expect(globals.authMember?.memberPayment?.cardLast4).toBe("2222");
  expect(stored().memberPayment.cardLast4).toBe("2222");
  expect(sweetTopSmallSuccessAlert).toHaveBeenCalledWith("Demo card created! 💳", 1200);
});

test("joriy sessiyada Generate odatdagidek ishlaydi", async () => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  const { getByText } = renderPage();

  mockedAxios.post.mockResolvedValueOnce({ data: { ...memberA, memberPayment: card("3333") } });
  click(getByText("Generate demo card"));
  await flush();

  expect(globals.authMember?.memberPayment?.cardLast4).toBe("3333");
  expect(getByText("•••• •••• •••• 3333")).toBeTruthy();
  expect(sweetTopSmallSuccessAlert).toHaveBeenCalled();
});
