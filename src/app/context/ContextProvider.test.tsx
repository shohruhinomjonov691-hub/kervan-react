import React from "react";
import { act, render } from "@testing-library/react";
import axios from "axios";
import ContextProvider from "./ContextProvider";
import { useGlobals } from "../hooks/useGlobals";
import MemberService from "../services/MemberService";

jest.mock("axios", () => {
  const fn: any = jest.fn();
  fn.get = jest.fn();
  fn.post = jest.fn();
  return { __esModule: true, default: fn };
});
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

// Mock qilingan so'rov promise'i va undan keyingi setState'larni yakunlash
const flush = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

const memberA = { _id: "a1", memberNick: "ali" };
const httpError = (status: number, data: any = {}) => ({
  response: { status, data },
});

const Probe = () => {
  const { authMember } = useGlobals();
  return <div data-testid="nick">{authMember?.memberNick ?? "guest"}</div>;
};

const renderWithProvider = () =>
  render(
    <ContextProvider>
      <Probe />
    </ContextProvider>,
  );

const stored = () => localStorage.getItem("memberData");

beforeEach(() => {
  localStorage.clear();
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  mockedAxios.mockReset();
  mockedAxios.get.mockReset();
  mockedAxios.post.mockReset();
});

test("anonim mehmon uchun /member/detail chaqirilmaydi", () => {
  const { getByTestId } = renderWithProvider();
  expect(getByTestId("nick").textContent).toBe("guest");
  expect(mockedAxios.get).not.toHaveBeenCalled();
});

test("200 — user serverdan tiklanadi va storage yangilanadi", async () => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  mockedAxios.get.mockResolvedValue({ data: { ...memberA, memberNick: "fresh" } });

  const { getByTestId } = renderWithProvider();
  await flush();
  expect(getByTestId("nick").textContent).toBe("fresh");
  expect(JSON.parse(stored() as string).memberNick).toBe("fresh");
});

test.each([
  ["401", httpError(401, { reason: "AUTH_REQUIRED" })],
  ["401 reason'siz", httpError(401)],
  ["404 MEMBER_INACTIVE", httpError(404, { reason: "MEMBER_INACTIVE" })],
])("%s — logout qilinadi", async (_label, error) => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  mockedAxios.get.mockRejectedValue(error);

  const { getByTestId } = renderWithProvider();
  await flush();
  expect(getByTestId("nick").textContent).toBe("guest");
  expect(stored()).toBeNull();
});

test.each([
  ["umumiy route 404 (Cannot GET)", httpError(404, "Cannot GET /member/detail")],
  ["proxy 404 (html)", httpError(404, "<html>Not Found</html>")],
  ["boshqa reason'li 404", httpError(404, { reason: "SOMETHING_ELSE" })],
  ["5xx", httpError(500, { code: 500 })],
  ["502 proxy", httpError(502, "Bad Gateway")],
  ["network", new Error("Network Error")],
])("%s — user saqlanib qoladi", async (_label, error) => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  mockedAxios.get.mockRejectedValue(error);

  const { getByTestId } = renderWithProvider();
  await flush();
  expect(mockedAxios.get).toHaveBeenCalled();
  expect(getByTestId("nick").textContent).toBe("ali");
  expect(JSON.parse(stored() as string)).toEqual(memberA);
});

/* ── Codex takrorlagan poygalar ── */

test("bir xil userga qayta login: eski restore 401 yangi loginni bekor qilmaydi", async () => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  const restore = deferred<any>();
  mockedAxios.get.mockReturnValue(restore.promise);
  mockedAxios.post.mockResolvedValue({ data: { member: memberA } });

  const { getByTestId } = renderWithProvider();
  // Restore kutilayotganda xuddi shu userga qayta login (storage JSON o'zgarmaydi)
  await act(async () => {
    await new MemberService().login({ memberNick: "ali", memberPassword: "pw" });
  });
  expect(stored()).toBe(JSON.stringify(memberA));

  restore.reject(httpError(401, { reason: "AUTH_REQUIRED" }));
  await flush();
  expect(getByTestId("nick").textContent).toBe("ali");
  expect(JSON.parse(stored() as string)).toEqual(memberA);
});

test("cookie bor, memberData yo'q: logout'dan keyin eski restore 200 userni tiklamaydi", async () => {
  document.cookie = "accessToken=token-a";
  const restore = deferred<any>();
  mockedAxios.get.mockReturnValue(restore.promise);
  mockedAxios.post.mockResolvedValue({ data: { logout: true } });

  const { getByTestId } = renderWithProvider();
  expect(mockedAxios.get).toHaveBeenCalled();
  await act(async () => {
    await new MemberService().logout();
  });

  restore.resolve({ data: memberA });
  await flush();
  expect(getByTestId("nick").textContent).toBe("guest");
  expect(stored()).toBeNull();
});

/* ── Restore → karta/profil yangilanishi poygasi (member-data revision) ── */

let globals: ReturnType<typeof useGlobals>;
const GlobalsProbe = () => {
  globals = useGlobals();
  return (
    <div data-testid="last4">{globals.authMember?.memberPayment?.cardLast4 ?? "none"}</div>
  );
};

const withCard = { ...memberA, memberPayment: { cardBrand: "DEMO", cardLast4: "7777", cardHolder: "ali", cardExpiry: "12/39" } };

test.each<[string, () => Promise<any>, () => void]>([
  [
    "generate",
    () => new MemberService().generatePaymentMethod(),
    () => mockedAxios.post.mockResolvedValueOnce({ data: withCard }),
  ],
  [
    "save",
    () => new MemberService().savePaymentMethod({ cardHolder: "ali", cardExpiry: "12/39" }),
    () => mockedAxios.post.mockResolvedValueOnce({ data: withCard }),
  ],
  [
    "profil yangilanishi",
    () => new MemberService().updateMember({ memberNick: "ali" }),
    () => mockedAxios.mockResolvedValueOnce({ data: withCard }),
  ],
])(
  "restore kutilayotganda %s tugasa — eski restore 200 yangi ma'lumotni bosmaydi",
  async (_label, update, mockResponse) => {
    localStorage.setItem("memberData", JSON.stringify(memberA));
    const restore = deferred<any>();
    mockedAxios.get.mockReturnValue(restore.promise);

    const { getByTestId } = render(
      <ContextProvider>
        <GlobalsProbe />
      </ContextProvider>,
    );

    mockResponse();
    await act(async () => {
      globals.setAuthMember(await update()); // komponentlardagidek
    });
    expect(getByTestId("last4").textContent).toBe("7777");

    // Restore'ning kartasiz eski snapshot'i keyinroq keladi
    restore.resolve({ data: memberA });
    await flush();
    expect(getByTestId("last4").textContent).toBe("7777");
    expect(JSON.parse(stored() as string).memberPayment.cardLast4).toBe("7777");
  },
);

test("restore kutilayotganda yozuv bo'lmasa — restore 200 odatdagidek qo'llanadi", async () => {
  localStorage.setItem("memberData", JSON.stringify(memberA));
  const restore = deferred<any>();
  mockedAxios.get.mockReturnValue(restore.promise);
  const { getByTestId } = render(
    <ContextProvider>
      <GlobalsProbe />
    </ContextProvider>,
  );
  restore.resolve({ data: withCard });
  await flush();
  expect(getByTestId("last4").textContent).toBe("7777");
});
