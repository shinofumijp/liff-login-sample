import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import liff from "@line/liff";

const LIFF_ID = import.meta.env.VITE_LIFF_ID as string;

function App() {
  const [msg, setMsg] = useState("initializing…");
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    (async () => {
      await liff.init({ liffId: LIFF_ID });
      if (!liff.isLoggedIn()) {
        liff.login({ scope: "openid email profile", state: crypto.randomUUID(), nonce: crypto.randomUUID() });
        return;
      }
      setMsg("logged-in");
    })();
  }, []);

  const loginWithLine = async () => {
    const idToken = liff.getIDToken();
    const res = await fetch("/auth/line/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ idToken })
    });
    const json = await res.json();
    setMe(json);
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>LIFF × Rails PoC</h3>
      <div>{msg}</div>
      <button onClick={loginWithLine}>LINEでログイン</button>
      <pre>{JSON.stringify(me, null, 2)}</pre>
      <hr/>
      <input id="login_id" placeholder="login_id" />
      <input id="password" type="password" placeholder="password" />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={async () => {
          const login_id = (document.getElementById("login_id") as HTMLInputElement).value;
          const password = (document.getElementById("password") as HTMLInputElement).value;
          const r = await fetch("/auth/password/register", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login_id, password })
          }); alert(await r.text());
        }}>ID/PW登録</button>
        <button onClick={async () => {
          const login_id = (document.getElementById("login_id") as HTMLInputElement).value;
          const password = (document.getElementById("password") as HTMLInputElement).value;
          const r = await fetch("/auth/password/login", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login_id, password })
          }); alert(await r.text());
        }}>ID/PWログイン</button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
